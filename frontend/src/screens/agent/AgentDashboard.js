import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../styles/theme';

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greeting}>Welcome, {user?.name || user?.email}</Text>
        <Text style={styles.role}>Agent / Company</Text>
      </View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CreatePackage')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>Create Package</Text>
        <Text style={styles.cardSubtitle}>Add a new travel package with day-wise itinerary</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('All Packages')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>All Packages</Text>
        <Text style={styles.cardSubtitle}>View, update or assign packages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CreateUser')}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>Create User</Text>
        <Text style={styles.cardSubtitle}>Create customer account (email + password)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  greeting: {
    ...typography.title,
    color: colors.textOnPrimary,
  },
  role: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  logoutBtn: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutText: { color: colors.error, fontWeight: '600' },
});
