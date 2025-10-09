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
import AdminCreateScreen from '../screens/AdminCreateScreen';
import AdminListScreen from '../screens/AdminListScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AdminEditScreen from '../screens/AdminEditScreen';
 

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
  AdminList: undefined;      
  AdminCreate: undefined; 
  AdminEdit :  {
    user: any;
    onUpdate: () => Promise<void> | void;
  };
  ResetPassword : undefined;  
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


export default function AppStack() {
  const auth = useContext(AuthContext) as AuthContextType;

  if (!auth) return null; // fallback seguro
  const { user, loading } = auth;

  if (loading) return null; 

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
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />


      {/* Admin só se role === 'admin' */}
      {user.role === 'admin' && (
        <>
          <Stack.Screen name="AdminList" component={AdminListScreen} />
          <Stack.Screen name="AdminCreate" component={AdminCreateScreen} />
          <Stack.Screen name="AdminEdit" component={AdminEditScreen} />
        </>
      )}
    </>
  )}
    </Stack.Navigator>
  );
}
