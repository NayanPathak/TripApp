import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { userAPI, assignmentAPI } from '../../services/api';
import { colors, spacing, typography } from '../../styles/theme';

export default function AssignPackage() {
  const { params } = useRoute();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await userAPI.getAllUsers();
        setUsers(data);
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAssign = async (userId) => {
    setAssigningId(userId);
    try {
      await assignmentAPI.assign(userId, params.packageId);
      Alert.alert('Success', 'Package assigned to user');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to assign');
    } finally {
      setAssigningId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.packageTitle}>{params.packageTitle || 'Package'}</Text>
        <Text style={styles.hint}>Select a user to assign this package to:</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => handleAssign(item._id)}
            disabled={!!assigningId}
          >
            <Text style={styles.userEmail}>{item.email}</Text>
            {item.name ? (
              <Text style={styles.userName}>{item.name}</Text>
            ) : null}
            {assigningId === item._id ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.assignText}>Assign</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No users yet. Create user accounts from your dashboard first.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    margin: spacing.md,
  },
  packageTitle: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userEmail: {
    color: colors.textOnPrimary,
    fontWeight: '600',
    flex: 1,
  },
  userName: {
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginRight: spacing.sm,
  },
  assignText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
