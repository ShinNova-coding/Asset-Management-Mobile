import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL = "http://192.168.100.183:1011";

export const api = axios.create({
  baseURL: API_URL + "/api",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});