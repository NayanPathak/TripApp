import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { themes } from "./colors";

const ThemeContext = createContext({
  theme: themes.light,
  colorScheme: "light",
  navigationTheme: NavigationLightTheme,
});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const colorScheme = systemScheme === "dark" ? "dark" : "light";
  const theme = colorScheme === "dark" ? themes.dark : themes.light;

  const navigationTheme = useMemo(() => {
    const baseNavTheme =
      colorScheme === "dark" ? NavigationDarkTheme : NavigationLightTheme;

    return {
      ...baseNavTheme,
      colors: {
        ...baseNavTheme.colors,
        background: theme.colors.background,
        primary: theme.colors.primary,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [colorScheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      colorScheme,
      navigationTheme,
    }),
    [theme, colorScheme, navigationTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

