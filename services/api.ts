import axios from "axios";

const API = axios.create({
  baseURL: "http://YOUR_LARAVEL_BACKEND_URL/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;