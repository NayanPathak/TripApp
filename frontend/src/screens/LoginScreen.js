import React, { useState, useContext, useEffect } from "react";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(raw) {
  const v = (raw || "").trim();
  if (!v) {
    return "Enter your email or mobile number.";
  }
  if (v.includes("@")) {
    return EMAIL_RE.test(v) ? null : "Enter a valid email address.";
  }
  const digits = v.replace(/\D/g, "");
  if (digits.length < 8) {
    return "Enter a valid mobile number (include country code if needed).";
  }
  return null;
}

export default function LoginScreen({ route, navigation }) {
  const paramsEmail = route?.params?.email ?? "";
  const paramsPassword = route?.params?.password ?? "";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (paramsEmail) setIdentifier(paramsEmail);
    if (paramsPassword) setPassword(paramsPassword);
  }, [paramsEmail, paramsPassword]);

  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const canSubmit =
    identifier.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    const err = validateIdentifier(identifier);
    if (err) {
      setFieldError(err);
      return;
    }
    setFieldError(null);
    setLoading(true);
    await login(identifier.trim(), password);
    setLoading(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>Sign in</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.inputBackground,
            color: theme.colors.inputText,
            borderColor: fieldError
              ? theme.colors.danger
              : theme.colors.border,
          },
        ]}
        placeholder="Email or mobile number"
        placeholderTextColor={theme.colors.muted}
        value={identifier}
        onChangeText={(t) => {
          setIdentifier(t);
          setFieldError(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        textContentType="username"
        autoComplete="username"
      />

      {fieldError ? (
        <Text style={[styles.hint, { color: theme.colors.danger }]}>
          {fieldError}
        </Text>
      ) : null}

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
        textContentType="password"
        autoComplete="password"
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
        disabled={loading || !canSubmit}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => navigation.navigate("RegisterAgent")}
      >
        <Text style={[styles.registerText, { color: theme.colors.muted }]}>
          Need an agent account?{" "}
          <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
            Register here
          </Text>
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
  header: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  hint: {
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
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

  registerContainer: { marginTop: 20, alignItems: "center" },
  registerText: { fontSize: 16 },
  registerLink: { fontWeight: "bold" },
});
