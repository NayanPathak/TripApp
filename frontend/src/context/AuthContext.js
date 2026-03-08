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
      } else {
        // Backend responded but did not mark success
        alert(res.data.message || "Login failed");
      }
    } catch (e) {
      console.log("Login error:", {
        message: e.message,
        code: e.code,
        status: e.response?.status,
        data: e.response?.data,
      });

      const msg =
        e.response?.data?.message ||
        (e.code === "ECONNREFUSED" || e.message?.includes("Network")
          ? "Cannot reach server. Check that the backend is running and BASE_URL in src/services/api.js is correct (include http:// and port)."
          : "Login failed");

      alert(msg);
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
