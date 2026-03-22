import React, { useState, useContext, useEffect } from "react";
import {
  View,ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";
import LottieView from "lottie-react-native";

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

export default function LoginScreen({ route }) {
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

  const canSubmit = identifier.trim().length > 0 && password.trim().length > 0;

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
      <ScrollView contentContainerStyle={{ flexGrow: 0.5, justifyContent: "center" }}>
        {/* --- LOCAL LOTTIE BRANDING SECTION --- */}
        <View style={styles.brandingContainer}>
          <Text style={[styles.mainHeading, { color: theme.colors.primary }]}>
            Trip Itinerary App
          </Text>
          <LottieView
            // 🚀 UPDATED LINE: Pointing to your local assets folder
            source={require("../../assets/loginscreenflight.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
        {/* ----------------------------------- */}

        <Text style={[styles.header, { color: theme.colors.text }]}>
          Sign in
        </Text>

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
        </ScrollView>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
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
});
