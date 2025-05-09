<template>
  <div class="layout">
    <main class="chat-container">
      <aside class="friend-list">
        <h2 class="title">好友</h2>
        <ul>
          <li class="clickable" @click="navigateTo('/friend')">
            <span class="friend-name">我的好友</span>
          </li>
          <li class="clickable" @click="refreshPage">
            <span class="friend-name">聊天</span>
          </li>
          <li class="clickable" @click="navigateTo('/invite')">
            <span class="friend-name">好友邀請</span>
          </li>
        </ul>
      </aside>

      <aside class="recent-chats">
        <h2 class="title">聊天</h2>
        <ul>
          <li v-for="chat in recentChats" :key="chat.id" class="clickable" @click="selectChat(chat.name)">
            <div class="chat-info">
              <span class="chat-name">{{ chat.name }}</span>
            </div>
          </li>
        </ul>
      </aside>

      <section class="chat-box">
        <div class="chat-messages" ref="messageList">
          <div v-for="msg in messages" :key="msg.id" class="message-wrapper" :class="msg.from">
            <img v-if="msg.from === 'them'" :src="msg.avatar" class="avatar" />
            <div :class="['bubble', msg.from === 'me' ? 'me' : 'them']">
              {{ msg.text }}
            </div>
            <small class="timestamp">{{ msg.time }}</small>
          </div>
        </div>
        <div class="chat-input">
          <div class="input-wrapper">
            <input v-model="newMessage" type="text" placeholder="Type a message..." @keydown.enter="sendMessage" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const recentChats = ref([
  { id: 1, name: '好友名稱 1' },
  { id: 2, name: '好友名稱 2' },
  { id: 3, name: '好友名稱 3' },
])

const DEFAULT_AVATAR = '/logo4.png'

const messages = ref([])
const newMessage = ref('')
const messageList = ref(null)

const router = useRouter()
const route = useRoute()
const senderId = route.query.senderId
const receiverId = route.query.receiverId

let stompClient = null

function refreshPage() {
    window.location.reload()
}

function navigateTo(path) {
    router.push(path)
}

const getHistory = async () => {
  const res = await fetch(`/api/chat/history?senderId=${senderId}&receiverId=${receiverId}`)
  const history = await res.json()
  messages.value = history.map(m => ({
    id: Date.now() + Math.random(),
    from: m.senderId == senderId ? 'me' : 'them',
    avatar: m.senderId == senderId ? null : DEFAULT_AVATAR,
    text: m.message,
    time: formatTime(m.sendAt)
  }))
}

const connect = () => {
  const socket = new SockJS('/ws')
  stompClient = Stomp.over(socket)

  stompClient.connect({}, frame => {
    console.log('Connected: ' + frame)

    const topic = `/topic/private/${receiverId}-${senderId}`

    stompClient.subscribe(topic, msg => {
      const payload = JSON.parse(msg.body)

      messages.value.push({
        id: Date.now(),
        from: payload.senderId == senderId ? 'me' : 'them',
        avatar: payload.senderId == senderId ? null : DEFAULT_AVATAR,
        text: payload.message,
        time: formatTime(payload.sendAt)
      })

      scrollToBottom()
    })

  })
}

const sendMessage = () => {
  if (newMessage.value.trim() && stompClient) {
    stompClient.send('/app/send', {}, JSON.stringify({
      senderId,
      receiverId,
      message: newMessage.value
    }))

    messages.value.push({
      id: Date.now(),
      from: 'me',
      text: newMessage.value,
      time: formatTime(new Date().toISOString())
    })

    newMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

onMounted(async () => {
  await getHistory()
  connect()
  await nextTick()
  scrollToBottom()
})

function selectChat(name) {
  alert(`開啟與 ${name} 的聊天`)
}

function formatTime(isoString) {
  const date = new Date(isoString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

</script>

<style scoped>
.chat-container {
  display: flex;
  height: 90vh;
  margin: 2rem auto;
  width: 60vw;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
  overflow: hidden;
}

.friend-list,
.recent-chats {
  flex-basis: 15%;
  background-color: #111;
  padding: 1rem;
  border-right: 2px solid var(--color-primary);
  overflow-y: auto;
}

.friend-list .title,
.recent-chats .title {
  color: var(--color-secondary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px var(--color-secondary);
  text-align: left;
}

.friend-list ul,
.recent-chats ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.friend-list li,
.recent-chats li {
  padding: 0.5rem 0.75rem;
  color: var(--color-primary);
  border-bottom: 1px solid #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  transition: background 0.2s;
  cursor: pointer;
}

.friend-list li:hover,
.recent-chats li:hover {
  background: #222;
  box-shadow: 0 0 6px var(--color-primary);
}

.friend-name,
.chat-name {
  text-shadow: 0 0 5px var(--color-primary);
  font-size: 1.2rem;
}

.chat-info {
  width: 100%;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #1a1a2a;
  max-height: 82vh;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0rem 0.75rem 0rem 0.25rem;
  min-height: 0;
}

.bubble {
  max-width: 60%;
  padding: 0.8rem 1.2rem;
  border-radius: 1.5rem;
  margin: 0.2rem 0;
  font-size: 1rem;
  color: var(--color-text);
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}

.bubble.them {
  align-self: flex-start;
  background: var(--color-secondary);
  color: #000;
  text-shadow: 0 0 4px #fff;
  box-shadow:
    0 0 5px var(--color-secondary),
    0 0 10px var(--color-secondary);
}

.bubble.me {
  align-self: flex-end;
  background: var(--color-primary);
  color: #000;
  text-shadow: 0 0 4px #fff;
  box-shadow:
    0 0 5px var(--color-primary),
    0 0 10px var(--color-primary);
}

.chat-input {
  margin-top: 1rem;
  border-top: 1px solid var(--color-primary);
  padding-top: 1rem;
  flex-shrink: 0;
}

.input-wrapper {
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
  padding: 0.25rem;
}

.chat-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  outline: none;
  text-shadow: 0 0 1px var(--color-primary);
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}

.message-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.message-wrapper.them {
  flex-direction: row;
}

.message-wrapper.me {
  flex-direction: row-reverse;
}

.timestamp {
  font-size: 0.75rem;
  color: #aaa;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  align-self: flex-end;
}

.message-wrapper.me .timestamp {
  margin-right: 0.25rem;
}

.message-wrapper.them .timestamp {
  margin-left: 0.25rem;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: var(--color-secondary);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 4px var(--color-primary);
}

</style>