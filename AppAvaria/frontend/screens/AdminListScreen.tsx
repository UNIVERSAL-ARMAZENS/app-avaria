import React, { act, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';
import { DataTable, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminList'>;
type UserType = { id: number; username: string; role: string };

export default function AdminListScreen({ navigation }: Props) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [token, setToken] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [novonome, setNovonome] = useState('');
  const [novasenha, setNovasenha] = useState('');
const [novorole, setNovorole] = useState('');
const [open, setOpen] = useState(false);
const [value, setValue] = useState(novorole);
const [items, setItems] = useState([
  { label: 'Usuário', value: 'user' },
  { label: 'Administrador', value: 'admin' },
]);



  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const t = await AsyncStorage.getItem('token');
    if (!t) {
      Alert.alert('Erro', 'Token ausente');
      navigation.replace('Login');
      return;
    }
    setToken(t);
    loadUsers(t);
  };

  const loadUsers = async (t: string) => {
    try {
      const res = await fetch('http://10.1.12.161:5000/admin/users', {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.status === 200) setUsers(await res.json());
      else Alert.alert('Erro', 'Falha ao carregar lista de usuários.');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`http://10.1.12.161:5000/admin/delete_user/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        Alert.alert('Usuário removido');
        loadUsers(token);
      } else {
        Alert.alert('Erro', (await res.json()).msg);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro de rede');
    }
  };
const change_password = async (id: number) => {
  try {
    const res = await fetch(`http://10.1.12.161:5000/admin/change_password/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: novasenha,
      }),
    });
     
  } catch (err) {
    console.error(err);
    Alert.alert('Erro de rede');
  }
};

const editUser = async (id: number) => {
  try {
    const res = await fetch(`http://10.1.12.161:5000/admin/edit_user/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: novonome,
        password: novasenha,
        role: novorole,
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      Alert.alert('Sucesso', data.msg);
      loadUsers(token);
      setEditingId(null); 
      setNovonome('');
      setNovasenha('');
      setNovorole('');
    } else {
      Alert.alert('Erro', data.msg || 'Erro ao editar usuário');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Erro de rede');
  }
};

 return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel de Usuários</Text>

      <DataTable style={styles.tabela}>
        <DataTable.Header style={{ backgroundColor: '#0d2566' }}>
          <DataTable.Title textStyle={{ color: '#fff' }}>Usuário</DataTable.Title>
          <DataTable.Title textStyle={{ color: '#fff' }}>Função</DataTable.Title>
          <DataTable.Title numeric textStyle={{ color: '#fff' }}>Ações</DataTable.Title>
        </DataTable.Header>
        {users.length === 0 ? (
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
            </DataTable.Cell>
          </DataTable.Row>
        ) : (
          users.map((u) => (
            editingId === u.id ? (
              <DataTable.Row key={u.id}>
                <DataTable.Cell style={{ flex: 1 }} textStyle={{ color: '#fff' }}>
                  <TextInput
                    style={styles.input}
                    value={novonome}
                    onChangeText={setNovonome}
                    placeholder="Novo nome"
                    placeholderTextColor="#999"
                  />
<DropDownPicker
  open={open}
  value={value}
  items={items}
  setOpen={setOpen}
  setValue={setValue}
  onChangeValue={(val) => setNovorole(val ?? '')}
  setItems={setItems}
  containerStyle={{ height: 50 }}
  style={{ backgroundColor: '#fff' }}
  dropDownContainerStyle={{ backgroundColor: '#fff' }}
  textStyle={{ color: '#000' }}
/>

                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 5 }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 5 }]}
                      value={novasenha}
                      onChangeText={setNovasenha}
                      placeholder="Nova senha"
                      placeholderTextColor="#999"
                      secureTextEntry
                    />
                    <Button
                      compact
                      mode="contained"
                      buttonColor="#28a745"
                      textColor="#fff"
                      onPress={() => editUser(u.id)}
                      style={{ marginRight: 5 }}
                    >
                      Salvar
                    </Button>
                    <Button
                      compact
                      mode="contained"
                      buttonColor="#6c757d"
                      textColor="#fff"
                      onPress={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ) : (
              <DataTable.Row key={u.id}>
                <DataTable.Cell textStyle={{ color: '#fff' }}>{u.username}</DataTable.Cell>
                <DataTable.Cell textStyle={{ color: '#fff' }}>
                  {u.role === 'admin' ? 'Administrador' : 'Usuário'}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 5 }}>
                    <Button
                      compact
                      mode="contained"
                      buttonColor="#007bff"
                      textColor="#fff"
                      onPress={() => {
                        setEditingId(editingId === u.id ? null : u.id);
                        setNovonome(u.username);
                        setNovorole(u.role);
                        setNovasenha('');
                      }}
                      style={{ marginRight: 5 }}
                    >
                      Editar
                    </Button>
                    <Button
                      compact
                      mode="contained"
                      buttonColor="#dc3545"
                      textColor="#fff"
                      onPress={() => deleteUser(u.id)}
                    >
                      Excluir
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            )
          ))
        )}
      </DataTable>

      <Button
        mode="contained"
        buttonColor={cores.secundario}
        style={styles.novoUsuario}
        onPress={() => navigation.navigate('AdminCreate')}
      >
        Novo Usuário
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2566',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  tabela: {
    backgroundColor: '#0d2566',
    borderBottomWidth: 2,
    borderBottomColor: '#999',
    borderRadius: 10,
  },
  salvar: {
    backgroundColor: '#28a745',
  },
  cancelar: {
    backgroundColor: '#6c757d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
  },
  coluna: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
picker: {
 height: 50,       
    color: '#000',    
    backgroundColor: '#fff'
},

  card: {
    backgroundColor: '#142850',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  botao: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editar: {
    backgroundColor: '#007bff',
  },
  excluir: {
    backgroundColor: '#dc3545',
  },
  novoUsuario: {
    marginTop: 20,
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
