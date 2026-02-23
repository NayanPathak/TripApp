import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function DayDetailScreen({ route, navigation }) {
  // 1. SAFETY CHECK: Use optional chaining (?.) to prevent crashes
  const dayData = route?.params?.dayData;

  // 2. FALLBACK: If data didn't load, show a friendly message instead of a red screen
  if (!dayData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 18, color: "#666" }}>
          No day details found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerBlock}>
        <Text style={styles.dayTitle}>Day {dayData.dayNumber}</Text>
        {dayData.title && (
          <Text style={styles.daySubtitle}>{dayData.title}</Text>
        )}
      </View>

      {/* 1. HOTEL SECTION (Only shows if hotel data exists) */}
      {dayData.hotel && dayData.hotel.name ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="hotel" size={20} color="#0C7779" />
            <Text style={styles.sectionTitle}> Hotel Details</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{dayData.hotel.name}</Text>
            </View>

            {/* Optional: Only show address/check-in if they exist in the DB */}
            {dayData.hotel.address && (
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{dayData.hotel.address}</Text>
              </View>
            )}
            {dayData.hotel.checkIn && (
              <View style={styles.row}>
                <Text style={styles.label}>Check-in:</Text>
                <Text style={styles.valueHighlight}>
                  {dayData.hotel.checkIn}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : null}

      {/* 2. TAXI SECTION (Only shows if taxi data exists) */}
      {dayData.taxi && dayData.taxi.vehicleType ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="taxi" size={20} color="#D32F2F" />
            <Text style={styles.sectionTitle}> Taxi Details</Text>
          </View>

          <View style={styles.card}>
            {dayData.taxi.pickupLocation && (
              <View style={styles.row}>
                <Text style={styles.label}>Pickup:</Text>
                <Text style={styles.value}>{dayData.taxi.pickupLocation}</Text>
              </View>
            )}
            {dayData.taxi.pickupTime && (
              <View style={styles.row}>
                <Text style={styles.label}>Time:</Text>
                <Text style={styles.valueHighlight}>
                  {dayData.taxi.pickupTime}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Vehicle:</Text>
              <Text style={styles.value}>{dayData.taxi.vehicleType}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 3. PLACES TO VISIT (The Fixed Multiple Image Card) */}
      {dayData.places && dayData.places.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="place" size={24} color="#E64A19" />
            <Text style={styles.sectionTitle}> Places to Visit</Text>
          </View>

          {/* This .map() is what creates the vertical scroll of multiple places! */}
          {dayData.places.map((place, index) => (
            <View key={index} style={styles.placeCard}>
              {/* Image Container */}
              {place.image ? (
                <Image
                  source={{ uri: place.image }}
                  style={styles.placeImage}
                />
              ) : (
                <View
                  style={[
                    styles.placeImage,
                    {
                      backgroundColor: "#ddd",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="image-not-supported"
                    size={40}
                    color="#fff"
                  />
                </View>
              )}

              {/* Text Content Container */}
              <View style={styles.placeContent}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.placeName}>{place.name}</Text>
                  {place.time && (
                    <Text style={styles.placeTime}>{place.time}</Text>
                  )}
                </View>

                {place.type && (
                  <Text style={styles.placeType}>{place.type}</Text>
                )}

                {place.description && (
                  <Text style={styles.placeDesc}>{place.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  headerBlock: {
    backgroundColor: "#0C7779",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  dayTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  daySubtitle: { fontSize: 16, color: "#e0f2f1", marginTop: 5 },

  section: { padding: 16, paddingBottom: 0 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#777", fontSize: 14 },
  value: {
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
    maxWidth: "70%",
    textAlign: "right",
  },
  valueHighlight: { fontWeight: "bold", fontSize: 16, color: "#0C7779" },

  placeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
  },
  placeImage: { width: "100%", height: 180, resizeMode: "cover" },
  placeContent: { padding: 16 },
  placeName: { fontSize: 18, fontWeight: "bold", color: "#00695C" },
  placeType: { fontSize: 14, color: "#888", marginBottom: 6 },
  placeTime: { fontSize: 14, fontWeight: "bold", color: "#E64A19" },
  placeDesc: { fontSize: 13, color: "#555", lineHeight: 20 },
});
