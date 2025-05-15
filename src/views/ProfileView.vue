<template>

<!--  -->
<!-- 因為可能會查詢好友的所有資料用 user.   如我確定是要登入者的資訊才用auth.user by anthony-->
<!--  -->
  <div class="profile-container">
      <div class="profile-header">
          <img :src="user.avatarUrl || defaultAvatarUrl" alt="Avatar" class="avatar" @click.stop="goProfile" />
          <div class="user-info">
              <h2 class="username">{{ user.username }}</h2>
              <p class="user-id">ID：{{ user.id }}</p>
              <p class="signature">個人簽名：{{ user.signature }}</p>
              <div class="level-bar">
                  <span>Lv. {{ user.level ?? 0 }}</span>
                  <div class="exp-bar">
                      <div class="exp-fill" :style="{ width: (user.expPercent || 0) + '%' }"></div>
                      <span class="exp-text">
                          {{ user.currentExp || 0 }} / {{ user.expPerLevel || 1000 }} EXP
                      </span>
                  </div>
              </div>
          </div>
      </div>

      <div class="profile-actions" v-if="isMyProfile">
          <router-link to="/profile/edit" class="btn-neon-sm">個人資訊設定</router-link>
          <router-link to="/privacy-settings" class="btn-neon-sm">隱私設定</router-link>
          <router-link to="/wallet" class="btn-neon-sm">錢包加值</router-link>
          <router-link to="/order-history" class="btn-neon-sm">歷史訂單</router-link>
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
                  <button v-for="friend in friends" :key="friend.id" class="friend-button"
                      @click="goToUserProfile(friend.id)">
                      <img :src="friend.avatarUrl" alt="friend avatar" class="friend-avatar" />
                      <span class="friend-name">{{ friend.name }}</span>
                  </button>
              </ul>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const defaultAvatarUrl = '/default-avatar2.png'
const user = ref({})
const games = ref([])
const friends = ref([])

const isMyProfile = computed(() => targetUserId.value === auth.user?.id)
const targetUserId = computed(() => Number(route.query.userId) || auth.user?.id || 0)



async function fetchUserProfile(userId) {
  try {
    const res = await axios.get(`/user/profile/${userId}`)
    return res.data
  } catch {
    return null
  }
}

let isFetchingFriends = false
const fetchFriends = async (userId) => {
  if (isFetchingFriends) return
  isFetchingFriends = true
  try {
    const res = await fetch(`/api/friend/getFriends?userId=${userId}`)
    const data = await res.json()

    friends.value = data.map(f => {
      const isSelfUser = f.userId === userId
      const otherId = isSelfUser ? f.friendId : f.userId

      return {
        id: otherId,
        name: f.username,
        avatarUrl: f.avatarUrl || defaultAvatarUrl
      }
    })
  } catch (err) {
    console.error('取得好友失敗', err)
  } finally {
    isFetchingFriends = false
  }
}

// ✅ 統一使用公開 API 載入遊戲
const fetchUserGames = async (userId) => {
  try {
    const res = await axios.get(`/Library/public/${userId}`)
    games.value = res.data.map(game => ({
      id: game.gameId,
      name: game.gameName,
      cover: game.coverImageUrl || '/placeholder.png'
    }))
  } catch (err) {
    console.error('載入使用者遊戲庫失敗', err)
    games.value = []
  }
}

const goToUserProfile = (userId) => {
  router.push({ path: '/profile', query: { userId } })
}

onMounted(async () => {
  if (!targetUserId.value) return

  try {
    const profile = await fetchUserProfile(targetUserId.value)
    if (profile) {
      user.value = profile
      if (isMyProfile.value) {
        auth.user = profile // ✅ 同步給 Header 用（包含 wallet）
      }
    }

    await fetchUserGames(targetUserId.value)
    await fetchFriends(targetUserId.value)

  } catch (error) {
    console.error('載入使用者資料失敗', error)
  }
})
</script>



<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 168, 255, 0.5);
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

.user-id,
.signature {
  font-size: 0.95rem;
  color: var(--color-muted);
  text-shadow: 0 0 4px var(--color-muted);
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

.exp-bar {
  position: relative;
  height: 16px;
  width: 100%;
  background: #222;
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 6px var(--color-primary);
}


/* 負責顯示填滿的漸層條 */
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #38f38f);
  animation: fill-glow 2s infinite alternate;
  transition: width 0.4s ease-in-out;
}

/* 文字永遠置中在整個 exp-bar 上面 */
.exp-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 2px black;
  pointer-events: none;
  /* 避免遮住 hover 等事件 */
  z-index: 1;
}

@keyframes fill-glow {
  0% {
      box-shadow: 0 0 6px var(--color-primary);
  }

  100% {
      box-shadow: 0 0 12px #38f38f;
  }
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
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

.profile-columns {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.games-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-height: 25rem;
  overflow-y: auto;
  padding: 1rem;
  scroll-behavior: smooth;
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


/* 以下anthony */
.profile-section {
  flex: 1 1 48%;
}

.section-title {
  font-size: 1.4rem;
  color: var(--color-secondary);
  text-shadow: 0 0 5px var(--color-secondary);
  margin-bottom: 1rem;
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

.friend-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.friend-name {
  color: var(--color-text);
  font-size: 1rem;
}

</style>