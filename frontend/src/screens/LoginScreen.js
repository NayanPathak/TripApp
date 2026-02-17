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

export default function LoginScreen({ route }) {
  const { role } = route.params; // 'agent' or 'user'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    // For users, email might be constructed from mobile in real app, keeping strict for now
    login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {role === "agent" ? "Agent Login" : "User Login"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={role === "agent" ? "Email" : "Mobile / Email"}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
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
});
