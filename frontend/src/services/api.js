import axios from "axios";
import * as SecureStore from "expo-secure-store";

const DEFAULT_BASE_URL = "https://trip-planner-q03f.onrender.com/api";

// const DEFAULT_BASE_URL = "http://192.168.29.233:5000/api";

const BASE_URL = DEFAULT_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Token fetch error:", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const getApiBaseUrl = () => BASE_URL;

export default api;
