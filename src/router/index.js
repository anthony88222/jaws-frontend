// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// 匯入頁面元件
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import FriendView from '../views/FriendView.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfileView from '../views/ProfileView.vue'
import WishListView from '../views/WishlistView.vue'
import GamePageView from '../views/GamePageView.vue'
import PromotionView from '../views/PromotionView.vue'


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
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true }, // 需要登入的頁面＋這行
  },
  { path: '/wishlist', name: 'wishlist', component: WishListView },
  { path: '/gamepage/:gameId', name: 'gamepage', component: GamePageView },
  { path: '/promotion', name: 'promotion', component: PromotionView },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        // 先滾到頂部
        window.scrollTo({ top: 0, behavior: 'auto' })

        // 延遲 100ms 再跳回 savedPosition
        setTimeout(() => {
          resolve(savedPosition)
        }, 300)
      })
    } else {
      return { top: 0 }
    }
  }
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.token) {
    next({ name: "LoginPage" });
  } else {
    next();
  }
});

export default router
