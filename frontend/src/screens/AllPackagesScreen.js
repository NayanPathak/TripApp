import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";

export default function AllPackagesScreen() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Assignment Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [userMobile, setUserMobile] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data.data);
    } catch (e) {
      Alert.alert("Error", "Failed to load packages", e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (pkgId) => {
    setSelectedPackageId(pkgId);
    setModalVisible(true);
  };

  const handleAssign = async () => {
    if (!userMobile) {
      Alert.alert("Error", "Please enter a mobile number");
      return;
    }

    setAssignLoading(true);
    try {
      // Calling the backend assign route
      const res = await api.post("/packages/assign", {
        mobile: userMobile,
        packageId: selectedPackageId,
      });

      if (res.data.success) {
        Alert.alert("Success", "Package assigned to user successfully!");
        setModalVisible(false);
        setUserMobile("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Assignment failed. Check if user exists.";
      Alert.alert("Failed", msg);
    } finally {
      setAssignLoading(false);
    }
  };

  const renderPackage = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.days}>{item.totalDays} Days</Text>
      </View>
      <Text style={styles.sub}>{item.cities}</Text>

      <TouchableOpacity
        style={styles.assignBtn}
        onPress={() => openAssignModal(item._id)}
      >
        <Text style={styles.btnText}>Assign to User</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Packages</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0C7779" />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item._id}
          renderItem={renderPackage}
          ListEmptyComponent={
            <Text style={styles.empty}>No packages created yet.</Text>
          }
        />
      )}

      {/* Assignment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Assign Package</Text>
            <Text style={styles.label}>Enter User Mobile Number:</Text>

            <TextInput
              style={styles.input}
              placeholder="User Mobile"
              keyboardType="phone-pad"
              value={userMobile}
              onChangeText={setUserMobile}
            />

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleAssign}
              disabled={assignLoading}
            >
              {assignLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Confirm Assignment</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                { backgroundColor: "#aaa", marginTop: 10 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#333" },
  days: { fontWeight: "bold", color: "#0C7779" },
  sub: { color: "#666", marginTop: 5, marginBottom: 15 },
  assignBtn: {
    backgroundColor: "#0C7779",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 50, color: "#999", fontSize: 16 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#0C7779",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalBtn: {
    backgroundColor: "#0C7779",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  label: { marginBottom: 10, fontWeight: "600" },
});
