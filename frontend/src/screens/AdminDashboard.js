import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

export default function AdminDashboard({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Admin Dashboard
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterAgent")}
        style={[styles.btn, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
          Create Agent
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ManageAgents")}
        style={[styles.btn, styles.btnSecondary, { borderColor: theme.colors.primary }]}
      >
        <Text style={[styles.btnTextOutline, { color: theme.colors.primary }]}>
          Manage Agents
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        style={[styles.btn, styles.logoutBtn, { borderColor: theme.colors.border }]}
      >
        <Text style={[styles.btnTextOutline, { color: theme.colors.muted }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 24,
  },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 32, textAlign: "center" },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  logoutBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    marginTop: 24,
  },
  btnText: { fontSize: 17, fontWeight: "700" },
  btnTextOutline: { fontSize: 17, fontWeight: "700" },
});
