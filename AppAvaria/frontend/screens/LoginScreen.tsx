import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Botao from '../components/Botao';
import { cores, estilosGlobais } from '../styles/theme';
import { AuthContext } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, user } = useContext(AuthContext); // pega user do contexto
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      await login(usuario, senha);

      // pega token diretamente do AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      // testa rota protegida
      const res = await fetch("http://10.1.12.161:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Erro desconhecido");
      }

      const data = await res.json();
      Alert.alert("Login OK", `Usuário: ${data.user.username}\nRole: ${data.user.role}`);
      navigation.replace("Home");
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Erro desconhecido");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.tituloPrincipal}>Relatório de Avaria Digital</Text>
      <Text style={styles.subtitulo}>Acesse preenchendo os campos abaixo</Text>

      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        placeholder="Digite seu usuário"
        placeholderTextColor="#A0A0A0"
        value={usuario}
        onChangeText={setUsuario}
        style={[estilosGlobais.input, styles.inputCustom]}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder="Digite sua senha"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={[estilosGlobais.input, styles.inputCustom]}
      />

      <View style={styles.botaoContainer}>
        <Botao label="Entrar" onPress={handleLogin} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, alignItems: 'center', paddingHorizontal: 20, paddingTop: 60 },
  tituloPrincipal: { color: cores.branco, fontSize: 25, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  subtitulo: { color: '#DCE6F1', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  logo: { width: 200, height: 100, marginBottom: 50 },
  label: { fontWeight: "bold", marginTop: 15, color: cores.branco, alignSelf: 'flex-start' },
  inputCustom: { width: '100%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 20, fontSize: 16, color: '#000', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  botaoContainer: { width: '100%', marginTop: 20 },
});
