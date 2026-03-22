import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

// --- AUTH SCREENS ---
import LoginScreen from "../screens/LoginScreen";

// --- AGENT SCREENS ---
import AgentDashboard from "../screens/AgentDashboard";
import CreatePackageScreen from "../screens/CreatePackageScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import AllPackagesScreen from "../screens/AllPackagesScreen";

// --- ADMIN SCREENS ---
import AdminDashboard from "../screens/AdminDashboard";
import RegisterAgentScreen from "../screens/RegisterAgentScreen";
import ManageAgentsScreen from "../screens/ManageAgentsScreen";

// --- USER SCREENS ---
import UserDashboard from "../screens/UserDashboard";
import PackageDetailScreen from "../screens/PackageDetailScreen";
import DayDetailScreen from "../screens/DayDetailScreen"; // <--- 1. NEW IMPORT
const Stack = createStackNavigator();

function BootScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function AppNavigator() {
  const { userToken, userRole, bootstrapped } = useContext(AuthContext);
  const { navigationTheme } = useTheme();

  console.log("NAVIGATION DEBUG - userToken:", userToken ? "EXISTS" : "NULL");
  console.log("NAVIGATION DEBUG - userRole:", userRole);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!bootstrapped ? (
          <>
            <Stack.Screen name="Boot" component={BootScreen} />
          </>
        ) : userToken == null ? (
          // === AUTH STACK (Not Logged In) — Login is the default entry ===
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : userRole === "admin" ? (
          // === ADMIN STACK ===
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen
              name="RegisterAgent"
              component={RegisterAgentScreen}
              options={{
                headerShown: true,
                title: "Create Agent",
                headerTintColor: "#0C7779",
              }}
            />
            <Stack.Screen
              name="ManageAgents"
              component={ManageAgentsScreen}
              options={{
                headerShown: true,
                title: "Manage Agents",
                headerTintColor: "#0C7779",
              }}
            />
          </>
        ) : userRole === "agent" ? (
          // === AGENT STACK ===
          <>
            <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
            <Stack.Screen
              name="CreatePackage"
              component={CreatePackageScreen}
            />
            <Stack.Screen name="CreateUser" component={CreateUserScreen} />
            <Stack.Screen name="AllPackages" component={AllPackagesScreen} />
          </>
        ) : (
          // === USER STACK ===
          <>
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            <Stack.Screen
              name="PackageDetail"
              component={PackageDetailScreen}
            />
            {/* 2. ADDED DAY DETAIL SCREEN HERE */}
            <Stack.Screen
              name="DayDetail"
              component={DayDetailScreen}
              options={{
                headerShown: true, // Optional: Show header so they can go back easily
                title: "Day Details",
                headerTintColor: "#0C7779",
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
