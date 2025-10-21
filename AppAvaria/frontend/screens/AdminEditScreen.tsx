import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminEdit'>;

export default function AdminEditScreen({ route, navigation }: Props) {
  const { user, onUpdate } = route.params;

  const [token, setToken] = useState('');
  const [novonome, setNovonome] = useState(user.username);
  const [novasenha, setNovasenha] = useState('');
  

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
  };

  const editUser = async () => {
    try {
      const body: any = { username: novonome };
      if (novasenha.trim() !== '') body.password = novasenha;

      const res = await fetch(`http://10.1.12.161:5000/admin/edit_user/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status !== 200) {
        Alert.alert('Erro', data.msg || 'Erro ao atualizar usuário');
        return;
      }

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso');
      if (onUpdate) await onUpdate();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Erro de rede');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editar Usuário</Text>

      <TextInput
        style={styles.input}
        value={novonome}
        onChangeText={setNovonome}
        placeholder="Novo nome"
      />

     

      <TextInput
        style={styles.input}
        value={novasenha}
        onChangeText={setNovasenha}
        placeholder="Nova senha"
        secureTextEntry
      />

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={editUser} style={styles.salvar}>
          Salvar
        </Button>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.cancelar}>
          Cancelar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: 20, paddingTop: 60 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6, marginBottom: 10, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  salvar: { backgroundColor: cores.secundario, flex: 1, marginRight: 8 },
  cancelar: { backgroundColor: cores.secundario, flex: 1 },
  roleSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  roleButton: { flex: 1, backgroundColor: cores.secundario, marginHorizontal: 4 },
});
