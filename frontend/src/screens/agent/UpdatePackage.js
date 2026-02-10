import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { packageAPI } from '../../services/api';
import { colors, spacing, typography } from '../../styles/theme';

const emptyDay = (dayNum) => ({
  dayNumber: dayNum,
  hotel: { name: '', address: '', checkInTime: '' },
  taxi: { pickupLocation: '', pickupTime: '', vehicleType: '' },
  placesToVisit: [],
  images: [],
});

export default function UpdatePackage() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [pkg, setPkg] = useState(null);
  const [title, setTitle] = useState('');
  const [citiesStr, setCitiesStr] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await packageAPI.getById(params.packageId);
        setPkg(data);
        setTitle(data.title);
        setCitiesStr(data.cities?.join(', ') || '');
        setTotalDays(String(data.totalDays || ''));
        setItinerary(
          data.itinerary?.length
            ? data.itinerary
            : [emptyDay(1)]
        );
      } catch (err) {
        Alert.alert('Error', 'Failed to load package');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [params.packageId]);

  const addDay = () => {
    setItinerary([...itinerary, emptyDay(itinerary.length + 1)]);
  };

  const updateDay = (index, field, value) => {
    const next = [...itinerary];
    if (field.startsWith('hotel.')) {
      const key = field.split('.')[1];
      next[index].hotel = { ...next[index].hotel, [key]: value };
    } else if (field.startsWith('taxi.')) {
      const key = field.split('.')[1];
      next[index].taxi = { ...next[index].taxi, [key]: value };
    }
    setItinerary(next);
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    const days = parseInt(totalDays, 10) || itinerary.length;
    const cities = citiesStr.split(',').map((c) => c.trim()).filter(Boolean);
    setSaving(true);
    try {
      await packageAPI.update(params.packageId, {
        title: title.trim(),
        cities,
        totalDays: days,
        itinerary: itinerary.slice(0, days),
      });
      Alert.alert('Success', 'Package updated', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Package title"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Cities (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={citiesStr}
          onChangeText={setCitiesStr}
          placeholder="e.g. Paris, London"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Total days</Text>
        <TextInput
          style={styles.input}
          value={totalDays}
          onChangeText={setTotalDays}
          placeholder="Number of days"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />
      </View>
      <TouchableOpacity style={styles.addDayBtn} onPress={addDay}>
        <Text style={styles.addDayText}>+ Add day to itinerary</Text>
      </TouchableOpacity>
      {itinerary.map((day, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
          <Text style={styles.label}>Hotel name</Text>
          <TextInput
            style={styles.input}
            value={day.hotel?.name || ''}
            onChangeText={(v) => updateDay(index, 'hotel.name', v)}
            placeholder="Hotel name"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Hotel address</Text>
          <TextInput
            style={styles.input}
            value={day.hotel?.address || ''}
            onChangeText={(v) => updateDay(index, 'hotel.address', v)}
            placeholder="Address"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Check-in time</Text>
          <TextInput
            style={styles.input}
            value={day.hotel?.checkInTime || ''}
            onChangeText={(v) => updateDay(index, 'hotel.checkInTime', v)}
            placeholder="e.g. 14:00"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Taxi pickup location</Text>
          <TextInput
            style={styles.input}
            value={day.taxi?.pickupLocation || ''}
            onChangeText={(v) => updateDay(index, 'taxi.pickupLocation', v)}
            placeholder="Pickup location"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Taxi pickup time</Text>
          <TextInput
            style={styles.input}
            value={day.taxi?.pickupTime || ''}
            onChangeText={(v) => updateDay(index, 'taxi.pickupTime', v)}
            placeholder="e.g. 09:00"
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>Vehicle type</Text>
          <TextInput
            style={styles.input}
            value={day.taxi?.vehicleType || ''}
            onChangeText={(v) => updateDay(index, 'taxi.vehicleType', v)}
            placeholder="e.g. Sedan"
            placeholderTextColor="#999"
          />
        </View>
      ))}
      <TouchableOpacity
        style={[styles.submitBtn, saving && styles.disabled]}
        onPress={handleUpdate}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Update Package</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    color: colors.textOnPrimary,
  },
  dayTitle: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
    marginBottom: spacing.sm,
  },
  addDayBtn: {
    marginBottom: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  addDayText: { color: colors.primary, fontWeight: '600' },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  disabled: { opacity: 0.7 },
  submitText: { color: colors.textOnPrimary, fontWeight: '600' },
});
