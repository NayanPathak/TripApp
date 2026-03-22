import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { useTheme } from "../theme/ThemeProvider";

export default function ManageAgentsScreen() {
  const { theme } = useTheme();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAgents = useCallback(async () => {
    try {
      const res = await api.get("/admin/agents");
      const list = res.data?.data ?? res.data ?? [];
      setAgents(Array.isArray(list) ? list : []);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        "Could not load agents.";
      Alert.alert("Error", msg);
      setAgents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadAgents();
    }, [loadAgents]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAgents();
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name || "");
    setEditEmail(item.email || "");
    setEditMobile(item.mobile != null ? String(item.mobile) : "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditMobile("");
  };

  const saveEdit = async () => {
    const name = editName.trim();
    const email = editEmail.trim().toLowerCase();
    if (!name || !email) {
      Alert.alert("Validation", "Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/admin/agents/${editingId}`, {
        name,
        email,
        mobile: editMobile.trim(),
      });
      closeModal();
      await loadAgents();
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || e.message || "Update failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Delete agent",
      `Remove ${item.name || "this agent"}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAgent(item._id),
        },
      ],
    );
  };

  const deleteAgent = async (id) => {
    try {
      await api.delete(`/admin/agents/${id}`);
      await loadAgents();
    } catch (e) {
      Alert.alert(
        "Error",
        e.response?.data?.message || e.message || "Delete failed.",
      );
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.name, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.email, { color: theme.colors.muted }]}>
        {item.email}
      </Text>
      {item.mobile ? (
        <Text style={[styles.mobile, { color: theme.colors.muted }]}>
          {item.mobile}
        </Text>
      ) : null}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { borderColor: theme.colors.primary, marginRight: 6 },
          ]}
          onPress={() => openEdit(item)}
        >
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { borderColor: theme.colors.danger, marginLeft: 6 },
          ]}
          onPress={() => confirmDelete(item)}
        >
          <Text style={[styles.actionText, { color: theme.colors.danger }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && agents.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={agents}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.colors.muted }]}>
            No agents yet. Create one from the admin dashboard.
          </Text>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Edit agent
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
                placeholder="Name"
                placeholderTextColor={theme.colors.muted}
                value={editName}
                onChangeText={setEditName}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.inputText,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.colors.muted}
                value={editEmail}
                onChangeText={setEditEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.inputBackground,
                    color: theme.colors.inputText,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Mobile (optional)"
                placeholderTextColor={theme.colors.muted}
                value={editMobile}
                onChangeText={setEditMobile}
                keyboardType="phone-pad"
              />
              <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={closeModal}
                style={[
                  styles.modalBtn,
                  {
                    borderColor: theme.colors.border,
                    marginRight: 6,
                    borderWidth: 1,
                  },
                ]}
                disabled={saving}
              >
                <Text style={{ color: theme.colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                style={[
                  styles.modalBtn,
                  { backgroundColor: theme.colors.primary, marginLeft: 6 },
                ]}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={theme.colors.buttonText} />
                ) : (
                  <Text style={{ color: theme.colors.buttonText, fontWeight: "700" }}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  email: { fontSize: 15, marginBottom: 4 },
  mobile: { fontSize: 15, marginBottom: 12 },
  row: { flexDirection: "row" },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionText: { fontSize: 15, fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: { flexDirection: "row", marginTop: 8 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
});
