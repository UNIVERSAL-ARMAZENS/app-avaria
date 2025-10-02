import React, { useContext } from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import FotosScreen from '../screens/FotosScreen';
import SalvosScreen from '../screens/SalvosScreen';
import AssScreen from '../screens/AssScreen';
import HomeScreen from '../screens/HomeScreen';
import { AuthContext } from '../services/api';

export type RootStackParamList = {
  Login: undefined;
  Home: {
    salvos: RegistroPendente[];
    setSalvos: React.Dispatch<React.SetStateAction<RegistroPendente[]>>;
  };
  Registro: {
    id?: string;
    conhecimento?: string;
    quantidade?: string;
    horarioDeslacre?: Date;
    horarioInicio?: Date;
    horarioFim?: Date;
    descricao?: string;
    imagens?: string[];
    salvos?: RegistroPendente[];
    setSalvos?: React.Dispatch<React.SetStateAction<RegistroPendente[]>>;
  } | undefined;
  Fotos: {
    id: string;
    conhecimento: string;
    quantidade: string;
    horarioDeslacre: Date;
    horarioInicio: Date;
    horarioFim: Date;
    descricao?: string;
    imagens?: string[];
    salvos: RegistroPendente[];
    setSalvos: React.Dispatch<React.SetStateAction<RegistroPendente[]>>;
  };
  Salvos: {
    salvos: RegistroPendente[];
    setSalvos: React.Dispatch<React.SetStateAction<RegistroPendente[]>>;
  };
  Ass: {
    conhecimento: string;
    quantidade: string;
    horarioDeslacre: Date;
    horarioInicio: Date;
    horarioFim: Date;
    descricao: string;
    imagens: string[];
  };
  Admin: undefined;
};

export type RegistroPendente = {
  id: string;
  conhecimento: string;
  quantidade: string;
  horarioDeslacre: Date;
  horarioInicio: Date;
  horarioFim: Date;
  descricao?: string;
  imagens?: string[];
  ultimaTela?: 'Registro' | 'Fotos';
};

// Tipagem correta do contexto
type AuthContextType = {
  user: any | null;
  loading: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AdminScreen = () => <Text>Admin</Text>; // provisório

export default function AppStack() {
  const auth = useContext(AuthContext) as AuthContextType;

  if (!auth) return null; // fallback seguro
  const { user, loading } = auth;

  if (loading) return null; // Splash screen ou carregando

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Login sempre disponível */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* Rotas privadas só se houver user */}
      {user && (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="Fotos" component={FotosScreen} />
          <Stack.Screen name="Salvos" component={SalvosScreen} />
          <Stack.Screen name="Ass" component={AssScreen} />
          {user.role === 'admin' && (
            <Stack.Screen name="Admin" component={AdminScreen} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
