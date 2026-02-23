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

export default function LoginScreen({ route, navigation }) {
  // Add navigation prop
  const { role } = route.params; // 'agent' or 'user'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {role === "agent" ? "Agent Login" : "User Login"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={role === "agent" ? "Email" : "Mobile Number"}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType={role === "agent" ? "email-address" : "phone-pad"}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* --- ADD THIS SECTION --- */}
      {role === "agent" && (
        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate("RegisterAgent")}
        >
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerLink}>Register here</Text>
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
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    color: "#0C7779",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#0C7779",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // New Styles
  registerContainer: { marginTop: 20, alignItems: "center" },
  registerText: { fontSize: 16, color: "#555" },
  registerLink: { color: "#0C7779", fontWeight: "bold" },
});
