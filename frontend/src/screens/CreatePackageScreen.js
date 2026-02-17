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

// Import from .env
// Ensure you run: npx expo start -c (to clear cache after changing .env)
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
    places: "",
    images: [],
  });
  const [uploadingImg, setUploadingImg] = useState(false);

  // --- CLOUDINARY UPLOAD FUNCTION ---
  const uploadToCloudinary = async (uri) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      Alert.alert(
        "Configuration Error",
        "Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in your .env file.",
      );
      return null;
    }

    const data = new FormData();

    // 1. Append the file
    // Note: 'name' and 'type' are required by Cloudinary for React Native FormData
    let filename = uri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image/jpeg`;

    data.append("file", { uri: uri, name: filename, type: type });

    // 2. Append the Upload Preset (Crucial for unsigned uploads)
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // 3. Append Cloud Name (Optional but good practice in some SDKs, here we use it in URL)
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const result = await res.json();

      if (result.secure_url) {
        return result.secure_url;
      } else {
        Alert.alert(
          "Upload Failed",
          result.error?.message || "Unknown error from Cloudinary",
        );
        return null;
      }
    } catch (err) {
      console.log("Upload error:", err);
      Alert.alert("Upload Failed", "Network error or invalid configuration");
      return null;
    }
  };

  const pickImage = async () => {
    // Permission check
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to upload images.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5, // Keep quality lower for faster mobile uploads
    });

    if (!result.canceled) {
      setUploadingImg(true);
      const url = await uploadToCloudinary(result.assets[0].uri);
      setUploadingImg(false);

      if (url) {
        setTempDay({ ...tempDay, images: [...tempDay.images, url] });
      }
    }
  };

  const addDay = () => {
    if (!tempDay.hotel || !tempDay.places) {
      Alert.alert(
        "Missing Info",
        "Please fill Hotel and Places before adding the day.",
      );
      return;
    }
    setDays([...days, tempDay]);
    // Reset temp day for the next day
    setTempDay({
      dayNumber: days.length + 2,
      hotel: "",
      taxi: "",
      places: "",
      images: [],
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
      await api.post("/packages", {
        title,
        cities,
        totalDays: days.length,
        itinerary: days,
      });
      Alert.alert("Success", "Package created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to create package. Check backend console.");
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
        placeholder="Hotel Name"
        onChangeText={(t) => setTempDay({ ...tempDay, hotel: t })}
        value={tempDay.hotel}
      />
      <TextInput
        style={styles.input}
        placeholder="Taxi / Driver Info"
        onChangeText={(t) => setTempDay({ ...tempDay, taxi: t })}
        value={tempDay.taxi}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Places to Visit (comma separated)"
        onChangeText={(t) => setTempDay({ ...tempDay, places: t })}
        value={tempDay.places}
      />

      {/* Image Upload Section */}
      <View style={styles.imageSection}>
        <TouchableOpacity
          style={styles.imgBtn}
          onPress={pickImage}
          disabled={uploadingImg}
        >
          {uploadingImg ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>
              + Upload Image for Day {tempDay.dayNumber}
            </Text>
          )}
        </TouchableOpacity>

        {/* Preview uploaded images for this day */}
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {tempDay.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.thumb} />
          ))}
        </ScrollView>
      </View>

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

  imageSection: { marginBottom: 15 },
  imgBtn: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

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
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
