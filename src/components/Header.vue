<template>
  <header>
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="site-logo">
          <img src="@/assets/logo2.png" alt="JAWS Logo" />
        </router-link>
      </div>

      <nav>
        <ul>
          <li><router-link to="/">首頁</router-link></li>
          <li class="dropdown">
            <a href="#">遊戲庫</a>
            <ul class="dropdown-menu">
              <li><a href="#">動作遊戲</a></li>
              <li><a href="#">射擊遊戲</a></li>
              <li><a href="#">卡牌遊戲</a></li>
            </ul>
          </li>
          <li><a href="#">商店</a></li>

          <!-- ✅ 使用者登入狀態切換區 -->
          <li v-if="auth.user" class="dropdown">
            <a href="#">
              👋 Hi, {{ auth.user.username }}
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/profile">個人資料</router-link></li>
              <li><a href="#" @click.prevent="logout">登出</a></li>
            </ul>
          </li>

          <!-- ✅ 未登入時顯示登入連結 -->
          <li v-else>
            <router-link to="/login">登入 / 註冊</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/') // 登出後導回首頁
}
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
  background-color: white;
  list-style: none;
  padding: 0.5rem 0;
  display: none;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
