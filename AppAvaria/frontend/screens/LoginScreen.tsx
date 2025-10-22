import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import Botao from '../components/Botao';
import { cores } from '../styles/theme';
import { AuthContext, AuthContextType } from '../services/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const auth = useContext(AuthContext) as AuthContextType;
  const { login } = auth;

  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login(usuario, senha);
      if (user?.new_password) {
        navigation.replace('ResetPassword', { userId: user.id });
      } else {
        navigation.replace('Home');
      }
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro desconhecido');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.tituloPrincipal}>Relatório de Avaria Digital</Text>
          <Text style={styles.subtitulo}>Acesse com suas credenciais</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              placeholder="Digite seu usuário"
              placeholderTextColor="#8A8A8A"
              value={usuario}
              onChangeText={setUsuario}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Digite sua senha"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
            />

            <View style={styles.botaoContainer}>
              <Botao label="Entrar" onPress={handleLogin} />
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>© 2025 — Sistema Interno</Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo, // fundo corporativo azul petróleo
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
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
  logo: {
    width: 140,
    height: 70,
    marginBottom: 20,
  },
  tituloPrincipal: {
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
  form: {
    width: '100%',
  },
  label: {
    color: '#E2E8F0',
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    marginBottom: 18,
  },
  botaoContainer: {
    width: '100%',
    marginTop: 10,
  },
  footerText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 30,
  },
});
