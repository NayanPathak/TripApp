import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AgentDashboard from '../screens/agent/AgentDashboard';
import CreatePackage from '../screens/agent/CreatePackage';
import AllPackages from '../screens/agent/AllPackages';
import UpdatePackage from '../screens/agent/UpdatePackage';
import AssignPackage from '../screens/agent/AssignPackage';
import CreateUser from '../screens/agent/CreateUser';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AgentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="Dashboard" component={AgentDashboard} />
      <Tab.Screen name="All Packages" component={AllPackages} />
    </Tab.Navigator>
  );
}

export default function AgentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
      }}
    >
      <Stack.Screen name="AgentTabs" component={AgentTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePackage" component={CreatePackage} options={{ title: 'Create Package' }} />
      <Stack.Screen name="UpdatePackage" component={UpdatePackage} options={{ title: 'Update Package' }} />
      <Stack.Screen name="AssignPackage" component={AssignPackage} options={{ title: 'Assign Package' }} />
      <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: 'Create User' }} />
    </Stack.Navigator>
  );
}
