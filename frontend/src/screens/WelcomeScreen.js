import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Trip Itinerary App
      </Text>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => navigation.navigate("Login", { role: "agent" })}
      >
        <Text
          style={[
            styles.btnText,
            { color: theme.colors.buttonText },
          ]}
        >
          I am an Agent
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          { marginTop: 20, backgroundColor: theme.colors.primary },
        ]}
        onPress={() => navigation.navigate("Login", { role: "user" })}
      >
        <Text
          style={[
            styles.btnText,
            { color: theme.colors.buttonText },
          ]}
        >
          I am a User
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  btn: {
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  btnText: { fontSize: 18, fontWeight: "600" },
});
