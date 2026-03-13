import React, { createContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");

        if (token) setUserToken(token);
        if (role) setUserRole(role);
      } catch (err) {
        console.log("Auth restore error:", err);
      } finally {
        setBootstrapped(true);
      }
    };

    restore();
  }, []);

  const login = async (identifierInput, passwordInput) => {
    console.log("AUTH DEBUG - Raw inputs:", {
      identifierInput: JSON.stringify(identifierInput),
      passwordInput: JSON.stringify(passwordInput),
      typeofIdentifier: typeof identifierInput,
    });
    const identifier = (identifierInput || "").trim();
    const password = (passwordInput || "").trim();

    if (!identifier || !password) {
      Alert.alert("Login Failed", "Please provide email/mobile and password.");
      return { ok: false };
    }

    try {
      const res = await api.post("/auth/login", { identifier, password });
      const data = res.data?.data || res.data;

      if (!data?.success && !data?.token) {
        Alert.alert("Login Failed", data?.message || "Login failed");
        return { ok: false };
      }

      const token = data.token;
      const role = data.role;

      if (!token || !role) {
        Alert.alert("Login Failed", "Login response missing token/role.");
        return { ok: false };
      }

      setUserToken(token);
      setUserRole(role);
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("role", role);

      return { ok: true, role };
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        (e.code === "ECONNREFUSED" || e.message?.includes("Network")
          ? "Cannot reach server. Check backend and API base URL."
          : "Login failed");
      Alert.alert("Login Failed", msg);
      return { ok: false };
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUserRole(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("role");
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      userToken,
      userRole,
      bootstrapped,
    }),
    [userToken, userRole, bootstrapped],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
