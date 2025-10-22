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
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser({ nome: u.username, role: u.role });
      }
    };
    loadUser();
  }, []);

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>

      {/* Botão Admin */}
      {user.role === 'admin' && (
        <TouchableOpacity
          style={styles.botaoAdmin}
          onPress={() => navigation.navigate('AdminList')}
        >
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Conteúdo central */}
      <View style={styles.conteudo}>
        <Text style={styles.greeting}>Olá, {user.nome}!</Text>
        <Text style={styles.subtitulo}>Menu Principal</Text>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('Salvos', { salvos, setSalvos })}
          >
            <Text style={styles.textoBotao}>Avarias Pendentes</Text>
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
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo, // azul petróleo corporativo
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  conteudo: {
       width: '100%',
    backgroundColor: cores.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  greeting: {
     color: cores.titulo,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: cores.subtitulo,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
  },
  menu: {
    width: '100%',
    alignItems: 'center',
  },
  botao: {
    width: '100%',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  botaoSair: {
    backgroundColor: '#EF4444',
     width: '100%',
    
  },
  botaoAdmin: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 40,
    backgroundColor: cores.secundario,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
