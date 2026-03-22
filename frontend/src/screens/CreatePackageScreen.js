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
import { useTheme } from "../theme/ThemeProvider";

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";

export default function CreatePackageScreen({ navigation }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [cities, setCities] = useState("");
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tempDay, setTempDay] = useState({
    dayNumber: 1,
    hotel: "",
    taxi: "",
    pickupLocation: "",
    pickupTime: "",
    places: [],
  });

  const [currentPlaceName, setCurrentPlaceName] = useState("");
  const [currentPlaceImg, setCurrentPlaceImg] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.inputText,
      borderColor: theme.colors.border,
    },
  ];

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

      setCurrentPlaceName("");
      setCurrentPlaceImg(null);
      Alert.alert("Success", "Place added to current day!");
    }
    setUploadingImg(false);
  };

  const addDay = () => {
    if (tempDay.places.length === 0) {
      Alert.alert(
        "Missing Info",
        "Please add at least one place to visit for this day.",
      );
      return;
    }

    setDays([...days, tempDay]);

    setTempDay({
      dayNumber: days.length + 2,
      hotel: "",
      taxi: "",
      pickupLocation: "",
      pickupTime: "",
      places: [],
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
          places: day.places,
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

  const placeTint =
    theme.mode === "dark" ? "rgba(12, 119, 121, 0.22)" : "#E0F2F1";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.colors.primary }]}>
        Create New Package
      </Text>

      <Text style={[styles.label, { color: theme.colors.text }]}>Package Name</Text>
      <TextInput
        style={inputStyle}
        placeholder="e.g. Kerala Bliss"
        placeholderTextColor={theme.colors.muted}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Cities Covered</Text>
      <TextInput
        style={inputStyle}
        placeholder="e.g. Munnar, Alleppey"
        placeholderTextColor={theme.colors.muted}
        value={cities}
        onChangeText={setCities}
      />

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <Text style={[styles.subHeader, { color: theme.colors.text }]}>
        Day {tempDay.dayNumber} Details
      </Text>

      <TextInput
        style={inputStyle}
        placeholder="Hotel Name (Optional)"
        placeholderTextColor={theme.colors.muted}
        onChangeText={(t) => setTempDay({ ...tempDay, hotel: t })}
        value={tempDay.hotel}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          style={[...inputStyle, { flex: 1, marginRight: 10 }]}
          placeholder="Pickup Loc (e.g. Hotel)"
          placeholderTextColor={theme.colors.muted}
          onChangeText={(t) => setTempDay({ ...tempDay, pickupLocation: t })}
          value={tempDay.pickupLocation}
        />
        <TextInput
          style={[...inputStyle, { flex: 1 }]}
          placeholder="Time (e.g. 9:00 AM)"
          placeholderTextColor={theme.colors.muted}
          onChangeText={(t) => setTempDay({ ...tempDay, pickupTime: t })}
          value={tempDay.pickupTime}
        />
      </View>

      <TextInput
        style={inputStyle}
        placeholder="Taxi / Driver Info (Optional)"
        placeholderTextColor={theme.colors.muted}
        onChangeText={(t) => setTempDay({ ...tempDay, taxi: t })}
        value={tempDay.taxi}
      />

      <View
        style={[
          styles.placeCreatorContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Add Places to Visit
        </Text>

        <TextInput
          style={inputStyle}
          placeholder="Place Name (e.g. Ajmer Fort)"
          placeholderTextColor={theme.colors.muted}
          value={currentPlaceName}
          onChangeText={setCurrentPlaceName}
        />

        <TouchableOpacity
          style={[styles.imgBtn, { backgroundColor: theme.colors.primary }]}
          onPress={pickImage}
        >
          <Text style={[styles.imgBtnText, { color: theme.colors.buttonText }]}>
            {currentPlaceImg ? "✅ Image Selected" : "📸 Select Place Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addDayBtn,
            {
              backgroundColor: placeTint,
              borderColor: theme.colors.primary,
              marginTop: 10,
            },
          ]}
          onPress={handleAddPlaceToDay}
          disabled={uploadingImg}
        >
          {uploadingImg ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text style={[styles.addDayText, { color: theme.colors.primary }]}>
              + Add This Place to Day {tempDay.dayNumber}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {tempDay.places.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
            Places added for Day {tempDay.dayNumber}:
          </Text>
          {tempDay.places.map((p, idx) => (
            <View
              key={idx}
              style={[
                styles.placePreviewRow,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Image source={{ uri: p.image }} style={styles.miniThumb} />
              <Text style={[styles.placePreviewText, { color: theme.colors.text }]}>
                {p.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.addDayBtn, { borderColor: theme.colors.primary }]}
        onPress={addDay}
      >
        <Text style={[styles.addDayText, { color: theme.colors.primary }]}>
          Save Day {tempDay.dayNumber} & Next
        </Text>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      {days.length > 0 && (
        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
            Itinerary Preview: {days.length} Days Added
          </Text>
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
            onPress={submitPackage}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <Text style={[styles.submitBtnText, { color: theme.colors.buttonText }]}>
                FINISH & SAVE PACKAGE
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  divider: { height: 1, marginVertical: 20 },

  placeCreatorContainer: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  imgBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imgBtnText: { fontWeight: "bold", fontSize: 16 },

  previewTitle: { fontWeight: "bold", marginBottom: 8 },

  placePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1,
  },
  miniThumb: { width: 40, height: 40, borderRadius: 4, marginRight: 10 },
  placePreviewText: { fontSize: 16 },

  addDayBtn: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  addDayText: { fontWeight: "bold" },

  summaryBox: { padding: 15, borderRadius: 10, borderWidth: 1 },
  summaryTitle: { fontWeight: "bold", marginBottom: 10 },
  submitBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtnText: { fontWeight: "bold", fontSize: 16 },
});
