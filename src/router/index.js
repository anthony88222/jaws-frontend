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


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/friend', name: 'Friend', component: FriendView },
  { path: '/login', name: 'LoginPage', component: LoginPage },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/wishlist', name: 'wishlist', component: WishListView },
  { path: '/gamepage', name: 'gamepage', component: GamePageView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
