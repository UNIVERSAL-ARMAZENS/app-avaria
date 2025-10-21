import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({ baseURL: "http://10.1.12.161:5000" });

export type UserType = {
  id?: number;
  username: string;
  role: string;
  new_password?: boolean;
};

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (usuario: string, senha: string) => Promise<UserType | null>;
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
      const storedUser = await AsyncStorage.getItem("user");

      if (token && storedUser) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser)); // pega new_password correto
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log("Erro ao carregar usuário", e);
      await AsyncStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  })();
}, []);

const login = async (usuario: string, senha: string): Promise<UserType | null> => {
  try {
    const res = await API.post("/login", { username: usuario, password: senha });

    const user: UserType = {
      id: res.data.id,
      username: res.data.username,
      role: res.data.role,
      new_password: res.data.new_password || false,
    };

    if (res.data.token) {
      await AsyncStorage.setItem("token", res.data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    }

    // Salva usuário completo no AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  } catch (err: any) {
    console.log("Erro login:", err.response?.data || err.message);
    return null;
  }
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
