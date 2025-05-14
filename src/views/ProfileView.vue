<template>
  <div class="profile-container">
    <div class="profile-header">
      <img :src="authStore.user.avatarUrl || 'default-avatar2.png'" alt="Avatar" class="avatar"
        @click.stop="goProfile" />
      <div class="user-info">
        <h2 class="username">{{ user.username }}</h2>
        <p class="user-id">ID: {{ user.id }}</p>
        <p class="signature">{{ user.signature }}</p>
        <div class="level-bar">
          <span>Lv. {{ user.level }}</span>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: user.expPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-actions" v-if="isMyProfile">
      <router-link to="/editprofile" class="btn-neon-sm">個人資訊設定</router-link>
      <router-link to="/privacy-settings" class="btn-neon-sm">隱私設定</router-link>
      <router-link to="/wallet" class="btn-neon-sm">錢包餘額 & 加值</router-link>
      <router-link to="/orders" class="btn-neon-sm">購買紀錄</router-link>
      <router-link to="/wishlist" class="btn-neon-sm">願望清單</router-link>
    </div>

    <div class="profile-columns">
      <div class="profile-section">
        <h3 class="section-title">擁有的遊戲</h3>
        <div class="games-grid">
          <div class="game-card" v-for="game in games" :key="game.id">
            <img :src="game.cover" alt="game cover" class="game-cover" />
            <p class="game-title">{{ game.name }}</p>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h3 class="section-title">好友列表</h3>
        <ul class="friend-list">
          <button v-for="friend in friends" :key="friend.id" class="friend-button" @click="goToUserProfile(friend.id)">
            <img :src="friend.avatarUrl" alt="friend avatar" class="friend-avatar" />
            <span class="friend-name">{{ friend.name }}</span>
          </button>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const DEFAULT_AVATAR = 'logo4.png'
const user = ref({})
const games = ref([])
const friends = ref([])

const isMyProfile = computed(() => targetUserId.value === authStore.user?.id)
const targetUserId = computed(() => Number(route.query.userId) || authStore.user?.id || 0)

async function fetchUserProfile(userId) {
  try {
    const res = await fetch(`/api/user/profile/${userId}`, {
      method: 'GET',
      credentials: 'include'
    })
    if (!res.ok) throw new Error('取得使用者資料失敗')
    return await res.json()
  } catch {
    return null
  }
}

async function loadUserProfile() {
  if (!targetUserId.value) return
  const profile = await fetchUserProfile(targetUserId.value)
  if (profile) user.value = profile
}

const fetchFriends = async () => {
  try {
    const res = await fetch(`/api/friend/getFriends?userId=${targetUserId.value}`)
    const data = await res.json()

    friends.value = data.map(f => {
      const isSelfUser = f.userId === targetUserId.value
      const otherId = isSelfUser ? f.friendId : f.userId

      return {
        id: otherId,
        name: f.username,
        avatarUrl: f.avatarUrl || DEFAULT_AVATAR
      }
    })
  } catch (err) {
    console.error('取得好友失敗', err)
  }
}

const goToUserProfile = (userId) => {
  router.push({ path: '/profile', query: { userId } })
}

onMounted(() => {
  watch(
    () => targetUserId.value,
    async () => {
      await loadUserProfile()
      await fetchFriends()
    },
    { immediate: true }
  )
})

</script>

<style scoped>
.avatar {
  width: 120px;
  height: 120px;
  border: 2px solid var(--color-primary, #00a8ff);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-secondary);
  object-fit: cover;
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 168, 255, 0.5);
}

.btn-neon-sm {
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  text-shadow: 0 0 5px var(--color-primary);
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-neon-sm:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 12px var(--color-primary);
}

.exp-bar {
  height: 12px;
  width: 100%;
  background: #222;
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 6px var(--color-primary);
}

.exp-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.4s ease;
}

.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.friend-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  height: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  background: #222;
  border: 1px solid var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.friend-button:hover {
  transform: scale(1.02);
  box-shadow: 0 0 12px var(--color-secondary);
}

.friend-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-height: 25rem;
  overflow-x: hidden;
  padding: 1rem;
  scroll-behavior: smooth;
  overflow-y: visible;
}

.friend-list::-webkit-scrollbar {
  width: 8px;
}

.friend-list::-webkit-scrollbar-track {
  background: transparent;
}

.friend-list::-webkit-scrollbar-thumb {
  background-color: var(--color-secondary);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.friend-name {
  color: var(--color-text);
  font-size: 1rem;
}

.game-card {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #1a1a2a;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: 0.5rem;
  box-shadow: 0 0 8px var(--color-primary);
}

.game-cover {
  width: 80px;
  border-radius: var(--border-radius);
}

.game-title {
  color: var(--color-text);
  font-size: 0.9rem;
  text-shadow: 0 0 4px var(--color-text);
}

.games-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.level-bar {
  margin-top: 0.75rem;
}

.level-bar span {
  display: block;
  font-size: 0.85rem;
  color: var(--color-secondary);
  margin-bottom: 0.2rem;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.profile-columns {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  min-height: 80vh;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.profile-section {
  flex: 1 1 48%;
}

.section-title {
  font-size: 1.4rem;
  color: var(--color-secondary);
  text-shadow: 0 0 5px var(--color-secondary);
  margin-bottom: 1rem;
}

.signature {
  font-size: 0.95rem;
  color: var(--color-muted);
  text-shadow: 0 0 4px var(--color-muted);
}

.user-id {
  font-size: 0.95rem;
  color: var(--color-muted);
  text-shadow: 0 0 4px var(--color-muted);
}

.user-info {
  color: var(--color-text);
  flex: 1;
}

.username {
  font-size: 2rem;
  color: var(--color-primary);
  text-shadow: 0 0 6px var(--color-primary);
}

</style>
