<!-- 整合：個人資料 + 修改密碼 + 刪除帳號（含防呆 + 再確認） -->
<template>
    <div class="profile-view container">
        <h1>歡迎回來，{{ user?.username }}</h1>

        <!-- 🔹 使用者資訊編輯表單 -->
        <form @submit.prevent="updateProfile" class="profile-form">
            <div>
                <label>帳號（無法修改）：</label>
                <input type="text" :value="user?.username" disabled />
            </div>

            <div>
                <label>Email：</label>
                <input type="email" v-model="email" required />
            </div>

            <div>
                <label>大頭貼 URL：</label>
                <input type="text" v-model="avatarUrl" />
            </div>

            <div>
                <label>個人簽名：</label>
                <textarea v-model="signature" rows="2"></textarea>
            </div>

            <div>
                <label><input type="checkbox" v-model="gamesPrivacy" /> 隱藏我的遊戲庫</label>
            </div>

            <div>
                <label><input type="checkbox" v-model="reviewsPrivacy" /> 隱藏我的評論</label>
            </div>

            <button type="submit">儲存修改</button>
        </form>

        <div style="padding: 20px 0px 0px 0px;">
            <hr />
        </div>

        <!-- 🔒 修改密碼表單 -->
        <form @submit.prevent="changePassword" class="profile-form">
            <h2>修改密碼</h2>
            <div>
                <label>舊密碼：</label>
                <input type="password" v-model="oldPassword" required />
            </div>
            <div>
                <label>新密碼：</label>
                <input type="password" v-model="newPassword" required />
            </div>
            <div>
                <label>再次輸入新密碼：</label>
                <input type="password" v-model="confirmPassword" required />
            </div>
            <button type="submit">更新密碼</button>
        </form>

        <div style="padding: 20px 0px 0px 0px;">
            <hr />
        </div>

        <!-- 🔥 刪除帳號表單 -->
        <form @submit.prevent="deleteAccount" class="profile-form">
            <h2 style="color: red">刪除帳號</h2>
            <div>
                <label>請輸入密碼以確認刪除：</label>
                <input type="password" v-model="deletePassword" required />
            </div>
            <div>
                <label>
                    <input type="checkbox" v-model="confirmDelete" /> 我確認要永久刪除帳號
                </label>
            </div>
            <button type="submit" :disabled="!confirmDelete" style="background-color: red;">永久刪除帳號</button>
        </form>

        <!-- 顯示訊息 -->
        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import axios from '@/axios'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()

// 個人資料欄位
const email = ref(user.value?.email || '')
const avatarUrl = ref(user.value?.avatarUrl || '')
const signature = ref(user.value?.signature || '')
const gamesPrivacy = ref(user.value?.gamesPrivacy ?? true)
gamesPrivacy.value = Boolean(gamesPrivacy.value)
const reviewsPrivacy = ref(user.value?.reviewsPrivacy ?? true)
reviewsPrivacy.value = Boolean(reviewsPrivacy.value)

// 密碼變更欄位
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 刪除帳號欄位
const deletePassword = ref('')
const confirmDelete = ref(false)

const message = ref('')

// ✅ 更新個人資料
async function updateProfile() {
    try {
        await axios.put('/user/me', {
            email: email.value,
            avatarUrl: avatarUrl.value,
            signature: signature.value,
            gamesPrivacy: gamesPrivacy.value,
            reviewsPrivacy: reviewsPrivacy.value,
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

// ✅ 刪除帳號（soft delete + 登出）
async function deleteAccount() {
    if (!confirmDelete.value) {
        message.value = '請勾選確認刪除 ✅'
        return
    }
    try {
        await axios.delete('/user/delete', {
            data: { password: deletePassword.value },
        })

        message.value = '帳號已刪除，登出中...'
        auth.logout()
        router.push('/')
    } catch (err) {
        console.error('刪除帳號失敗', err)
        message.value = err.response?.data?.message || '刪除帳號失敗 ❌'
    }
}
</script>

<style scoped>
.profile-view {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius);
    text-shadow: 0 0 6px var(--color-primary);
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.profile-form input,
.profile-form textarea {
    padding: 0.5rem;
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius);
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--color-text);
}

button[type='submit'] {
    padding: 0.5rem 1rem;
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--border-radius);
    color: white;
    cursor: pointer;
    font-weight: bold;
}

button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.message {
    margin-top: 1rem;
    color: yellow;
}
</style>