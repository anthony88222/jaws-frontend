<template>
  <header>
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="site-logo">
          <img src="@/assets/logo2.png" alt="JAWS Logo" />
        </router-link>
      </div>


      <nav>
        <ul class="main-nav">
          <li class="search-li">
            <SearchBar />
          </li>
          <li><router-link to="/library">遊戲庫</router-link></li>
          <li><router-link to="/promotion">限時特賣</router-link></li>




          <!-- 登入後 -->
          <li v-if="auth.user" class="dropdown user-dropdown" ref="dropdownRef">
            <div class="user-actions">
              <!-- 願望清單按鈕 -->

              <!-- 購物車按鈕 -->
          <li><router-link to="/cart">購物車</router-link></li>

          <!-- 使用者資訊 -->
          <div class="user-info" @click="toggleMenu">
            <div class="username-container">
              <span class="username">{{ auth.user.username }}</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            <img :src="avatarFullUrl(auth.user?.avatarUrl) + '?v=' + Date.now()" alt="Avatar" class="avatar"
              @click.stop="goProfile" />


          </div>
    </div>

    <ul class="dropdown-menu right-align" :class="{ 'show': showMenu }">
      <li><router-link to="/wishlist">願望清單</router-link></li>
      <li><router-link to="/wallet">檢視我的錢包：NT$ {{ (auth.user.wallet || 0).toLocaleString() }}</router-link></li>
      <li><router-link to="/friend">檢視我的好友</router-link></li>
      <li><a href="#" @click.prevent="logout">登出</a></li>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import SearchBar from '@/components/SearchBar.vue'

const auth = useAuthStore()
const router = useRouter()
const showMenu = ref(false)
const dropdownRef = ref(null)

// 點擊頭像區塊切換顯示狀態
function toggleMenu() {
  console.log('Toggle menu clicked')
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
  console.log('Profile clicked')
  router.push('/profile')
}

// 登出後清空狀態並跳回首頁
function logout() {
  auth.logout()
  router.push('/')
}

// 點擊非 dropdown 區域時自動關閉選單
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

// 註冊與移除 click 事件
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
