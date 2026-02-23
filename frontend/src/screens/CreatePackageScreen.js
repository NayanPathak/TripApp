import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../services/api";

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";

export default function CreatePackageScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [cities, setCities] = useState("");
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for temporary day input
  const [tempDay, setTempDay] = useState({
    dayNumber: 1,
    hotel: "",
    taxi: "",
    pickupLocation: "",
    pickupTime: "", 
    places: [], // Array of objects: { name: "", image: "" }
  });

  // State for the specific place currently being typed
  const [currentPlaceName, setCurrentPlaceName] = useState("");
  const [currentPlaceImg, setCurrentPlaceImg] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  // --- CLOUDINARY UPLOAD FUNCTION ---
  const uploadToCloudinary = async (base64Img) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      Alert.alert(
        "Configuration Error",
        "Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in your .env file.",
      );
      return null;
    }

    const data = new FormData();
    data.append("file", base64Img);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        },
      );

      const result = await res.json();

      if (result.secure_url) {
        return result.secure_url;
      } else {
        Alert.alert("Upload Failed", result.error?.message || "Unknown error");
        return null;
      }
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Upload Failed", "Network error or invalid configuration");
      return null;
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
        setCurrentPlaceImg(base64Img);
        console.log("Image selected for current place");
      }
    } catch (error) {
      alert("Error opening gallery: " + error.message);
    }
  };

  const handleAddPlaceToDay = async () => {
    if (!currentPlaceName || !currentPlaceImg) {
      Alert.alert(
        "Missing Info",
        "Please provide a place name and select an image.",
      );
      return;
    }

    setUploadingImg(true);
    const uploadedUrl = await uploadToCloudinary(currentPlaceImg);

    if (uploadedUrl) {
      setTempDay((prev) => ({
        ...prev,
        places: [
          ...prev.places,
          { name: currentPlaceName, image: uploadedUrl },
        ],
      }));

      // Reset the small form for the next place
      setCurrentPlaceName("");
      setCurrentPlaceImg(null);
      Alert.alert("Success", "Place added to current day!");
    }
    setUploadingImg(false);
  };

  const addDay = () => {
    // Make sure they added at least one place
    if (tempDay.places.length === 0) {
      Alert.alert(
        "Missing Info",
        "Please add at least one place to visit for this day.",
      );
      return;
    }

    setDays([...days, tempDay]);

    // Reset temp day for the next day
    setTempDay({
      dayNumber: days.length + 2,
      hotel: "",
      taxi: "",
      pickupLocation: "",
      pickupTime: "",
      places: [], // Reset to empty array
    });
  };

  const submitPackage = async () => {
    if (!title || !cities || days.length === 0) {
      Alert.alert(
        "Error",
        "Please fill package details and add at least one day.",
      );
      return;
    }

    setLoading(true);
    try {
      // Reformat to match Backend Schema
      const formattedItinerary = days.map((day) => {
        const formattedHotel = day.hotel ? { name: day.hotel } : undefined;
        const formattedTaxi = day.taxi
          ? {
              vehicleType: day.taxi,
              pickupLocation: day.pickupLocation,
              pickupTime: day.pickupTime,
            }
          : undefined;

        return {
          dayNumber: day.dayNumber,
          title: `Day ${day.dayNumber} in ${cities}`,
          hotel: formattedHotel,
          taxi: formattedTaxi,
          places: day.places, // It is already formatted properly as [{name, image}]!
        };
      });

      await api.post("/packages", {
        title,
        cities,
        totalDays: days.length,
        itinerary: formattedItinerary,
      });

      Alert.alert("Success", "Package created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.log("Backend Error:", e.response?.data || e.message);
      Alert.alert(
        "Error",
        e.response?.data?.message || "Failed to create package.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Package</Text>

      <Text style={styles.label}>Package Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Kerala Bliss"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Cities Covered</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Munnar, Alleppey"
        value={cities}
        onChangeText={setCities}
      />

      <View style={styles.divider} />

      <Text style={styles.subHeader}>Day {tempDay.dayNumber} Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Hotel Name (Optional)"
        onChangeText={(t) => setTempDay({ ...tempDay, hotel: t })}
        value={tempDay.hotel}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Pickup Loc (e.g. Hotel)"
          onChangeText={(t) => setTempDay({ ...tempDay, pickupLocation: t })}
          value={tempDay.pickupLocation}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Time (e.g. 9:00 AM)"
          onChangeText={(t) => setTempDay({ ...tempDay, pickupTime: t })}
          value={tempDay.pickupTime}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Taxi / Driver Info (Optional)"
        onChangeText={(t) => setTempDay({ ...tempDay, taxi: t })}
        value={tempDay.taxi}
      />

      {/* --- NEW PLACE ADDITION SECTION --- */}
      <View style={styles.placeCreatorContainer}>
        <Text style={styles.label}>Add Places to Visit</Text>

        <TextInput
          style={styles.input}
          placeholder="Place Name (e.g. Ajmer Fort)"
          value={currentPlaceName}
          onChangeText={setCurrentPlaceName}
        />

        <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
          <Text style={styles.btnText}>
            {currentPlaceImg ? "✅ Image Selected" : "📸 Select Place Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addDayBtn,
            { backgroundColor: "#E0F2F1", marginTop: 10 },
          ]}
          onPress={handleAddPlaceToDay}
          disabled={uploadingImg}
        >
          {uploadingImg ? (
            <ActivityIndicator color="#0C7779" />
          ) : (
            <Text style={styles.addDayText}>
              + Add This Place to Day {tempDay.dayNumber}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Preview of places added TO THE CURRENT DAY */}
      {tempDay.places.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
            Places added for Day {tempDay.dayNumber}:
          </Text>
          {tempDay.places.map((p, idx) => (
            <View key={idx} style={styles.placePreviewRow}>
              <Image source={{ uri: p.image }} style={styles.miniThumb} />
              <Text style={styles.placePreviewText}>{p.name}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addDayBtn} onPress={addDay}>
        <Text style={styles.addDayText}>
          Save Day {tempDay.dayNumber} & Next
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {days.length > 0 && (
        <View style={styles.summaryBox}>
          <Text style={{ fontWeight: "bold", marginBottom: 10, color: "#333" }}>
            Itinerary Preview: {days.length} Days Added
          </Text>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitPackage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>FINISH & SAVE PACKAGE</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0C7779",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },

  placeCreatorContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 15,
  },
  imgBtn: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  placePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  miniThumb: { width: 40, height: 40, borderRadius: 4, marginRight: 10 },
  placePreviewText: { fontSize: 16, color: "#333" },

  addDayBtn: {
    borderColor: "#0C7779",
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  addDayText: { color: "#0C7779", fontWeight: "bold" },

  summaryBox: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10 },
  submitBtn: {
    backgroundColor: "#0C7779",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
