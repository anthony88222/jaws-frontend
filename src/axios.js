import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // 先抓 pinia，沒值再抓 localStorage
  let token = null;
  try {
    token = useAuthStore().token;
  } catch {
    // fallback: 有時候 pinia 尚未初始化
  }
  // 這行直接用 localStorage 的 key
  if (!token) {
    const storage = localStorage.getItem("auth");
    if (storage) {
      token = JSON.parse(storage).token;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
