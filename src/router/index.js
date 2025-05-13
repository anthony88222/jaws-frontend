// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

// 匯入頁面元件
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import FriendView from '../views/FriendView.vue'
import InviteView from '../views/InviteView.vue'
import ChatView from '../views/ChatView.vue'
import LoginPage from '../views/LoginPage.vue'
import LibraryView from '../views/LibraryView.vue'
import OrderHistoryView from '../views/OrderHistoryView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import WishListView from '../views/WishlistView.vue'
import GamePageView from '../views/GamePageView.vue'
import PromotionView from '../views/PromotionView.vue'
import AllGamesView from '../views/AllGamesView.vue'
import RegisterPage from "../views/RegisterPage.vue";
const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/register", name: "RegisterPage", component: RegisterPage },
  
  // 需要登入的頁面
  { path: "/cart", name: "Cart", component: CartView, meta: { requiresAuth: true } },
  { path: "/profile", name: "Profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/friend", name: "Friend", component: FriendView, meta: { requiresAuth: true } },
  { path: "/invite", name: "Invite", component: InviteView, meta: { requiresAuth: true } },
  { path: "/chat", name: "Chat", component: ChatView, meta: { requiresAuth: true } },
  { path: "/wishlist", name: "Wishlist", component: WishListView, meta: { requiresAuth: true } },
  { path: "/library", name: "Library", component: LibraryView, meta: { requiresAuth: true } },
  { path: "/order-history", name: "OrderHistory", component: OrderHistoryView, meta: { requiresAuth: true } },
  { path: "/order/:orderId", name: "OrderDetail", component: OrderDetailView, meta: { requiresAuth: true } },
  { path: "/checkout", name: "Checkout", component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true } },

  // 其他公開頁面
  { path: "/promotion", name: "Promotion", component: PromotionView },
  { path: "/games", name: "AllGamesView", component: AllGamesView },
  { path: "/gamepage/:gameId", name: "GamePage", component: () => import('@/views/GamePageView.vue'), props: true },
  { path: "/category/:categoryName", name: "CategoryView", component: () => import('@/views/CategoryView.vue'), props: true },
];




const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // ① 瀏覽器返回 / 前進 → 還原舊位置（延遲 100 ms）
    if (savedPosition) {
      return new Promise(resolve => {
        // 等待下一輪 repaint，確保新頁面已經掛載
        requestAnimationFrame(() => {
          setTimeout(() => resolve({ ...savedPosition, behavior: 'auto' }), 400)
        })
      })
    }

    // ② 一般導航 → 直接滾到頂端
    return { left: 0, top: 0 }
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
