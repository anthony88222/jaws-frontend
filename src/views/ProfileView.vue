<template>
  <div class="profile-container">
    <div class="profile-header">
      <img :src="user.avatarUrl" alt="User Avatar" class="avatar" />
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

    <div class="profile-actions">
      <button class="btn-neon-sm">個人資訊設定</button>
      <button class="btn-neon-sm">隱私設定</button>
      <button class="btn-neon-sm">錢包餘額 & 加值</button>
      <button class="btn-neon-sm">購買紀錄</button>
      <button class="btn-neon-sm">願望清單</button>
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
          <li v-for="friend in friends" :key="friend.id">
            <img :src="friend.avatarUrl" alt="friend avatar" class="friend-avatar" />
            <span class="friend-name">{{ friend.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = {
  id: 'JAWS2025',
  username: 'CyberShark',
  avatarUrl: 'https://i.pravatar.cc/100?img=12',
  signature: 'Yo！',
  level: 12,
  expPercent: 68,
};

const friends = [
  { id: 1, name: 'Neo', avatarUrl: 'https://i.pravatar.cc/100?img=3' },
  { id: 2, name: 'Trinity', avatarUrl: 'https://i.pravatar.cc/100?img=4' },
  { id: 3, name: 'Morpheus', avatarUrl: 'https://i.pravatar.cc/100?img=5' },
];

const games = [
  { id: 1, name: 'Cyberpunk 2077', cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' },
  { id: 2, name: 'Elden Ring', cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' },
  { id: 3, name: 'Hades', cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg' },
];
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid var(--color-secondary);
  box-shadow: 0 0 10px var(--color-secondary);
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.friend-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a2a;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 8px var(--color-primary);
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.friend-name {
  color: var(--color-text);
  font-size: 0.95rem;
}

.games-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
</style>
