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
 
  const uploadToCloudinary = async (base64Img) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      Alert.alert(
        "Configuration Error",
        "Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in your .env file.",
      );
      return null;
    }

    const data = new FormData();

    // 1. Because we are using base64, we can just pass the string directly! No need to split filenames.
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
        return result.secure_url; // Return the final URL
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        // 1. Turn on the loading spinner so the user knows it's working
        setUploadingImg(true);

        const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
        console.log("Base64 ready, uploading to Cloudinary...");

        // 2. AWAIT the upload and capture the returned URL
        const uploadedUrl = await uploadToCloudinary(base64Img);

        // 3. If successful, add the new URL to the tempDay.images array
        if (uploadedUrl) {
          console.log("Success! Saved URL:", uploadedUrl);
          setTempDay((prevDay) => ({
            ...prevDay,
            images: [...prevDay.images, uploadedUrl],
          }));
        }

        // 4. Turn off the loading spinner
        setUploadingImg(false);
      }
    } catch (error) {
      setUploadingImg(false);
      console.log("ImagePicker Error: ", error);
      alert("Error opening gallery: " + error.message);
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
     // --- CRITICAL FIX: Reformat the 'days' array to match Backend Schema ---
     const formattedItinerary = days.map((day) => {
       // 1. Format Hotel (String -> Object)
       const formattedHotel = day.hotel ? { name: day.hotel } : undefined;

       // 2. Format Taxi (String -> Object)
       const formattedTaxi = day.taxi ? { vehicleType: day.taxi } : undefined;

       // 3. Format Places (Comma Separated String -> Array of Objects)
       // AND attach the uploaded images to the first place (or distribute them)
       let formattedPlaces = [];
       if (day.places) {
         // Split "Munnar, Tea Garden" into an array
         const placeNames = day.places.split(",").map((p) => p.trim());

         formattedPlaces = placeNames.map((placeName, index) => {
           return {
             name: placeName,
             // If we have an uploaded image, assign it to the first place
             image: index === 0 && day.images.length > 0 ? day.images[0] : null,
           };
         });
       }

       return {
         dayNumber: day.dayNumber,
         title: `Day ${day.dayNumber} in ${cities}`, // Optional title
         hotel: formattedHotel,
         taxi: formattedTaxi,
         places: formattedPlaces,
       };
     });

     // --- SEND FORMATTED DATA ---
     await api.post("/packages", {
       title,
       cities,
       totalDays: days.length,
       itinerary: formattedItinerary, // Send the newly formatted array
     });

     Alert.alert("Success", "Package created successfully!", [
       { text: "OK", onPress: () => navigation.goBack() },
     ]);
   } catch (e) {
     // Better error logging to see exactly what Mongoose rejects
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
