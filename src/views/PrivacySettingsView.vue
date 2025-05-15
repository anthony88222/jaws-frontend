<template>
    <div class="privacy-view container">
        <h1 class="privacy-title">隱私設定</h1>
        <div class="privacy-section">
            <h2 class="section-title">隱私選項</h2>
            <form @submit.prevent="savePrivacy" class="privacy-form">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="gamesPrivacy" />
                        <span>隱藏我的遊戲庫</span>
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="reviewsPrivacy" />
                        <span>隱藏我的評論</span>
                    </label>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn-save">儲存隱私設定</button>
                </div>
            </form>
        </div>

        <div class="divider"></div>

        <div class="danger-section">
            <h2 class="danger-title">刪除帳號</h2>
            <form @submit.prevent="deleteAccount" class="delete-form">
                <div class="form-group">
                    <label>請輸入密碼以確認刪除</label>
                    <input type="password" v-model="deletePassword" required class="form-input" />
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="confirmDelete" />
                        <span>我確認要永久刪除帳號</span>
                    </label>
                </div>

                <div class="form-group">
                    <button type="submit" :disabled="!confirmDelete" class="btn-delete">永久刪除帳號</button>
                </div>
            </form>
        </div>

        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()

// 隱私設定欄位
const gamesPrivacy = ref(true)
const reviewsPrivacy = ref(true)

// 刪除帳號欄位
const deletePassword = ref('')
const confirmDelete = ref(false)

const message = ref('')

onMounted(async () => {
    try {
        const { data } = await axios.get('/user/me')
        // 順便更新 Pinia 的 user（如果你要補強這一段的話）
        auth.user = data.data

        // 更新本地欄位（其實這段可被上面的 watch 處理掉，但保險起見也寫上）
        gamesPrivacy.value = data.data.gamesPrivacy ?? true
        reviewsPrivacy.value = data.data.reviewsPrivacy ?? true
    } catch (err) {
        console.error('獲取隱私設定失敗', err)
        message.value = '獲取隱私設定失敗，請稍後再試 ❌'
    }
})

async function savePrivacy() {
    try {
        await axios.put('/user/me', {
            gamesPrivacy: gamesPrivacy.value,
            reviewsPrivacy: reviewsPrivacy.value
        })

        // 更新 Pinia store 裡的 user 資料
        auth.user.gamesPrivacy = gamesPrivacy.value
        auth.user.reviewsPrivacy = reviewsPrivacy.value

        message.value = '隱私設定已儲存 ✅'
    } catch (err) {
        console.error('儲存隱私設定失敗', err)
        message.value = '儲存隱私設定失敗，請稍後再試 ❌'
    }
}


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
*,
*::before,
*::after {
    box-sizing: border-box;
}

.privacy-view {
    padding: 2rem;
    background: #1a1a2a;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    max-width: 1000px;
    margin: 2rem auto;
    box-shadow: 0 0 20px var(--color-primary);
}

.privacy-title {
    color: #00ffff;
    text-align: center;
}

.section-title {
    margin-bottom: 1.5rem;
    color: var(--color-primary);

}

.privacy-section {
    margin-bottom: 2rem;
    padding: 30px 0;
    /* 增加上下間隔 */
}

.danger-section {
    margin-top: 2rem;
    padding: 30px 20px;
    /* 增加上下和左右間隔 */
    border: 1px solid #ff3b30;
    border-radius: var(--border-radius);
}

.danger-title {
    color: #ff3b30;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-label span {
    margin-left: 0.5rem;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--color-primary);
    border-radius: var(--border-radius);
    color: #ffffff;
    margin-top: 0.5rem;
}

.btn-save {
    padding: 0.75rem 1.5rem;
    background-color: #00ffff;
    border: none;
    border-radius: var(--border-radius);
    color: #1a1a2a;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
}

.btn-delete {
    padding: 0.75rem 1.5rem;
    background-color: #ff3b30;
    border: none;
    border-radius: var(--border-radius);
    color: white;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
}

.btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.divider {
    height: 1px;
    background-color: var(--color-primary);
    margin: 2rem 0;
    opacity: 0.5;
}

.message {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    text-align: center;
    color: yellow;
}
</style>
