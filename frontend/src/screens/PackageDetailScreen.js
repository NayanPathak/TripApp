import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function PackageDetailScreen({ route }) {
  const { packageData } = route.params;

  const renderDay = ({ item }) => (
    <View style={styles.dayCard}>
      <Text style={styles.dayTitle}>Day {item.dayNumber}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Hotel:</Text>
        <Text style={styles.val}>{item.hotel}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Taxi:</Text>
        <Text style={styles.val}>{item.taxi}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Visit:</Text>
        <Text style={styles.val}>{item.placesToVisit}</Text>
      </View>

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {item.images.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.thumb} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{packageData.title}</Text>
      <FlatList
        data={packageData.itinerary}
        renderItem={renderDay}
        keyExtractor={(item) => item._id || item.dayNumber.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 15,
    textAlign: "center",
  },
  dayCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 5 },
  label: { fontWeight: "bold", width: 60, color: "#555" },
  val: { flex: 1, color: "#333" },
  thumb: {
    width: 100,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#eee",
  },
});
