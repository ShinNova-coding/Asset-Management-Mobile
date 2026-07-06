import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_URL = "http://192.168.100.190:1011";

let _token: string | null = null;

export function setToken(token: string | null) {
  _token = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const api = axios.create({
  baseURL: API_URL + "/api",
});

api.interceptors.request.use(
  async (config) => {
    try {
      const t = _token || (await SecureStore.getItemAsync("token"));
      if (t) {
        config.headers.Authorization = `Bearer ${t}`;
      }
    } catch {
      if (_token) {
        config.headers.Authorization = `Bearer ${_token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);