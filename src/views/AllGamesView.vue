<template>
    <section class="all-games-container">
      <h2 class="section-title">所有遊戲</h2>
      <div v-if="games.length === 0" class="empty-placeholder">
      正在載入所有遊戲...
      </div>
      <div class="game-grid">
        <router-link
          v-for="game in games"
          :key="game.id"
          :to="{ name: 'GamePage', params: { gameId: game.id } }"
          class="game-card"
        >
          <img :src="game.coverImageUrl" :alt="game.name" />
          <h3>{{ game.name }}</h3>
        </router-link>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const games = ref([]);
  
  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/games/game');
      games.value = res.data;
    } catch (err) {
      console.error('取得所有遊戲失敗', err);
    }
  });
  </script>
  
  <style scoped>

  .empty-placeholder {
    min-height: 800px;
    text-align: center;
    color: white;
    font-size: 1.5rem;
    padding: 4rem 0;
  }
  .all-games-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-shadow: 0 0 6px var(--color-primary);
  }
  
  .game-grid {
    display: grid;
    grid-template-columns: repeat(3,ifr);
    gap: 1.5rem;
    justify-items: center;
  }
  
  .game-card {
    border: 2px solid var(--color-primary);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 0 10px var(--color-primary);
    transition: transform 0.3s ease;
    background: #1f1f2e;
    text-decoration: none;
    color: white;
    text-align: center;
  }
  
  .game-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 16px var(--color-secondary);
  }
  
  .game-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .game-card h3 {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
  </style>
  