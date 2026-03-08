import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

export default function LoginScreen({ route, navigation }) {
  // Add navigation prop
  const { role } = route.params; // 'agent' or 'user'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        {role === "agent" ? "Agent Login" : "User Login"}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.inputText,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder={role === "agent" ? "Email" : "Mobile Number"}
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType={role === "agent" ? "email-address" : "phone-pad"}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.inputText,
            borderColor: theme.colors.border,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={theme.colors.muted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* --- ADD THIS SECTION --- */}
      {role === "agent" && (
        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate("RegisterAgent")}
        >
          <Text style={[styles.registerText, { color: theme.colors.muted }]}>
            Don't have an account?{" "}
            <Text
              style={[styles.registerLink, { color: theme.colors.primary }]}
            >
              Register here
            </Text>
          </Text>
        </TouchableOpacity>
      )}
      {/* ------------------------ */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  btn: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { fontSize: 18, fontWeight: "bold" },

  // New Styles
  registerContainer: { marginTop: 20, alignItems: "center" },
  registerText: { fontSize: 16 },
  registerLink: { fontWeight: "bold" },
});
