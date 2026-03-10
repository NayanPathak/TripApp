import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Restore token on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const role = await SecureStore.getItemAsync("role");

        if (token) {
          setUserToken(token);
          setUserRole(role);
        }
      } catch (err) {
        console.log("Token restore error:", err);
      }
    };

    loadToken();
  }, []);

  const applyLoginState = async (data) => {
    try {
      setUserToken(data.token);
      setUserRole(data.role);

      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("role", data.role || "");
    } catch (error) {
      console.log("SecureStore error:", error);
    }
  };

  const login = async (input, passwordInput, role) => {
    const identifier = (input || "").trim();
    const password = (passwordInput || "").trim();

    if (!identifier || !password) {
      Alert.alert(
        "Validation Error",
        "Please enter both your email/mobile and password.",
      );
      return;
    }

    try {
      const loginUrl = api.defaults.baseURL + "/auth/login";
      console.log("LOGIN URL:", loginUrl);
      console.log("LOGIN REQUEST:", { identifier, role });

      const res = await api.post("/auth/login", {
        identifier,
        password,
      });

      console.log("LOGIN RESPONSE STATUS:", res.status);
      console.log("LOGIN RESPONSE DATA:", JSON.stringify(res.data));

      if (res.data?.token) {
        await applyLoginState(res.data);
        Alert.alert("Success", `Welcome ${res.data.name || role}!`);
      } else {
        Alert.alert(
          "Login Failed",
          res.data?.message || "Invalid credentials - no token received",
        );
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);

      let errorMessage = "Cannot reach server.";

      if (error.response) {
        const serverMsg = error.response.data?.message;
        const serverStatus = error.response.status;
        errorMessage = serverMsg || `Server Error: ${serverStatus}`;
        // Debug: show full error details
        console.log("Full error response:", error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server. Check backend URL.";
      }

      Alert.alert(
        "Login Failed",
        errorMessage +
          "\n\nDebug: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      setUserRole(null);

      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("role");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, userToken, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
