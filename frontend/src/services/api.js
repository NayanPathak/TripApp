import axios from "axios";
import * as SecureStore from "expo-secure-store";

// CHANGE THIS TO YOUR LOCAL IP FOR ANDROID EMULATOR (e.g., http://192.168.1.5:5000)
const BASE_URL = "https://trip-planner-q03f.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
