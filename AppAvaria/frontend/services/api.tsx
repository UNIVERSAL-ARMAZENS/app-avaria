import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({ baseURL: "http://10.1.12.161:5000" });

type UserType = {
  username: string;
  role: string;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  API: typeof API;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const decoded: UserType = jwtDecode(token);
          setUser(decoded);
        }
      } catch (e) {
        console.log("Token inválido", e);
        await AsyncStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
const login = async (usuario: string, senha: string) => {
  const res = await API.post("/login", { username: usuario, password: senha });
  const token = res.data.token;
  const user = res.data.user;

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user)); // opcional
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  setUser(user); 
};
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};
