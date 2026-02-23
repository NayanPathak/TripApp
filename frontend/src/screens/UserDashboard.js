import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard({ navigation }) {
  const [packages, setPackages] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      // Make sure this matches your backend response structure
      setPackages(res.data.data);
    } catch (e) {
      console.log("Error fetching packages: ", e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        // This passes the whole package to the PackageDetail screen
        navigation.navigate("PackageDetail", { packageData: item })
      }
    >
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSub}>
          {item.cities} • {item.totalDays} Days
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Trips</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={packages}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item._id ? item._id.toString() : Math.random().toString()
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No trips assigned yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F8FAFC", // A very soft, modern off-white/blue
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  header: {
    fontSize: 28, // Slightly larger
    fontWeight: "900", // Bolder
    color: "#0F172A", // Dark slate instead of pure black
    letterSpacing: -0.5,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
    backgroundColor: "#FEE2E2", // Soft red background pill
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
  },

  // --- THE PREMIUM CARD UPGRADE ---
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20, // Much rounder
    marginBottom: 16,
    flexDirection: "row", // Aligns content horizontally
    alignItems: "center",
    justifyContent: "space-between",

    // Modern Soft Shadow (iOS)
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Modern Soft Shadow (Android)
    elevation: 4,

    // Very subtle border instead of the heavy left line
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});
