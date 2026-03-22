import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/theme/ThemeProvider";

/**
 * Navigation is defined in src/navigation/AppNavigator.js:
 * userRole === "admin" → AdminDashboard stack (Create Agent, Manage Agents, …).
 */

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
