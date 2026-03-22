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
import { useTheme } from "../theme/ThemeProvider";

export default function AllPackagesScreen() {
  const { theme } = useTheme();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.days, { color: theme.colors.primary }]}>
          {item.totalDays} Days
        </Text>
      </View>
      <Text style={[styles.sub, { color: theme.colors.muted }]}>
        {item.cities}
      </Text>

      <TouchableOpacity
        style={[styles.assignBtn, { backgroundColor: theme.colors.primary }]}
        onPress={() => openAssignModal(item._id)}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
          Assign to User
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.primary }]}>
        All Packages
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item._id}
          renderItem={renderPackage}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.colors.muted }]}>
              No packages created yet.
            </Text>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>
              Assign Package
            </Text>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Enter User Mobile Number:
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
              placeholder="User Mobile"
              placeholderTextColor={theme.colors.muted}
              keyboardType="phone-pad"
              value={userMobile}
              onChangeText={setUserMobile}
            />

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleAssign}
              disabled={assignLoading}
            >
              {assignLoading ? (
                <ActivityIndicator color={theme.colors.buttonText} />
              ) : (
                <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>
                  Confirm Assignment
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalBtn,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  marginTop: 10,
                },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.btnText, { color: theme.colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  days: { fontWeight: "bold" },
  sub: { marginTop: 5, marginBottom: 15 },
  assignBtn: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: { fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    shadowColor: "#000",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalBtn: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  label: { marginBottom: 10, fontWeight: "600" },
});
