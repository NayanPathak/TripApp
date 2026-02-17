import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Itinerary App</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Login", { role: "agent" })}
      >
        <Text style={styles.btnText}>I am an Agent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { marginTop: 20 }]}
        onPress={() => navigation.navigate("Login", { role: "user" })}
      >
        <Text style={styles.btnText}>I am a User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 50,
  },
  btn: {
    backgroundColor: "#0C7779",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
