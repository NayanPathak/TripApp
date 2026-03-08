import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Must include protocol (http://) and port. Change IP to your machine's IP when testing on device/emulator.
const BASE_URL = "http://192.168.29.233:5000/api";

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
                                                      