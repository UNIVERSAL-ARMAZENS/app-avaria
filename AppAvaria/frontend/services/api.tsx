
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const API = axios.create({ baseURL: "http://10.1.12.161:5000" });

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const decoded: any = jwtDecode(token);
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
  await AsyncStorage.setItem("token", token);
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
const decoded: any = jwtDecode(token);
  setUser(decoded);
};

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, API }}>
      {children}
    </AuthContext.Provider>
  );
};
