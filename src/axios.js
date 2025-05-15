import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const instance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const store = useAuthStore();
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`;
  }
  return config;
});

export default instance;
