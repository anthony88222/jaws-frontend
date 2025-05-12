<template>
  <router-link
    :to="{ name: 'GamePage', params: { gameId: game.id } }"
    class="game-card"
  >
    <img :src="game.coverImageUrl" alt="Game Cover" />
    <h3>{{ game.name }}</h3>
  </router-link>
</template>

<script setup>
defineProps(['game'])
</script>

<style scoped>
.game-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  /* font-family: Arial, Helvetica, sans-serif; ⬅️ 改成一般字型  */
  text-shadow: 0 0 6px rgba(0, 255, 255, 0.4);
}

.game-card:hover h3 {
  color: #00ffff;
  text-shadow: 0 0 12px #00ffff;
  transform: scale(1.05);
}
</style>