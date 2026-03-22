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

export default function RegisterAgentScreen({ navigation }) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/agents", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.data.success) {
        Alert.alert("Success", "Agent account created.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.code === "ECONNREFUSED" || error.message?.includes("Network")
          ? "Cannot reach server. Check that the backend is running and BASE_URL in src/services/api.js is correct (include http:// and port, e.g. http://YOUR_IP:5000/api)."
          : error.message || "Registration failed");
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.lead, { color: theme.colors.muted }]}>
        Enter details for the new agent account.
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
        placeholder="Full Name"
        placeholderTextColor={theme.colors.muted}
        value={name}
        onChangeText={setName}
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
        placeholder="Email Address"
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
            Create agent
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AdminDashboard")}
        style={{ marginTop: 20 }}
      >
        <Text style={[styles.link, { color: theme.colors.primary }]}>
          Back to dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  lead: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 22,
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
  link: { textAlign: "center", fontSize: 16 },
});
