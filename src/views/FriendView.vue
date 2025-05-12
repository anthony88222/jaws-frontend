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
            <button class="delete-btn" @click="confirmRemove(friend)">✕</button>
            <div class="friend-content">
              <img class="avatar" :src="friend.avatar" alt="Avatar" />
              <div class="friend-name center">{{ friend.name }}</div>
              <button class="message-btn" @click="selectChat(friend.id)">
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

function showConfirm(message) {
  return window.confirm(message)
}

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
        userId: f.userId,
        friendId: f.friendId,
        name: f.username,
        avatar: f.avatarUrl || DEFAULT_AVATAR,
        time: formatTime(f.updatedAt) 
      }
    })
  } catch (err) {
    console.error('取得好友失敗', err)
  }
}

async function confirmRemove(friend) {
  const ok = showConfirm(`確定要刪除好友 ${friend.name} 嗎？`)
  if (!ok) return

  const res = await fetch('/api/friend/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: friend.userId,
      friendId: friend.friendId
    })
  })

  if (res.ok) {
    friends.value = friends.value.filter(f => f.id !== friend.id)
  } else {
    const msg = await res.text()
    alert(`刪除失敗：${msg}`)
  }
}

function selectChat(receiverId) {
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

.layout {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}

.friend-container {
  display: flex;
  height: 65vh;
  margin: 2rem auto;
  width: 60vw;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
}

.friends-grid {
  flex: 1;
  padding: 1rem;
  background: #1a1a2a;
  max-height: 82vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: flex-start;
  max-height: 80vh;
  overflow: auto;
  padding: 0.25rem 0.5rem 0rem 0.5rem;
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
  padding: 0.25rem;
  text-align: center;
  font-size: 1rem;
  color: var(--color-primary);
  text-shadow: 0 0 4px var(--color-primary);
}

.friends-grid .title {
  color: var(--color-secondary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px var(--color-secondary);
  text-align: left;
}

.friend-date {
  margin-top: 0.75rem;
  font-size: 1rem;
  text-shadow: 0 0 5px;
}

.friend-card {
  background: #2a2a3a;
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  box-shadow: 0 0 10px var(--color-primary);
  width: 165px;
  height: 205px;
  position: relative;
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
  background: #1a1a2a;
  border: 1px solid var(--color-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: var(--color-secondary);
  transition: 0.2s;
}

.message-btn:hover {
  color: #1a1a2a;
  background: var(--color-secondary);
  box-shadow: 0 0 6px var(--color-secondary);
}

.delete-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1;
  text-shadow: 0 0 5px var(--color-secondary);
}

.grid::-webkit-scrollbar {
  width: 8px;
}

.grid::-webkit-scrollbar-track {
  background: transparent;
}

.grid::-webkit-scrollbar-thumb {
  background-color: var(--color-secondary);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

</style>
