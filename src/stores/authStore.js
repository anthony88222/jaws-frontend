// src/stores/authStore.js
import { defineStore } from "pinia";
import axios from "@/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null, // JWT Token
    user: null, // 使用者資訊
    rememberMe: false, // 記住我選項狀態
    savedUsername: null, // 保存的用戶名（專門用於記住我功能）
  }),

  actions: {
    async login({ username, password, rememberMe = false }) {
      try {
        // 發送登入請求
        const res = await axios.post("/user/login", { username, password });
        this.token = res.data.data.accessToken;

        // 用 token 呼叫 /me 拿使用者資訊
        const profileRes = await axios.get("/user/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        // 儲存使用者資訊
        this.user = profileRes.data.data;

        // 儲存「記住我」狀態和用戶名
        this.rememberMe = rememberMe;
        if (rememberMe) {
          this.savedUsername = username;
        } else {
          this.savedUsername = null;
        }

        return true;
      } catch (err) {
        return false;
      }
    },

    async register({ username, email, password }) {
      try {
        const res = await axios.post("/user/register", {
          username,
          email,
          password,
        });
        return true;
      } catch (err) {
        throw err;
      }
    },

    logout() {
      // 保存用戶名和記住我狀態（如果有勾選記住我）
      const rememberedUsername = this.rememberMe ? this.savedUsername : null;
      const wasRemembered = this.rememberMe;

      // 清除登入狀態
      this.token = null;
      this.user = null;

      // 如果之前有勾選記住我，則保留這些資訊
      this.rememberMe = wasRemembered;
      this.savedUsername = rememberedUsername;
    },

    // 清除所有狀態（包括記住我）
    clearAll() {
      this.token = null;
      this.user = null;
      this.rememberMe = false;
      this.savedUsername = null;
      localStorage.removeItem("pinia-auth");
    },
  },
  persist: true,
});
