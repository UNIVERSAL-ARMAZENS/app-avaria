import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Botao from '../components/Botao';
import { cores, estilosGlobais } from '../styles/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    // Validação real depois
    navigation.navigate('Registro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Título principal */}
      <Text style={styles.tituloPrincipal}>Relatório de Avaria Digital</Text>
      <Text style={styles.subtitulo}>Acesse preenchendo os campos abaixo</Text>

      {/* Logo centralizada */}
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Inputs */}
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

      {/* Botão */}
      <View style={styles.botaoContainer}>
        <Botao label="Entrar" onPress={handleLogin} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  tituloPrincipal: {
    color: cores.branco,
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    color: '#DCE6F1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },

  logo: {
    width: 200,
    height: 100,
    marginBottom: 50,
  },

  label: {
    fontWeight: "bold", 
    marginTop: 15,
    color: cores.branco,
    alignSelf: 'flex-start'
  },

  inputCustom: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // sombra no Android
  },

  botaoContainer: {
    width: '100%',
    marginTop: 20,
  },
});
