import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../../styles/theme';

export default function DayCardsScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const pkg = params?.package || {};
  const itinerary = pkg.itinerary || [];
  const totalDays = pkg.totalDays || itinerary.length || 1;
  const days = Array.from({ length: totalDays }, (_, i) => ({
    dayNumber: i + 1,
    ...(itinerary[i] || {}),
  }));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DayDetail', {
          packageTitle: pkg.title,
          day: item,
        })
      }
      activeOpacity={0.8}
    >
      <Text style={styles.dayNum}>Day {item.dayNumber}</Text>
      {item.hotel?.name ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.hotel.name}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.title}>{pkg.title}</Text>
        <Text style={styles.meta}>
          {pkg.cities?.join(', ')} • {totalDays} days
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Day-wise itinerary</Text>
      <FlatList
        data={days}
        keyExtractor={(item) => String(item.dayNumber)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    margin: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  dayNum: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
});
