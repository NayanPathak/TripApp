import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

export default function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Admin Dashboard
      </Text>
      <TouchableOpacity
        onPress={logout}
        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 16 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
  btnText: { fontSize: 16, fontWeight: "700" },
});

