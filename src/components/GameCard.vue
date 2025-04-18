<template>
  <div class="game-card">
    <img :src="img" alt="game" />
  </div>
</template>

<script setup>
defineProps(['img'])
</script>
