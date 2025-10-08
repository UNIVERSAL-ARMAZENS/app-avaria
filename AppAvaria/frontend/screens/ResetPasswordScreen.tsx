import React, { act, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppStack';
import { cores } from '../styles/theme';


type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

type UserType = { id: number; username: string; role: string };

export default function ResetPasswordScreen({ navigation }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            if (storedToken) setToken(storedToken);
            if (storedUser) setUser(JSON.parse(storedUser));
        };
        fetchUserData();
    }
    , []);
    const handleResetPassword = async () => {
        if (!usuario || !senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
            return;
        }
        if (novaSenha.length < 6) {
            Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`http://10.1.12.161:5000/admin/change_password/${user?.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: usuario,
                    current_password: senhaAtual,
                    new_password: novaSenha,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Sucesso', 'Senha alterada com sucesso.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.replace('Login'),
                    },
                ]);
            }
            else {
                Alert.alert('Erro', data.msg || 'Erro desconhecido');
            }
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro desconhecido');
        }
        finally {

            setIsLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Redefinir Senha</Text>
            <TextInput
                placeholder="Usuário"
                placeholderTextColor="#A0A0A0"
                value={usuario}
                onChangeText={setUsuario}
                style={styles.input}
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput
                placeholder="Senha Atual"
                placeholderTextColor="#A0A0A0"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
            />

            <TextInput


                placeholder="Nova Senha"
                placeholderTextColor="#A0A0A0"
                value={novaSenha}
                onChangeText={setNovaSenha}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TextInput


                placeholder="Confirmar Nova Senha"
                placeholderTextColor="#A0A0A0"
                value={confirmarSenha}  
                onChangeText={setConfirmarSenha}
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={isLoading}
            >   
                <Text style={styles.buttonText}>{isLoading ? 'Alterando...' : 'Alterar Senha'}</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: cores.branco,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: cores.branco,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#555',
    },
    button: {

        width: '100%',

        height: 50,
        backgroundColor: '#0d2566',
        borderRadius: 8,
        alignItems: 'center',

        justifyContent: 'center',
        marginTop: 10,
        opacity: 1,
    },
    buttonText: {
        color: cores.branco,
        fontSize: 18,
        fontWeight: 'bold',
    },
});


