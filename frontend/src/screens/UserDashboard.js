import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import api from "../services/api";
import { useContext } from "react";
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
      setPackages(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
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
          <Text style={{ color: "red" }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={packages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#0C7779" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#0C7779",
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardSub: { color: "#666", marginTop: 5 },
});
