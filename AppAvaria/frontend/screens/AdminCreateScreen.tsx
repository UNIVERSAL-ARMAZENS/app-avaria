import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminCreate'>; // Tipagem das props de navegação

export default function AdminCreateScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState<'user' | 'admin'>('user'); // Define o papel do usuário
  const [token, setToken] = useState(''); // Token de autenticação

  useEffect(() => { getToken(); }, []); // Pega o token ao montar o componente

  const getToken = async () => {
    const t = await AsyncStorage.getItem('token');
    if (!t) { Alert.alert('Token ausente'); return; }
    setToken(t); // Salva o token no estado
  };

  const createUser = async () => { // Função para criar um novo usuário
    if (!username || !password) return Alert.alert('Preencha todos os campos'); 

    try {
      const res = await fetch('http://10.1.12.161:5000/admin/create_user', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      }); // Faz a requisição para criar o usuário
      const data = await res.json(); // Pega a resposta em JSON
      if (res.status === 201) {
        Alert.alert('Usuário criado com sucesso');
        setUsername(''); setPassword('');
        navigation.navigate('AdminList'); // vai para a lista
      } else Alert.alert('Erro', data.msg);
    } catch (err) { console.error(err); Alert.alert('Erro de rede'); }
  }; 

  return (
  
    <View style={styles.container}>
      <View style={ styles. card}>
      <Text style={styles.titulo}>Criar Usuário</Text>
      <TextInput placeholder="Usuário" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
      <TouchableOpacity style={styles.botao} onPress={createUser}>
        <Text style={styles.textoBotao}>Criar Usuário</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, alignItems: 'center', paddingHorizontal: 20, paddingTop: 60 ,},
  card: { backgroundColor: cores.card, width: '100%', borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, marginTop:100, },
  titulo:{ fontSize:20, fontWeight:'700', color:cores.branco, marginTop:20, marginBottom:20, textAlign:'center' },
  input: {marginTop: 15,  backgroundColor: cores.branco, borderRadius: 50, padding: 25, marginBottom: 20, width: '90%' },
  botao:{marginTop: -50, backgroundColor:cores.secundario, borderRadius: 50, padding:25, width:'50%', alignItems:'center' },
  textoBotao:{ color:'#fff', fontWeight:'600' },
  picker: {marginBottom: 30, marginTop: -70,  borderRadius: 50, width: '80%' },
});
