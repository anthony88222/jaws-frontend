// src/stores/authStore.js
// 這是用來管理使用者登入狀態的 Pinia store，包含登入、登出等功能。
import { defineStore } from "pinia";
import axios from "@/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null, // JWT Token
    user: null, // 使用者資訊
  }),

  actions: {
    /**
     * 登入流程：
     * 1. 傳送帳號密碼給後端
     * 2. 取得 token 後存起來
     * 3. 主動呼叫 /user/me 取得使用者資料
     */
    async login({ username, password }) {
      try {
        // 1️⃣ 發送登入請求
        const res = await axios.post("/user/login", { username, password });
        console.log("🚀 登入回傳：", res.data);
        this.token = res.data.data.token;// 🔁 維持你原本的命名習慣（token）

        // 2️⃣ 用 token 呼叫 /me 拿使用者資訊
        const profileRes = await axios.get("/user/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        console.log("✅ /me 回傳：", profileRes.data);

        // 3️⃣ 儲存使用者資訊
        this.user = profileRes.data.data;

        return true;
      } catch (err) {
        console.error("登入失敗:", err);
        return false;
      }
    },

    /**
     * 登出流程：
     * 1. 清除狀態中的 token 與 user
     * 2. 移除 localStorage 中的 pinia 持久化資料
     */
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("pinia-auth"); // 🧼 清除 pinia 持久化資料（安全保險）
    },
  },

  // ✅ 啟用 pinia-plugin-persistedstate（記住登入狀態）
  persist: true,
});
