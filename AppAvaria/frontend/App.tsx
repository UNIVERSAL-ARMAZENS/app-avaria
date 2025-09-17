import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './navigation/AppStack';


export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
