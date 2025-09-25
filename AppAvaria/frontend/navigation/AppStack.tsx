import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import FotosScreen from '../screens/FotosScreen'
import SalvosScreen from '../screens/SalvosScreen'
import AssScreen from '../screens/AssScreen'
export type RootStackParamList = {
  Login: undefined;
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

export default function AppStack() {
  return (
<Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Registro" component={RegistroScreen} />
  <Stack.Screen name ="Fotos" component ={FotosScreen}/>
  <Stack.Screen name ="Salvos" component ={SalvosScreen}/>
  <Stack.Screen name ="Ass" component ={AssScreen}/>
</Stack.Navigator>

  );
}

