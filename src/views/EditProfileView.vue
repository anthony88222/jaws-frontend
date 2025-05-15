<!-- 整合：個人資料 + 修改密碼 -->
<template>
    <div class="profile-view container">
        <h1 class="page-title">歡迎回來，{{ user?.username }}</h1>

        <div class="profile-layout">
            <!-- 左側：個人資料 -->
            <div class="profile-section">
                <h2 class="section-title">個人資料</h2>
                <form @submit.prevent="updateProfile" class="profile-form">
                    <div class="form-group">
                        <label>帳號（無法修改）：</label>
                        <input type="text" :value="user?.username" disabled class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>Email：</label>
                        <input type="email" v-model="email" required class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>大頭貼 URL：</label>
                        <input type="text" v-model="avatarUrl" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>個人簽名：</label>
                        <textarea v-model="signature" rows="2" class="form-textarea"></textarea>
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn-primary">儲存修改</button>
                    </div>
                </form>
            </div>

            <!-- 右側：修改密碼 -->
            <div class="password-section">
                <h2 class="section-title">修改密碼</h2>
                <form @submit.prevent="changePassword" class="password-form">
                    <div class="form-group">
                        <label>舊密碼：</label>
                        <input type="password" v-model="oldPassword" required class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>新密碼：</label>
                        <input type="password" v-model="newPassword" required class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>再次輸入新密碼：</label>
                        <input type="password" v-model="confirmPassword" required class="form-input" />
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn-primary">更新密碼</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 顯示訊息 -->
        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import axios from '@/axios'

const auth = useAuthStore()
const { user } = storeToRefs(auth)

// 個人資料欄位
const email = ref(user.value?.email || '')
const avatarUrl = ref(user.value?.avatarUrl || '')
const signature = ref(user.value?.signature || '')

// 密碼變更欄位
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const message = ref('')

// ✅ 更新個人資料
async function updateProfile() {
    try {
        await axios.put('/user/me', {
            email: email.value,
            avatarUrl: avatarUrl.value,
            signature: signature.value,
        })

        const profileRes = await axios.get('/user/me')
        auth.user = profileRes.data.data

        message.value = '資料更新成功 ✅'
    } catch (err) {
        console.error('更新失敗', err)
        message.value = '更新失敗，請稍後再試 ❌'
    }
}

// ✅ 修改密碼（加上防呆）
async function changePassword() {
    if (newPassword.value !== confirmPassword.value) {
        message.value = '新密碼與確認密碼不一致 ❌'
        return
    }

    if (newPassword.value === oldPassword.value) {
        message.value = '新密碼不能與舊密碼相同 ❌'
        return
    }

    try {
        await axios.put('/user/update-password', {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
        })

        message.value = '密碼更新成功 ✅'
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (err) {
        console.error('密碼更新失敗', err)
        message.value = err.response?.data?.message || '密碼更新失敗，請確認舊密碼正確 ❌'
    }
}
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

.profile-view {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius);
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    color: var(--color-primary);
    margin-bottom: 2rem;
    text-align: center;
}

.profile-layout {
    display: flex;
    gap: 2rem;
}

.profile-section,
.password-section {
    flex: 1;
}

.section-title {
    margin-bottom: 1.5rem;
    color: var(--color-primary);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius);
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--color-text);
}

.form-textarea {
    min-height: 100px;
    resize: vertical;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--border-radius);
    color: white;
    cursor: pointer;
    font-weight: bold;
}

.message {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    text-align: center;
    color: yellow;
}

/* 響應式設計 - 在小螢幕上改為垂直排列 */
@media screen and (max-width: 768px) {
    .profile-layout {
        flex-direction: column;
    }

    .profile-section,
    .password-section {
        width: 100%;
    }
}
</style>
