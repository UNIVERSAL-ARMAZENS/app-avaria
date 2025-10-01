import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import FotosScreen from '../screens/FotosScreen'
import SalvosScreen from '../screens/SalvosScreen'
import AssScreen from '../screens/AssScreen'
import HomeScreen from '../screens/HomeScreen'
import { AuthContext } from "../services/api"; 
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

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


const Stack = createNativeStackNavigator<RootStackParamList>();

const AdminScreen = () => <Text>Admin</Text>; // provisório

export default function AppStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // ou Splash screen

  return (
    <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="Fotos" component={FotosScreen} />
          <Stack.Screen name="Salvos" component={SalvosScreen} />
          <Stack.Screen name="Ass" component={AssScreen} />
          {user && user.role === "admin" && <Stack.Screen name="Admin" component={AdminScreen} />}

        </>
      )}
    </Stack.Navigator>
  );
}