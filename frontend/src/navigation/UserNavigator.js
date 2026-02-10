import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserDashboard from '../screens/user/UserDashboard';
import DayCardsScreen from '../screens/user/DayCardsScreen';
import DayDetailScreen from '../screens/user/DayDetailScreen';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

export default function UserNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
      }}
    >
      <Stack.Screen name="Dashboard" component={UserDashboard} options={{ title: 'My Packages' }} />
      <Stack.Screen name="DayCards" component={DayCardsScreen} options={{ title: 'Itinerary' }} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ title: 'Day Detail' }} />
    </Stack.Navigator>
  );
}
