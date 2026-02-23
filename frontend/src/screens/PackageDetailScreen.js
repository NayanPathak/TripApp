import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure you have this installed

export default function PackageDetail({ route, navigation }) {
  // 1. Get the full package data passed from the Dashboard
  const { packageData } = route.params;

  const renderDayItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dayCard}
      onPress={() =>
        // 2. PASSING DATA: We send the specific 'item' (day data) to the next screen
        navigation.navigate("DayDetail", { dayData: item })
      }
    >
      <View style={styles.dayIconContainer}>
        <Text style={styles.dayNumber}>{item.dayNumber}</Text>
      </View>

      <View style={styles.dayInfo}>
        <Text style={styles.dayTitle}>Day {item.dayNumber}</Text>
        <Text style={styles.daySubTitle}>
          {item.title || "Click to view itinerary"}
        </Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#0C7779" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0C7779" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{packageData.cities}</Text>
        <Text style={styles.headerSubtitle}>
          {packageData.totalDays} Days • {packageData.title}
        </Text>
      </View>

      {/* List of Days */}
      <FlatList
        data={packageData.itinerary}
        keyExtractor={(item) => item._id || item.dayNumber.toString()}
        renderItem={renderDayItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },

  headerContainer: {
    backgroundColor: "#0C7779",
    padding: 20,
    paddingTop: 50, // Adjust for status bar
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
    elevation: 4,
  },
  backButton: { marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 16, color: "#e0f2f1", marginTop: 4 },

  listContent: { padding: 16 },

  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dayIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dayNumber: { fontSize: 20, fontWeight: "bold", color: "#00695C" },
  dayInfo: { flex: 1 },
  dayTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  daySubTitle: { fontSize: 14, color: "#666", marginTop: 2 },
});
