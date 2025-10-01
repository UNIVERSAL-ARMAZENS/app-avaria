import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./navigation/AppStack";
import { AuthProvider } from "./services/api";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
