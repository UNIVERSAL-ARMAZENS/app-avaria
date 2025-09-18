// LoginScreen.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput placeholder="Usuário" style={styles.input} />
      <TextInput placeholder="Senha" style={styles.input} secureTextEntry />
     <Button title="Entrar" onPress={() => navigation.navigate('Registro')} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
