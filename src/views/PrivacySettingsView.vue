<template>
    <h1>隱私設定</h1>
    <form @submit.prevent="savePrivacy">
        <label><input type="checkbox" v-model="gamesPrivacy" /> 隱藏我的遊戲庫</label>
        <label><input type="checkbox" v-model="friendsPrivacy" /> 隱藏我的好友列表</label>
        <button type="submit">儲存</button>
    </form>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
const gamesPrivacy = ref(true)
const friendsPrivacy = ref(true)
onMounted(async () => {
    const { data } = await axios.get('/user/me')
    gamesPrivacy.value = data.data.gamesPrivacy
    friendsPrivacy.value = data.data.friendsPrivacy
})
async function savePrivacy() {
    await axios.put('/user/me/privacy', { gamesPrivacy: gamesPrivacy.value, friendsPrivacy: friendsPrivacy.value })
    // 更新 store 中的 user
    auth.user.gamesPrivacy = gamesPrivacy.value
    auth.user.friendsPrivacy = friendsPrivacy.value
    alert('隱私設定已儲存')
}
</script>

<style scoped></style>