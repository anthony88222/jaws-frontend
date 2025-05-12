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

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/profile", name: "Profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/friend", name: "Friend", component: FriendView },
  { path: "/cart", name: "Cart", component: CartView },
  { path: "/invite", name: "Invite", component: InviteView },
  { path: "/chat", name: "Chat", component: ChatView },
  { path: "/wishlist", name: "wishlist", component: WishListView },
  { path: "/gamepage/:gameId", name: "GamePage", component: () => import('@/views/GamePageView.vue'), props: true },
  { path: "/promotion", name: "promotion", component: PromotionView },
  { path: "/library", name: "Library", component: LibraryView },
  { path: "/order-history", name: "OrderHistory", component: OrderHistoryView },
  { path: "/order/:orderId", name: "OrderDetail", component: OrderDetailView },
  { path: "/category/:categoryName", name: "CategoryView", component: () => import('@/views/CategoryView.vue'), props: true },
  { path: "/checkout", name: "Checkout", component: () => import('@/views/CheckoutView.vue') },
  { path: "/games", name: "games", component: AllGamesView },
]



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
