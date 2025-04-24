<template>
  <div class="layout">
    <main class="chat-container">
      <!-- 左側好友選單 -->
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

      <!-- 右側好友卡片區 -->
      <section class="friends-grid">
        <h2 class="title left-align">我的好友</h2>
        <div class="grid">
          <div
            v-for="friend in friends"
            :key="friend.id"
            class="friend-card"
          >
            <div class="friend-content">
              <img class="avatar" :src="friend.avatar" alt="Avatar" />
              <div class="friend-name center">{{ friend.name }}</div>
              <button class="message-btn" @click="selectChat(friend.name)">
                聊天
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const friends = ref([
  { id: 1, name: '好友名稱 1', avatar: '/friend1.png' },
  { id: 2, name: '好友名稱 2', avatar: '/friend2.png' },
  { id: 3, name: '好友名稱 3', avatar: '/friend3.png' },
  { id: 4, name: '好友名稱 4', avatar: '/friend4.png' },
  { id: 5, name: '好友名稱 5', avatar: '/friend5.png' },
  { id: 6, name: '好友名稱 6', avatar: '/friend6.png' }
])

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
  height: 70vh;
  margin: 2rem auto;
  width: 60vw;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
}

.friend-list {
  width: 20%;
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
  text-shadow: 0 0 4px var(--color-primary);
  font-size: 1rem;
  text-align: left;
  width: 100%;
}

.friend-name.center {
  text-align: center;
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
  width: 180px;
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
  padding: 0.4rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  color: #000;
  transition: 0.2s;
}

.message-btn:hover {
  background: #ff00ff;
  box-shadow: 0 0 6px #ff00ff;
}
</style>
