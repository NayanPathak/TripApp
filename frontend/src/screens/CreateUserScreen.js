import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";

export default function CreateUserScreen({ navigation }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !mobile || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Calls the backend endpoint: POST /api/auth/create-user
      const res = await api.post("/auth/create-user", {
        name,
        mobile,
        password,
      });

      if (res.data.success) {
        Alert.alert("Success", "User Created Successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.code === "ECONNREFUSED" || error.message?.includes("Network")
          ? "Cannot reach server. Check that the backend is running and BASE_URL in src/services/api.js is correct."
          : error.message || "Something went wrong");
      Alert.alert("Creation Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New User</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter user name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Mobile Number (Login ID)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Assign Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Create User</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 30,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#0C7779",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
