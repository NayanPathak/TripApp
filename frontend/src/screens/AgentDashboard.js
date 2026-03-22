import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

export default function AgentDashboard({ navigation }) {
  const { logout } = useContext(AuthContext);
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Agent Dashboard
      </Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("CreatePackage")}
      >
        <Text style={styles.cardText}>+ Create New Package</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("CreateUser")}
      >
        <Text style={styles.cardText}>+ Create User & Assign</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("AllPackages")}
      >
        <Text style={styles.cardText}>View All Packages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#EF4444" }]}
        onPress={logout}
      >
        <Text style={styles.cardText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
});
