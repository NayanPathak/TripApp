import React, { createContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        setUserToken(res.data.token);
        setUserRole(res.data.role);
        await SecureStore.setItemAsync("token", res.data.token);
        await SecureStore.setItemAsync("role", res.data.role);
      }
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserRole(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
