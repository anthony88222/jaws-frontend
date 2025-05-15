<template>
    <div class="layout">
        <main class="invite-container">

            <!-- 側邊欄 -->
            <aside class="friend-list">
                <h2 class="title">好友</h2>
                <ul>
                    <li class="clickable" @click="navigateTo('/friend')">
                        <span class="friend-name">我的好友</span>
                    </li>
                    <li class="clickable" @click="navigateTo('/chat')">
                        <span class="friend-name">聊天</span>
                    </li>
                    <li class="clickable" @click="refreshPage">
                        <span class="friend-name">好友邀請</span>
                    </li>
                </ul>
            </aside>

            <section class="invite-panel">
                <div class="invite-header-row">
                    <h2 class="title">好友邀請</h2>
                    <div class="invite-search-bar">
                        <input type="text" v-model="inviteUsername" placeholder="輸入使用者名稱..." />
                        <button @click="sendInvite">送出邀請</button>
                    </div>
                </div>

                <div class="invite-block">
                    <h3 class="subtitle">已送出的邀請</h3>
                    <hr class="underline" />
                    <div class="invite-list" :style="{ maxHeight: sentHeight }">
                        <div class="invite-item" v-for="invite in sentInvites" :key="invite.username">
                            <div class="invite-card">
                                <img class="avatar" :src="invite.avatar" />
                                <div class="info-row">
                                    <div class="name">{{ invite.username }}</div>
                                    <div class="date">{{ invite.time }}</div>
                                </div>
                            </div>
                            <button class="delete-btn" @click="confirmDelete(invite, 1)">✕</button>
                        </div>
                    </div>
                </div>

                <div class="invite-block">
                    <h3 class="subtitle">已收到的邀請</h3>
                    <hr class="underline" />
                    <div class="invite-list" :style="{ maxHeight: receivedHeight }">
                        <div class="invite-item" v-for="invite in receivedInvites" :key="invite.username">
                            <div class="invite-card">
                                <img class="avatar" :src="invite.avatar" />
                                <div class="info-row">
                                    <div class="name">{{ invite.username }}</div>
                                    <div class="date">{{ invite.time }}</div>
                                </div>
                            </div>
                            <button class="accept-btn" @click="confirmAccept(invite)">✔</button>
                            <button class="delete-btn" @click="confirmDelete(invite, 2)">✕</button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id || 0)
const inviteUsername = ref('')
const DEFAULT_AVATAR = '/logo4.png'
const router = useRouter()
const sentInvites = ref([])
const receivedInvites = ref([])
const sentHeight = ref('16.5rem')
const receivedHeight = ref('16.5rem')

watchEffect(() => {
    const sentCount = sentInvites.value.length
    const receivedCount = receivedInvites.value.length

    if (sentCount >= 3) {
        sentHeight.value = '16.5rem'
        receivedHeight.value = '16.5rem'
    } else if (sentCount === 2) {
        sentHeight.value = '11rem'
        receivedHeight.value = '22rem'
    } else if (sentCount === 1) {
        sentHeight.value = '5.5rem'
        receivedHeight.value = '27.5rem'
    } else {
        sentHeight.value = '0rem'
        receivedHeight.value = '33rem'
    }

    if (receivedCount >= 3) {
        sentHeight.value = '16.5rem'
        receivedHeight.value = '16.5rem'
    } else if (receivedCount === 2) {
        sentHeight.value = '22rem'
        receivedHeight.value = '11rem'
    } else if (receivedCount === 1) {
        sentHeight.value = '27.5rem'
        receivedHeight.value = '5.5rem'
    } else if (receivedCount === 0) {
        sentHeight.value = '33rem'
        receivedHeight.value = '0rem'
    }
})

function showConfirm(message) {
    return window.confirm(message)
}

function refreshPage() {
    window.location.reload()
}

function navigateTo(path) {
    router.push(path)
}

async function sendInvite() {
  const friendUsername = inviteUsername.value.trim()
  if (!friendUsername) {
    alert('請輸入使用者名稱')
    return
  }

  try {
    const res = await fetch('/api/friend/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId.value,
        friendUsername
      })
    })

    if (!res.ok) {
      const msg = await res.text()
      alert(`送出邀請失敗`)
      return
    }

    alert(`已送出邀請給 ${friendUsername}`)
    inviteUsername.value = ''
    await fetchInvites()

  } catch (err) {
    alert(`發生錯誤`)
  }
}

const fetchInvites = async () => {
    const res = await fetch(`/api/friend/getInvites?userId=${userId.value}`)
    const data = await res.json()

    sentInvites.value = []
    receivedInvites.value = []

    data.forEach(invite => {
        const item = {
            userId: invite.userId,
            friendId: invite.friendId,
            username: invite.username,
            avatar: invite.avatarUrl || DEFAULT_AVATAR,
            time: formatTime(invite.createdAt)
        }

        if (invite.userId === userId.value) {
            sentInvites.value.push(item)
        } else if (invite.friendId === userId.value) {
            receivedInvites.value.push(item)
        }
    })
}

async function confirmDelete(invite, type) {
    const message =
        type === 1
            ? `確定要取消對 ${invite.username} 的邀請嗎？`
            : `確定要拒絕 ${invite.username} 的邀請嗎？`

    const ok = showConfirm(message)
    if (!ok) return

    const res = await fetch('/api/friend/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: invite.userId,
            friendId: invite.friendId
        })
    })

    if (res.ok) {
        sentInvites.value = sentInvites.value.filter(i => i.username !== invite.username)
        receivedInvites.value = receivedInvites.value.filter(i => i.username !== invite.username)
    } else {
        const msg = await res.text()
        alert(`刪除失敗：${msg}`)
    }
}

async function confirmAccept(invite) {
    const ok = window.confirm(`確定要同意 ${invite.username} 的邀請嗎？`)
    if (!ok) return

    const res = await fetch('/api/friend/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: invite.friendId,
            friendId: invite.userId
        })
    })

    if (res.ok) {
        receivedInvites.value = receivedInvites.value.filter(i => i.username !== invite.username)
    } else {
        const msg = await res.text()
        alert(`同意失敗：${msg}`)
    }
}

function formatTime(isoString) {
    const date = new Date(isoString)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

onMounted(fetchInvites)
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.accept-btn {
    position: absolute;
    right: 5rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-primary);
    background: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
    box-shadow: 0 0 6px var(--color-primary);
    background-color: white;
}

.date {
    font-size: 1rem;
    text-shadow: 0 0 5px;
}

.delete-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-secondary);
    background: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;
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
}

.friend-list li {
    padding: 0.5rem 0.75rem;
    color: var(--color-primary);
    border-bottom: 1px solid #222;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
}

.friend-list li:hover {
    background: #222;
    box-shadow: 0 0 6px var(--color-primary);
}

.friend-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.friend-name {
    font-size: 1.2rem;
    text-shadow: 0 0 4px var(--color-primary);
}

.info-row {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.invite-block {
    margin-bottom: 2rem;
}

.invite-card {
    background: #2a2a3a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    box-shadow: 0 0 6px var(--color-primary);
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.invite-container {
    display: flex;
    height: 65vh;
    margin: 2rem auto;
    width: 60vw;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 10px var(--color-primary);
    overflow: hidden;
}

.invite-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.invite-header-row .title {
    margin-bottom: 0;
    flex-shrink: 1;
    max-width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.invite-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.invite-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    padding: 0.5rem 0.75rem 0.5rem 0.25rem;
    min-height: 0;
    max-height: 16.5rem;
    overflow-y: auto;
}

.invite-list::-webkit-scrollbar {
    width: 6px;
}

.invite-list::-webkit-scrollbar-thumb {
    background-color: var(--color-secondary);
    border-radius: 6px;
    background-clip: content-box;
    border: 2px solid transparent;
}

.invite-list::-webkit-scrollbar-track {
    background: transparent;
}

.invite-panel {
    flex: 1;
    padding: 1rem;
    background: #1a1a2a;
    height: 82vh;
    overflow: hidden;
}

.invite-search-bar {
    margin: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
    min-width: 250px;
}

.invite-search-bar button {
    background: #1a1a2a;
    border: 1px solid var(--color-secondary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    color: var(--color-secondary);
    transition: 0.2s;
}

.invite-search-bar button:hover {
    color: #1a1a2a;
    background: var(--color-secondary);
    box-shadow: 0 0 6px var(--color-secondary);
}

.invite-search-bar input {
    padding: 0.5rem 1rem;
    border-radius: 999px;
    border: none;
    background-color: #111;
    color: var(--color-primary);
    font-size: 1rem;
    outline: none;
    width: 15rem;
    box-shadow: inset 0 0 6px var(--color-primary);
}

.layout {
    display: flex;
    flex-direction: column;
    min-height: 90vh;
}

.name {
    font-size: 1rem;
    color: var(--color-primary);
    text-shadow: 0 0 4px var(--color-primary);
}

.subtitle {
    font-size: 1.2rem;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
    text-shadow: 0 0 3px var(--color-primary);
}

.title {
    color: var(--color-secondary);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 8px var(--color-secondary);
    text-align: left;
}

.title.left-align {
    text-align: left;
}

.underline {
    border: none;
    border-top: 2px solid var(--color-secondary);
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 0 5px var(--color-secondary);
    border-radius: 2px;
}

</style>
