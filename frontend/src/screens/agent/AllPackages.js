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
import { packageAPI } from '../../services/api';
import { colors, spacing, typography } from '../../styles/theme';

export default function AllPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPackages = async () => {
    try {
      const { data } = await packageAPI.getAll();
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
        navigation.navigate('UpdatePackage', { packageId: item._id })
      }
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMeta}>
        {item.cities?.join(', ')} • {item.totalDays} days
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() =>
            navigation.navigate('AssignPackage', { packageId: item._id, packageTitle: item.title })
          }
        >
          <Text style={styles.smallBtnText}>Assign</Text>
        </TouchableOpacity>
      </View>
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
      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No packages yet. Create one from Dashboard.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
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
  row: { flexDirection: 'row', marginTop: spacing.sm },
  smallBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  smallBtnText: { color: colors.textOnPrimary, fontWeight: '600' },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
