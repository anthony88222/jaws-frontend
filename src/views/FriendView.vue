<template>
    <div class="layout">
  
      <main class="chat-container">
        <!-- 左側好友列表 -->
        <aside class="friend-list">
          <h2 class="title">FRIENDS</h2>
          <ul>
            <li
              v-for="friend in friends"
              :key="friend.id"
              :class="{ online: friend.online }"
              class="clickable"
              @click="selectChat(friend.name)"
            >
              <span class="status-dot"></span>
              <span class="friend-name">{{ friend.name }}</span>
            </li>
          </ul>
        </aside>
  
        <!-- 中間近期聊天紀錄 -->
        <aside class="recent-chats">
          <h2 class="title">RECENT CHATS</h2>
          <ul>
            <li
              v-for="chat in recentChats"
              :key="chat.id"
              class="clickable"
              @click="selectChat(chat.name)"
            >
              <div class="chat-info">
                <span class="chat-name">{{ chat.name }}</span>
                <span class="chat-snippet">{{ chat.snippet }}</span>
              </div>
              <span class="chat-time">{{ chat.time }}</span>
            </li>
          </ul>
        </aside>
  
        <!-- 右側聊天視窗 -->
        <section class="chat-box">
          <div class="chat-messages">
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="['bubble', msg.from === 'me' ? 'me' : 'them']"
            >
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              @keydown.enter="sendMessage"
            />
          </div>
        </section>
      </main>
  
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { ref } from 'vue';
  
  const friends = ref([
    { id: 1, name: 'PLAYER456', online: true },
    { id: 2, name: 'COOLGUY', online: true },
    { id: 3, name: 'GAMERXD', online: true },
    { id: 4, name: 'FRIEND01', online: false },
    { id: 5, name: 'HELLO123', online: false },
  ]);
  
  const recentChats = ref([
    { id: 1, name: 'Jimmy', snippet: 'hi!', time: '12:50' },
    { id: 2, name: 'Mike', snippet: 'Mike傳送了圖片', time: '16:39' },
    { id: 3, name: 'John', snippet: 'yo', time: '18:12' },
  ]);
  
  const messages = ref([
    { id: 1, from: 'them', text: 'Hello!' },
    { id: 2, from: 'them', text: 'How are you?' },
    { id: 3, from: 'me', text: "I'm doing well, thanks!" },
    { id: 4, from: 'them', text: "That's good to hear." }
  ]);
  
  const newMessage = ref('');
  
  function sendMessage() {
    if (newMessage.value.trim()) {
      messages.value.push({ id: Date.now(), from: 'me', text: newMessage.value });
      newMessage.value = '';
    }
  }
  
  function selectChat(name) {
    alert(`開啟與 ${name} 的聊天`);
  }
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    height: 70vh;
    margin: 2rem auto;
    width: 60vw;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 10px var(--color-primary);
  }
  
  .friend-list, .recent-chats {
    width: 20%;
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
    text-align: center;
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
  
  .friend-list li.online .status-dot {
    background: #00ff80;
  }
  
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: gray;
  }
  
  .friend-name,
  .chat-name {
    text-shadow: 0 0 4px var(--color-primary);
  }
  
  .chat-snippet {
    font-size: 0.75rem;
    color: var(--color-muted);
    display: block;
  }
  
  .chat-time {
    font-size: 0.7rem;
    color: var(--color-muted);
  }
  
  .chat-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    background: #1a1a2a;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bubble {
    max-width: 60%;
    padding: 0.6rem 1rem;
    border-radius: 1rem;
    font-size: 0.95rem;
    color: var(--color-text);
  }
  
  .bubble.them {
    align-self: flex-start;
    background: var(--color-secondary);
    color: #000;
    text-shadow: none;
  }
  
  .bubble.me {
    align-self: flex-end;
    background: var(--color-primary);
    color: #000;
    text-shadow: none;
  }
  
  .chat-input {
    margin-top: 1rem;
    border-top: 1px solid var(--color-primary);
    padding-top: 1rem;
  }
  
  .chat-input input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid var(--color-primary);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-family);
    border-radius: var(--border-radius);
    outline: none;
    text-shadow: 0 0 4px var(--color-primary);
  }
  </style>
  