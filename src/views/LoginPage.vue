<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h1 class="login-title">LOGIN</h1>
      <form class="login-form" @submit.prevent="login">
        <label for="username">用戶名</label>
        <input id="username" type="text" v-model="username" required />

        <label for="password">密碼</label>
        <div class="input-group">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>

        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe" />
          <label for="remember">記住我</label>
        </div>

        <button class="btn-neon" type="submit">LOGIN</button>

        <!-- 顯示錯誤訊息 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>

      <div class="register-link">
        <router-link to="/register" class="neon-link">建立帳號</router-link>
        <span class="divider">|</span>
        <a href="" class="neon-link">忘記密碼？</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入必要模組
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// 定義登入頁面的狀態
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref('')

// 引入路由和狀態管理
const router = useRouter()
const authStore = useAuthStore()

// 頁面載入時檢查是否有儲存的用戶資料
onMounted(() => {
  // 檢查 store 中是否有保存的用戶名和記住我狀態
  if (authStore.rememberMe && authStore.savedUsername) {
    username.value = authStore.savedUsername;
    rememberMe.value = true;
  }
})

// 登入函式
async function login() {
  errorMessage.value = '' // 每次點登入都先清除錯誤訊息

  const success = await authStore.login({
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value // 傳遞「記住我」的狀態
  })

  if (success) {
    // 登入成功：跳轉到個人資料頁
    router.push('/profile')
  } else {
    // 登入失敗：顯示錯誤訊息
    errorMessage.value = '登入失敗，請檢查帳號與密碼'
  }
}
</script>

<style scoped>
/* 統一邊框盒模型，避免寬度與內距相加導致跑版 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 外層容器：置中對齊，背景圖設定，高度採用 80vh 提供較佳視覺居中 */
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  background: url('/assets/bg-login.jpg') no-repeat center center;
  background-size: cover;
  padding: 1rem;
}

/* 登入區塊設定：半透明背景、陰影、邊框、最小寬度與最大寬度限制 */
.login-box {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  min-width: 480px;
  /* max-width: 800px; */
  /* width: 100%; */
  text-align: center;
}

/* 標題樣式：字體大小與光暈效果 */
.login-title {
  color: var(--color-secondary);
  text-shadow: 0 0 12px var(--color-secondary);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

/* 標籤文字樣式：靠左對齊、有文字陰影 */
.login-form label {
  display: block;
  text-align: left;
  color: var(--color-text);
  margin-bottom: 0.3rem;
  text-shadow: 0 0 4px var(--color-primary);
}

/* 輸入框樣式：100% 寬度、透明背景、邊框圓角、字體、陰影 */
.login-form input[type='text'],
.login-form input[type='password'] {
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-text);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  text-shadow: 0 0 4px var(--color-primary);
  outline: none;
}

/* 輸入框包裹區：用於放置眼睛圖示 */
.input-group {
  position: relative;
}

/* 顯示/隱藏密碼按鈕樣式：置右置中，透明背景，文字有陰影 */
.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  text-shadow: 0 0 6px var(--color-primary);
  padding: 0;
}

/* 記住我區塊：橫向排列、字體較小、文字陰影 */
.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  font-size: 0.85rem;
  text-shadow: 0 0 4px var(--color-primary);
}

/* 登入按鈕樣式：滿版寬度、邊框、漸變陰影、滑鼠互動效果 */
.btn-neon {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
  font-weight: bold;
  text-shadow: 0 0 8px var(--color-primary);
  transition: var(--transition);
  cursor: pointer;
  border-radius: var(--border-radius);
}

.btn-neon:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 20px var(--color-primary);
}

/* 註冊連結區塊：橫向排列，自動換行，置中對齊 */
.register-link {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* 連結文字樣式：文字光暈、hover 效果 */
.neon-link {
  color: var(--color-secondary);
  font-size: 0.9rem;
  text-shadow: 0 0 6px var(--color-secondary);
  text-decoration: none;
  transition: color var(--transition);
}

.neon-link:hover {
  color: yellow;
  text-shadow: 0 0 8px var(--color-primary);
}

/* 分隔線樣式：輔助文字顏色與陰影 */
.divider {
  color: var(--color-muted);
  text-shadow: 0 0 3px var(--color-muted);
}

/* 錯誤訊息樣式：紅色顯眼提示 */
.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-shadow: 0 0 4px red;
}
</style>
