// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import FriendView from '../views/FriendView.vue'
import InviteView from '../views/InviteView.vue'
import ChatView from '../views/ChatView.vue'
import LoginPage from '../views/LoginPage.vue'


const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/friend', name: 'Friend', component: FriendView },
  { path: '/invite', name: 'Invite', component: InviteView },
  { path: '/chat', name: 'Chat', component: ChatView },
  { path: '/login', name: 'LoginPage', component: LoginPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
