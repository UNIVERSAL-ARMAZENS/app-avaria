import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import FotosScreen from '../screens/FotosScreen'



export type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Fotos: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  return (
<Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Registro" component={RegistroScreen} />
  <Stack.Screen name ="Fotos" component ={FotosScreen}/>
</Stack.Navigator>

  );
}

