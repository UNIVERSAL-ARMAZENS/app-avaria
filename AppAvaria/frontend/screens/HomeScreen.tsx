
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';
import { USUARIO_LOGADO } from '../components/test';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
   const { salvos, setSalvos } = route.params || { salvos: [], setSalvos: () => {} };
  return (
    <View style={styles.container}>
       <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
    Olá, {USUARIO_LOGADO.nome}!
  </Text>
      <Text style={styles.titulo}>Menu Principal</Text>
   
      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => navigation.navigate('Salvos', { salvos, setSalvos })}
      >
        <Text style={styles.textoBotao}> Verificar Avarias Pendentes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => navigation.navigate('Registro', { salvos, setSalvos })}
      >
        <Text style={styles.textoBotao}> Adicionar Avaria</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.botao, styles.botaoSair]} 
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.textoBotao}> Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo, padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.branco, marginBottom: 40 },
  botao: { width: '100%', backgroundColor: cores.secundario, padding: 15, borderRadius: 10, marginVertical: 8, alignItems: 'center' },
  botaoSair: { backgroundColor: 'red' },
  textoBotao: { color: 'white', fontSize: 16, fontWeight: '600' },
});
