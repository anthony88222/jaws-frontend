<template>
    <div>
      <h2>分類：{{ categoryName }}</h2>
      <div class="game-grid">
        <GameCard v-for="game in games" :key="game.id" :game="game" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import GameCard from '@/components/GameCard.vue'
  
  const route = useRoute()
  const categoryName = route.params.categoryName
  const games = ref([])
  
  onMounted(async () => {
    const res = await axios.get(`http://localhost:8080/api/games/category/${categoryName}`)
    games.value = res.data
  })
  </script>
  
  <style scoped>
  .game-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);  /* 固定3欄 */
    gap: 1.5rem;
  }
  </style>
  