
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AgentDashboard({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agent Dashboard</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("CreatePackage")}
      >
        <Text style={styles.cardText}>+ Create New Package</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("CreateUser")}
      >
        <Text style={styles.cardText}>+ Create User & Assign</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AllPackages")}
      >
        <Text style={styles.cardText}>View All Packages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: "#ff4444" }]}
        onPress={logout}
      >
        <Text style={styles.cardText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0C7779",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
