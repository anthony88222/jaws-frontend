<template>
  <div class="layout">
    <main class="friend-container">

      <aside class="friend-list">
        <h2 class="title">好友</h2>
        <ul>
          <li class="clickable" @click="refreshPage">
            <span class="friend-name">我的好友</span>
          </li>
          <li class="clickable" @click="navigateTo('/chat')">
            <span class="friend-name">聊天</span>
          </li>
          <li class="clickable" @click="navigateTo('/invite')">
            <span class="friend-name">好友邀請</span>
          </li>
        </ul>
      </aside>
      <section class="friends-grid">
        <h2 class="title left-align">我的好友</h2>
        <div class="grid">
          <div v-for="friend in friends" :key="friend.id" class="friend-card">
            <div class="friend-content">
              <img class="avatar" :src="friend.avatar" alt="Avatar" />
              <div class="friend-name center">{{ friend.name }}</div>
              <button class="message-btn" @click="selectChat(friend.name, friend.id)">
                聊天
              </button>
              <div class="friend-date">{{ friend.time }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const friends = ref([])
const DEFAULT_AVATAR = '/logo4.png'
const userId = 1
const router = useRouter()

function refreshPage() {
  window.location.reload()
}

function navigateTo(path) {
  router.push(path)
}

const fetchFriends = async () => {
  try {
    const res = await fetch(`/api/friend/getFriends?userId=${userId}`)
    const data = await res.json()

    friends.value = data.map(f => {
      const isSelfUser = f.userId === userId
      const otherId = isSelfUser ? f.friendId : f.userId

      return {
        id: otherId,
        name: f.username,
        avatar: f.avatarUrl || DEFAULT_AVATAR,
        time: formatTime(f.updatedAt) 
      }
    })
  } catch (err) {
    console.error('取得好友失敗', err)
  }
}

function selectChat(name, receiverId) {
  router.push({
    path: '/chat',
    query: {
      senderId: userId,
      receiverId
    }
  })
}

function formatTime(isoString) {
  const date = new Date(isoString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

onMounted(fetchFriends)
</script>


<style scoped>
.friend-container {
  display: flex;
  height: 65vh;
  margin: 2rem auto;
  width: 60vw;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
}

.friend-list {
  flex-basis: 15%;
  background-color: #111;
  padding: 1rem;
  border-right: 2px solid var(--color-primary);
  overflow-y: auto;
}

.friend-list .title {
  color: var(--color-secondary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px var(--color-secondary);
  text-align: left;
}

.friend-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-list li {
  padding: 0.5rem 0.75rem;
  color: var(--color-primary);
  border-bottom: 1px solid #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
}

.friend-list li:hover {
  background: #222;
  box-shadow: 0 0 6px var(--color-primary);
}

.friend-name {
  text-shadow: 0 0 5px var(--color-primary);
  font-size: 1.2rem;
  text-align: left;
  width: 100%;
}

.friend-name.center {
  padding: 0.5rem;
  text-align: center;
  font-size: 1rem;
  color: var(--color-primary);
  text-shadow: 0 0 4px var(--color-primary);
}

.friends-grid {
  flex: 1;
  padding: 1rem;
  background: #1a1a2a;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.friends-grid .title {
  color: var(--color-secondary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px var(--color-secondary);
  text-align: left;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: flex-start;
}

.friend-card {
  background: #2a2a3a;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 0 10px var(--color-primary);
  width: 170px;
  height: 220px;
}

.friend-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 10px var(--color-primary);
}

.message-btn {
  background: #ff00ff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  transition: 0.2s;
}

.message-btn:hover {
  background: #ff00ff;
  box-shadow: 0 0 6px #ff00ff;
}

.friend-date {
  margin-top: 1rem;
  font-size: 1rem;
  text-shadow: 0 0 5px
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}
</style>
