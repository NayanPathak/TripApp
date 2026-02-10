import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userAPI } from '../../services/api';
import { colors, spacing, typography } from '../../styles/theme';

export default function CreateUser() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await userAPI.createUser(email.trim(), password, name.trim());
      Alert.alert('Success', 'User account created. They can login with this email and password.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>User email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="user@example.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password (you set this for the user)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Min 6 characters"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <Text style={styles.label}>Name (optional)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="User display name"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Create User</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
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
    marginBottom: spacing.md,
    color: colors.textOnPrimary,
  },
  submitBtn: {
    backgroundColor: colors.text,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  disabled: { opacity: 0.7 },
  submitText: { color: colors.textOnPrimary, fontWeight: '600' },
});
