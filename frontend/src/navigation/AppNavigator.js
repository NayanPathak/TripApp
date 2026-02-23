import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

// --- AUTH SCREENS ---
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterAgentScreen from "../screens/RegisterAgentScreen";

// --- AGENT SCREENS ---
import AgentDashboard from "../screens/AgentDashboard";
import CreatePackageScreen from "../screens/CreatePackageScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import AllPackagesScreen from "../screens/AllPackagesScreen";

// --- USER SCREENS ---
import UserDashboard from "../screens/UserDashboard";
import PackageDetailScreen from "../screens/PackageDetailScreen";
import DayDetailScreen from "../screens/DayDetailScreen"; // <--- 1. NEW IMPORT
const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, userRole } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // === AUTH STACK (Not Logged In) ===
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="RegisterAgent"
              component={RegisterAgentScreen}
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
