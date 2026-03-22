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
import { useTheme } from "../theme/ThemeProvider";

export default function CreateUserScreen({ navigation }) {
  const { theme } = useTheme();
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

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.inputText,
      borderColor: theme.colors.border,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.primary }]}>
        Create New User
      </Text>

      <Text style={[styles.label, { color: theme.colors.text }]}>Full Name</Text>
      <TextInput
        style={inputStyle}
        placeholder="Enter user name"
        placeholderTextColor={theme.colors.muted}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        Mobile Number (Login ID)
      </Text>
      <TextInput
        style={inputStyle}
        placeholder="Enter mobile number"
        placeholderTextColor={theme.colors.muted}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Assign Password</Text>
      <TextInput
        style={inputStyle}
        placeholder="Create a password"
        placeholderTextColor={theme.colors.muted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateUser}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
            Create User
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { fontSize: 18, fontWeight: "bold" },
});
