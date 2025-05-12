<!-- RegisterPage.vue -->
<template>
    <div class="register-wrapper">
        <div class="register-box">
            <h1 class="register-title">建立帳號</h1>
            <form class="register-form" @submit.prevent="registerUser">
                <!-- 用戶名 -->
                <label for="username">用戶名</label>
                <input id="username" type="text" v-model="username" required />

                <!-- 電子郵件 -->
                <label for="email">電子郵件</label>
                <input id="email" type="email" v-model="email" required />

                <!-- 密碼輸入 -->
                <label for="password">密碼</label>
                <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
                    <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                        {{ showPassword ? '隱藏' : '顯示' }}
                    </button>
                </div>

                <!-- 確認密碼 -->
                <label for="confirmPassword">確認密碼</label>
                <div class="input-group">
                    <input :type="showPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword"
                        required />
                    <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                        {{ showPassword ? '隱藏' : '顯示' }}
                    </button>
                </div>

                <!-- 註冊按鈕 -->
                <button class="btn-neon" type="submit">註冊</button>

                <!-- 錯誤訊息 -->
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
            </form>

            <!-- 已有帳號？ -->
            <div class="login-link">
                <span>
                    已經有帳號了？
                    <router-link to="/login" class="neon-link">回到登入</router-link>
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
// 1. 引入 Vue Composition API
import { ref } from 'vue'
// 2. 引入 Router 與狀態管理
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// 3. 定義表單欄位
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref('') // 顯示錯誤

// 4. 取得 router、authStore
const router = useRouter()
const authStore = useAuthStore()

// 5. 註冊函式
async function registerUser() {
    errorMessage.value = '' // 每次先清空錯誤

    // 前端簡單驗證：確認密碼一致
    if (password.value.length < 6) {
        errorMessage.value = '密碼長度至少 6 個字元'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = '密碼與確認密碼不一致'
        return
    }

    try {
        // 呼叫 Pinia 裡的 register（要先確定你有實作）
        const success = await authStore.register({
            username: username.value,
            email: email.value,
            password: password.value
        })

        if (success) {
            // 成功後跳回登入頁
            router.push('/login')
        } else {
            errorMessage.value = '註冊失敗，請稍後再試'
        }
    } catch (err) {
        // 捕捉 HTTP 或程式錯誤
        errorMessage.value = err.response?.data?.message || '註冊過程發生錯誤'
    }
}
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.register-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
    background: url('/assets/bg-login.jpg') no-repeat center center;
    background-size: cover;
    padding: 1rem;
}

.register-box {
    background-color: rgba(0, 0, 0, 0.8);
    padding: 2rem;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 20px var(--color-primary);
    min-width: 480px;
}

.register-form label {
    display: block;
    color: var(--color-text);
    margin-bottom: 0.3rem;
}

.register-form input {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 2px solid var(--color-primary);
    background: transparent;
    color: var(--color-text);
    border-radius: var(--border-radius);
    outline: none;
}

.input-group {
    position: relative;
}

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

.btn-neon {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--color-primary);
    background: transparent;
    color: var(--color-primary);
    cursor: pointer;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
}

.login-link {
    color: var(--color-text);
}

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

.error-message {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}
</style>
