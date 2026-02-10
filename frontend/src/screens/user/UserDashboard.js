import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { assignmentAPI } from '../../services/api';
import { colors, spacing, typography } from '../../styles/theme';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPackages = async () => {
    try {
      const { data } = await assignmentAPI.getMyPackages();
      setPackages(data);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to load packages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPackages();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DayCards', { package: item })
      }
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMeta}>
        {item.cities?.join(', ')} • {item.totalDays} days
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name || user?.email}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Your assigned packages</Text>
      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No packages assigned yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    ...typography.subtitle,
    color: colors.text,
  },
  logoutText: { color: colors.error, fontWeight: '600' },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    padding: spacing.md,
  },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
