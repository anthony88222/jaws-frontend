<template>
  <header>
    <div class="container">
      <!-- Logo -->
      <div class="logo-container">
        <router-link to="/" class="site-logo">
          <img src="@/assets/logo2.png" alt="JAWS Logo" />
        </router-link>
      </div>

      <nav>
        <ul class="main-nav">
          <!-- 搜尋列 -->
          <li class="search-li">
            <SearchBar />
          </li>

          <!-- 常駐連結 -->
          <li><router-link to="/library">遊戲庫</router-link></li>
          <li><router-link to="/promotion">限時特賣</router-link></li>


          <!-- 已登入時：使用者下拉 -->
          <li v-if="auth.user" class="dropdown user-dropdown" ref="dropdownRef">
            <div class="user-actions">
              <!-- 購物車按鈕 -->
              <router-link to="/cart" class="cart-link">購物車</router-link>

              <!-- 點擊頭像區 -->
              <div class="user-info" @click="toggleMenu">
                <div class="username-container">
                  <span class="username">{{ auth.user.username }}</span>
                  <span class="dropdown-arrow">▼</span>
                </div>
                <img
                  :src="avatarFullUrl(auth.user?.avatarUrl) + '?v=' + Date.now()"
                  alt="Avatar"
                  class="avatar"
                  @click.stop="goProfile"
                />
              </div>
                
            </div>
            <!-- 下拉選單內容 -->
            <ul class="dropdown-menu right-align" :class="{ show: showMenu }">
              <li><router-link to="/wishlist">願望清單</router-link></li>
              <li>
                <router-link to="/wallet">
                  檢視我的錢包：NT$ {{ (wallet || 0).toLocaleString() }}
                </router-link>
              </li>
              <li><router-link to="/order-history">歷史訂單</router-link></li>
              <li><router-link to="/friend">檢視我的好友</router-link></li>
              <li>
                <a href="#" @click.prevent="logout">登出</a>
              </li>
            </ul>
          </li>
          <!-- 未登入 -->
          <li v-else>
            <router-link to="/login">登入 / 註冊</router-link>
          </li>
        </ul>
    </nav>
    </div>
  </header>
</template>

<script setup>
// Vue Composition API
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axios from '@/axios'            // ← 和 WalletView 一樣
import SearchBar from '@/components/SearchBar.vue'

const auth = useAuthStore()
const router = useRouter()

// 下拉選單狀態
const showMenu = ref(false)
const dropdownRef = ref(null)

// 直接用跟 WalletView.vue 一樣的 ref 存錢包
const wallet = ref(0)

// 跟 WalletView 相同：mounted 時呼叫，並用 /user/${id}
async function fetchWallet() {
  if (!auth.user?.id) return
  try {
    const res = await axios.get(`/user/${auth.user.id}`)
    wallet.value = typeof res.data.wallet === 'number'
      ? res.data.wallet
      : 0
  } catch (e) {
    console.error('取得錢包餘額錯誤', e)
    wallet.value = 0
  }
}

// 監聽 user 變動（登入、登出都會觸發）
watch(() => auth.user, fetchWallet, { immediate: true })

// 切換下拉顯示
function toggleMenu() {
  showMenu.value = !showMenu.value
}

function avatarFullUrl(path) {
  if (!path) return '/default-avatar.png';
  if (path.startsWith('http')) return path;
  // 補上你的後端 domain
  return `http://localhost:8080${path}`;
}

// 點擊大頭貼跳到個人資料頁
function goProfile() {
  router.push('/profile')
}

// 登出並回首頁
function logout() {
  auth.logout()
  router.push('/')
}

// 點擊外面要自動關閉下拉
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.site-logo {
  display: inline-block;
  height: 70px;
}

.site-logo img {
  height: 100%;
  width: auto;
}

/* 你也可以加上 hover 樣式讓 dropdown 更好看 */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #1a1a2a;
  list-style: none;
  padding: 0.5rem 0;
  display: none;
  min-width: 180px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

/* 使用者下拉選單不要用 hover 觸發，而是用點擊 */
.user-dropdown:hover .dropdown-menu {
  display: none;
}

/* 顯示下拉選單的類別 */
.dropdown-menu.show {
  display: block !important;
}

.dropdown-menu.right-align {
  right: 0;
  left: auto;
}

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu li a {
  padding: 8px 16px;
  display: block;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-menu li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 使用者資訊樣式 */
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username-container {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.username {
  color: var(--color-text);
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 4px;
  color: var(--color-text);
  opacity: 0.7;
}

/* 修改現有的頭像樣式 */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary, #00a8ff);
  background-color: white;
  /* 添加白色背景 */
  box-shadow: 0 0 8px rgba(0, 168, 255, 0.5);
  /* 添加光暈效果 */
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-actions a {
  color: var(--color-primary);
  text-shadow: 0 0 3px var(--color-primary);
}

.user-actions a:hover {
  color: yellow;
  text-shadow: 0 0 3px yellow;
}


.main-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
