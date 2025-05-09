// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import FriendView from '../views/FriendView.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfileView from '../views/ProfileView.vue'
import WishListView from '../views/WishlistView.vue'
import GamePageView from '../views/GamePageView.vue'
import PromotionView from '../views/PromotionView.vue'
import AllGamesView from '../views/AllGamesView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/friend', name: 'Friend', component: FriendView },
  { path: '/login', name: 'LoginPage', component: LoginPage },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/wishlist', name: 'wishlist', component: WishListView },
  { path: '/gamepage/:gameId', name: 'GamePage', component: () => import('@/views/GamePageView.vue'), props: true },
  { path: '/promotion', name: 'promotion', component: PromotionView },
  {path: '/category/:categoryName', name: 'CategoryView', component: () => import('@/views/CategoryView.vue'), props: true },
  { path: '/games', name: 'AllGames', component: AllGamesView },

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
export default router
