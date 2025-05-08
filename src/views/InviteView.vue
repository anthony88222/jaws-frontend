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
                <h2 class="title">好友邀請</h2>

                <div class="invite-block">
                    <h3 class="subtitle">已送出的邀請</h3>
                    <hr class="underline" />
                    <div class="invite-list">
                        <div class="invite-item" v-for="invite in sentInvites" :key="invite.username">
                            <img class="avatar" :src="invite.avatar" />
                            <div class="info-row">
                                <div class="name">{{ invite.username }}</div>
                                <div class="date">{{ invite.time }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="invite-block">
                    <h3 class="subtitle">已收到的邀請</h3>
                    <hr class="underline" />
                    <div class="invite-list">
                        <div class="invite-item" v-for="invite in receivedInvites" :key="invite.username">
                            <img class="avatar" :src="invite.avatar" />
                            <div class="info-row">
                                <div class="name">{{ invite.username }}</div>
                                <div class="date">{{ invite.time }}</div>
                            </div>
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

const DEFAULT_AVATAR = '/logo4.png'
const userId = 1
const router = useRouter()
const sentInvites = ref([])
const receivedInvites = ref([])

function refreshPage() {
    window.location.reload()
}

function navigateTo(path) {
    router.push(path)
}

const fetchInvites = async () => {
    const res = await fetch(`/api/friend/getInvites?userId=${userId}`)
    const data = await res.json()

    sentInvites.value = []
    receivedInvites.value = []

    data.forEach(invite => {
        const item = {
            username: invite.username,
            avatar: invite.avatarUrl || DEFAULT_AVATAR,
            time: formatTime(invite.createdAt)
        }

        if (invite.userId === userId) {
            sentInvites.value.push(item)
        } else if (invite.friendId === userId) {
            receivedInvites.value.push(item)
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

onMounted(fetchInvites)
</script>

<style scoped>
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
    cursor: pointer;
    transition: background 0.2s;
}

.friend-list li:hover {
    background: #222;
    box-shadow: 0 0 6px var(--color-primary);
}

.friend-name {
    font-size: 1.2rem;
    text-shadow: 0 0 4px var(--color-primary);
}

.invite-panel {
    flex: 1;
    padding: 1rem;
    background: #1a1a2a;
}

.title.left-align {
    color: var(--color-secondary);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 8px var(--color-secondary);
    text-align: left;
}

.layout {
    display: flex;
    flex-direction: column;
    min-height: 90vh;
}

.title {
    color: var(--color-secondary);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 8px var(--color-secondary);
    text-align: left;
}

.subtitle {
    font-size: 1.2rem;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
    text-shadow: 0 0 3px var(--color-primary);
}

.invite-block {
    margin-bottom: 2rem;
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

.invite-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.invite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2a2a3a;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  box-shadow: 0 0 6px var(--color-primary);
  width: 80%;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  box-shadow: 0 0 6px var(--color-primary);
}

.info-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-size: 1rem;
  color: var(--color-primary);
  text-shadow: 0 0 4px var(--color-primary);
}

.date {
  font-size: 1rem;
  text-shadow: 0 0 5px
}

</style>