import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

// Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AgentDashboard from "../screens/AgentDashboard";
import CreatePackageScreen from "../screens/CreatePackageScreen";
import CreateUserScreen from "../screens/CreateUserScreen";
import UserDashboard from "../screens/UserDashboard";
import PackageDetailScreen from "../screens/PackageDetailScreen";

// 1. IMPORT THE NEW SCREEN
import AllPackagesScreen from "../screens/AllPackagesScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken, userRole } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // Auth Stack
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : userRole === "agent" ? (
          // Agent Stack
          <>
            <Stack.Screen name="AgentDashboard" component={AgentDashboard} />
            <Stack.Screen
              name="CreatePackage"
              component={CreatePackageScreen}
            />
            <Stack.Screen name="CreateUser" component={CreateUserScreen} />

            {/* 2. ADD THE SCREEN HERE */}
            <Stack.Screen name="AllPackages" component={AllPackagesScreen} />
          </>
        ) : (
          // User Stack
          <>
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            <Stack.Screen
              name="PackageDetail"
              component={PackageDetailScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
