// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// 匯入頁面元件
import HomeView from "../views/HomeView.vue";
import CartView from "../views/CartView.vue";
import FriendView from "../views/FriendView.vue";
import LoginPage from "../views/LoginPage.vue";
import ProfileView from "../views/ProfileView.vue";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/login", name: "LoginPage", component: LoginPage },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true }, // 需要登入的頁面＋這行
  },
  { path: "/friend", name: "Friend", component: FriendView },
  { path: "/cart", name: "Cart", component: CartView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 路由守衛安全寫法
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: "LoginPage" });
  } else {
    next();
  }
});

export default router;
