import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../../styles/theme';

const { width } = Dimensions.get('window');

export default function DayDetailScreen() {
  const { params } = useRoute();
  const day = params?.day || {};
  const hotel = day.hotel || {};
  const taxi = day.taxi || {};
  const places = day.placesToVisit || [];
  const images = day.images || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hotel</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{hotel.name || '—'}</Text>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{hotel.address || '—'}</Text>
        <Text style={styles.label}>Check-in time</Text>
        <Text style={styles.value}>{hotel.checkInTime || '—'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Taxi</Text>
        <Text style={styles.label}>Pickup location</Text>
        <Text style={styles.value}>{taxi.pickupLocation || '—'}</Text>
        <Text style={styles.label}>Pickup time</Text>
        <Text style={styles.value}>{taxi.pickupTime || '—'}</Text>
        <Text style={styles.label}>Vehicle type</Text>
        <Text style={styles.value}>{taxi.vehicleType || '—'}</Text>
      </View>
      {places.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Places to visit</Text>
          {places.map((place, index) => (
            <View key={index} style={styles.placeBlock}>
              <Text style={styles.placeName}>{place.name || 'Place'}</Text>
              {place.description ? (
                <Text style={styles.placeDesc}>{place.description}</Text>
              ) : null}
              {place.visitTime ? (
                <Text style={styles.placeTime}>{place.visitTime}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
      {images.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Images</Text>
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.sm,
  },
  value: {
    color: colors.textOnPrimary,
    fontSize: 16,
  },
  placeBlock: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  placeName: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  placeDesc: {
    color: colors.textOnPrimary,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  placeTime: {
    ...typography.caption,
    color: colors.textOnPrimary,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  image: {
    width: width - spacing.md * 4,
    height: 200,
    borderRadius: 8,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
