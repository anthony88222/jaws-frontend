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
