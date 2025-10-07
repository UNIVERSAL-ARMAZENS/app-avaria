import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput, // IMPORTADO AQUI
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminList'>;
type UserType = { id: number; username: string; role: string };

export default function AdminListScreen({ navigation }: Props) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [token, setToken] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [novonome, setNovonome] = useState('');
  const [novasenha, setNovasenha] = useState('');
  const [novorole, setNovorole] = useState('');

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
      <Text style={styles.titulo}>Usuários Cadastrados</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            {editingId === item.id ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <TextInput
                  style={styles.input}
                  value={novonome}
                  onChangeText={setNovonome}
                  placeholder="Novo Nome"
                />
                <TextInput
                  style={styles.input}
                  value={novasenha}
                  onChangeText={setNovasenha}
                  placeholder="Nova Senha"
                  secureTextEntry
                />
                <Picker
                  selectedValue={novorole}
                  onValueChange={setNovorole}
                  style={styles.picker}
                >
                  <Picker.Item label="User" value="user" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
                <TouchableOpacity
                  style={[styles.botao, { marginLeft: 10 }]}
                  onPress={() => editUser(item.id)}
                >
                  <Text style={styles.botao}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botao, { marginLeft: 10 }]}
                  onPress={() => setEditingId(null)}
                >
                  <Text style={ styles.botao }>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.userRow}>
                <Text style={styles.userText}>
                  {item.username} ({item.role})
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    setEditingId(item.id);
                    setNovonome(item.username);
                    setNovorole(item.role);
                  }}
                >
                  <Text style={styles.botao }>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => deleteUser(item.id)}
                >
                  <Text style={ styles.botao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: cores.branco, textAlign: 'center' }}>
            Nenhum usuário encontrado.
          </Text>
        }
        style={{ alignSelf: 'stretch', marginBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.botao, { marginTop: 20 }]}
        onPress={() => navigation.navigate('AdminCreate')}
      >
        <Text style={styles.textoBotao}>Cadastrar Novo Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: cores.fundo,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 150,
    color: cores.branco,
    alignSelf: 'flex-start',
  },
  titulo: {
    fontSize: 25,
    height: 30,
    fontWeight: '700',
    color: cores.branco,
    marginTop: 40,  
    marginBottom: 20,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userText: {
    color: cores.branco,
  },
  botao: {
    backgroundColor: cores.secundario,
    padding: 10,
    borderRadius: 6,
  },
  textoBotao: {
    color: cores.branco,
    fontWeight: '600',
    textAlign: 'center',
  },
   input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginRight: 5,
    minWidth: 100,
    marginVertical: 5,
  },
  picker: {
    height: 40,
    width: 100,
    marginTop: 40,
    
  },
});
