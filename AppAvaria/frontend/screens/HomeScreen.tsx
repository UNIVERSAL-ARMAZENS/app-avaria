import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
  const { salvos, setSalvos } = route.params || { salvos: [], setSalvos: () => {} };
  const [user, setUser] = useState<{ nome: string; role: string } | null>(null);

useEffect(() => {
  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser({ nome: u.username, role: u.role });
    }
  };
  loadUser();
}, []);



  if (!user) return null; // ou loading spinner

  return (
  <SafeAreaView style={styles.container}>
    {user?.role === 'admin' && (
      <TouchableOpacity
        style={styles.botaoAdmin}
        onPress={() => navigation.navigate('AdminList')}
      >
        <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    )}

    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
      Olá, {user.nome}!
    </Text>

    <Text style={styles.titulo}>Menu Principal</Text>

    <TouchableOpacity
      style={styles.botao}
      onPress={() => navigation.navigate('Salvos', { salvos, setSalvos })}
    >
      <Text style={styles.textoBotao}>Verificar Avarias Pendentes</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.botao}
      onPress={() => navigation.navigate('Registro', { salvos, setSalvos })}
    >
      <Text style={styles.textoBotao}>Adicionar Avaria</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.botao, styles.botaoSair]}
      onPress={() => navigation.replace('Login')}
    >
      <Text style={styles.textoBotao}>Sair</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: cores.fundo, 
    padding: 20 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: cores.branco, 
    marginBottom: 40 
  },
  botao: { 
    width: '100%', 
    backgroundColor: cores.secundario, 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 8, 
    alignItems: 'center' 
  },
  botaoSair: { 
    backgroundColor: 'red' 
  },
 botaoAdmin: {
  position: 'absolute',
  top: 50,
  right: 20,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#1E40AF',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},


  textoBotao: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
