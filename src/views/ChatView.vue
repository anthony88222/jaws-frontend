<template>
  <div class="layout">
    <main class="chat-container">
      <aside class="friend-list">
        <h2 class="title">好友</h2>
        <ul>
          <li class="clickable" @click="navigateTo('我的好友')">
            <span class="friend-name">我的好友</span>
          </li>
          <li class="clickable" @click="navigateTo('訊息')">
            <span class="friend-name">聊天</span>
          </li>
          <li class="clickable" @click="navigateTo('新增好友')">
            <span class="friend-name">新增好友</span>
          </li>
          <li class="clickable" @click="navigateTo('好友邀請')">
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
          <div v-for="msg in messages" :key="msg.id" :class="['bubble', msg.from === 'me' ? 'me' : 'them']">
            {{ msg.text }}
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
import { useRoute } from 'vue-router'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const recentChats = ref([
  { id: 1, name: '好友名稱 1' },
  { id: 2, name: '好友名稱 2' },
  { id: 3, name: '好友名稱 3' },
])

const messages = ref([])
const newMessage = ref('')
const messageList = ref(null)

const route = useRoute()
const senderId = route.query.senderId
const receiverId = route.query.receiverId

let stompClient = null

const connect = () => {
  const socket = new SockJS('/ws')
  stompClient = Stomp.over(socket)

  stompClient.connect({}, frame => {
    console.log('Connected: ' + frame)

    const topic = `/topic/private/${receiverId}-${senderId}`
    stompClient.subscribe(topic, msg => {
      messages.value.push({ id: Date.now(), from: 'them', text: msg.body })
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
    messages.value.push({ id: Date.now(), from: 'me', text: newMessage.value })
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

onMounted(() => {
  connect()
})

function selectChat(name) {
  alert(`開啟與 ${name} 的聊天`)
}

function navigateTo(section) {
  alert(`前往：${section}`)
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
  flex-basis:15%;
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
  text-shadow: 0 0 4px var(--color-primary);
  font-size: 1rem;
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
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;  min-height: 0;
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
    0 0 10px var(--color-secondary),
    0 0 15px var(--color-secondary);
}

.bubble.me {
  align-self: flex-end;
  background: var(--color-primary);
  color: #000;
  text-shadow: 0 0 4px #fff;
  box-shadow:
    0 0 5px var(--color-primary),
    0 0 10px var(--color-primary),
    0 0 15px var(--color-primary);
}


.chat-input {
  margin-top: 1rem;
  border-top: 1px solid var(--color-primary);
  padding-top: 1rem;
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

</style>