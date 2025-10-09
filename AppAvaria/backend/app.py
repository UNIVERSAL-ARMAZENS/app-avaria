from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

# CONFIG
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "TROQUE_ESSA_CHAVE_SEGURA_AQUI"

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# ==========================================
# MODELO DE USUÁRIO
# ==========================================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='user') 
    new_password = db.Column(db.String(200), nullable=True)  # Para reset de senha

# ==========================================
# DECORATORS JWT
# ==========================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'msg': 'Token ausente'}), 401
        try:
            token = token.split()[1]  # Bearer <token>
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['id'])
            if not current_user:
                raise Exception("Usuário não encontrado")
            request.user = current_user
        except Exception as e:
            return jsonify({'msg': 'Token inválido', 'detail': str(e)}), 401
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user.role != "admin":
            return jsonify({"msg": "Acesso negado: admin apenas"}), 403
        return f(*args, **kwargs)
    return decorated

# ==========================================
# ROTAS DE AUTENTICAÇÃO
# ==========================================
@app.route('/register_admin_initial', methods=['POST'])
def register_admin_initial():
    """Cria o primeiro admin manualmente."""
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Usuário já existe"}), 400
    hashed = generate_password_hash(data['password'])
    admin = User(username=data['username'], password=hashed, role='admin')
    db.session.add(admin)
    db.session.commit()
    return jsonify({"msg": "Admin criado"}), 201


@app.route('/login', methods=['POST'])
def login():
    """Login e geração de token JWT."""
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'msg': 'Credenciais inválidas'}), 401

    token = jwt.encode({
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=12)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role,
           'new_password': user.new_password
        }
    })

# ==========================================
# ROTAS ADMIN
# ==========================================
@app.route('/admin/create_user', methods=['POST'])
@admin_required
def create_user():
    """Criação de usuário normal ou admin."""
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'msg': 'Usuário já existe'}), 400
    hashed = generate_password_hash(data['password'])
    user = User(username=data['username'], password=hashed, role=data.get('role', 'user'))
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Usuário criado com sucesso', 'user': {
        'id': user.id,
        'username': user.username,
        'role': user.role
    }}), 201


@app.route('/admin/users', methods=['GET'])
@admin_required
def list_users():
    """Listar todos os usuários (visível na AdminScreen)."""
    users = User.query.all()
    result = [{'id': u.id, 'username': u.username, 'role': u.role} for u in users]
    return jsonify(result)

@app.route('/admin/edit_user/<int:user_id>', methods=['PUT'])
@admin_required
def edit_user(user_id):
    """Editar um usuário."""
    data = request.json
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuário não encontrado'}), 404
    if 'username' in data:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'msg': 'Nome de usuário já existe'}), 400
        user.username = data['username']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if 'role' in data:
        user.role = data['role']
    db.session.commit()
    return jsonify({'msg': 'Usuário atualizado com sucesso', 'user': {
        'id': user.id,
        'username': user.username,
        'role': user.role
    }}), 200
@app.route('/admin/change_password/<int:user_id>', methods=['PUT'])
@token_required
def change_password(user_id):
    current_user = request.user  # Usuário autenticado via token
    target_user = User.query.get(user_id)
    data = request.json

    if not target_user:
        return jsonify({'msg': 'Usuário não encontrado'}), 404

    # Verificação de permissão
    if current_user.role != 'admin' and current_user.id != user_id:
        return jsonify({'msg': 'Acesso negado'}), 403

    # Se NÃO for admin, precisa fornecer a senha atual
    if current_user.role != 'admin':
        if not check_password_hash(target_user.password, data.get('current_password', '')):
            return jsonify({'msg': 'Senha atual incorreta'}), 400

    # Atualiza a senha
    if 'new_password' in data and data['new_password'].strip():
        target_user.password = generate_password_hash(data['new_password'].strip())

        # 👉 Sinaliza que o usuário precisa trocar a senha no próximo login
        if current_user.role == 'admin':
            target_user.new_password = True
    else:
        return jsonify({'msg': 'Nova senha inválida'}), 400

    db.session.commit()
    return jsonify({'msg': 'Senha alterada com sucesso'}), 200




@app.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Remover um usuário."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuário não encontrado'}), 404
    if user.role == 'admin':
        return jsonify({'msg': 'Não é permitido excluir admins'}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'Usuário removido com sucesso'}), 200


# ==========================================
# ROTA DE TESTE
# ==========================================
@app.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'msg': 'Token válido',
                    'user': {'username': request.user.username, 'role': request.user.role}})

# ==========================================
# START
# ==========================================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
