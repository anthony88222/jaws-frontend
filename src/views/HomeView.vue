<template>
  <section class="section">
    <hero />
  </section>
  
  <PromotionWall/>

  <section class="section featured-games">
    <h2>熱門遊戲</h2>
    <div class="game-grid">
      <GameCard v-for="game in hotGames" :key="game.id" :game="game" />
    </div>
  </section>
  
  <section class="section category-wrapper">
    <h2>分類瀏覽</h2>
    <div class="category-swiper-container"></div>
    <swiper
      :modules="[Navigation]"
      navigation
      :slides-per-view="4"
      :space-between="20"
      class="category-swiper"
    >
      <swiper-slide v-for="cat in categories" :key="cat.name" class="category-button"  @click="goToCategory(cat.name)">
        <div class="category-card">
          <span>{{ cat.name }}</span>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Hero from '../components/Hero.vue'
import GameCard from '../components/GameCard.vue'
import PromotionWall from '../components/PromotionWall.vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const hotGames = ref([]);
const router = useRouter();
const categories = [
  { name: '角色扮演', emoji: '🧙' },
  { name: '動作', emoji: '🎮' },
  { name: '獨立', emoji: '👾' },
  { name: '策略', emoji: '🧠' },
  { name: '沙盒', emoji: '🏗️' },
  { name: '生存', emoji: '🌿' },
  { name: '恐怖', emoji: '👻' },
  { name: '第一人稱射擊', emoji: '🔫' },
  { name: 'MOBA', emoji: '⚔️' },
  { name: '冒險', emoji: '🧭' }
];

function goToCategory(categoryName) {
  router.push({ name: 'CategoryView', params: { categoryName } })
}


onMounted(async () => {
  const res1 = await axios.get('http://localhost:8080/api/games/hot');
  hotGames.value = res1.data;
});
</script>

<style scoped>
.section {
  margin: 4rem 0;
  text-align: center;
}

.featured-games {
  margin-bottom: 3rem;
}

.sale-banner {
  background: linear-gradient(135deg, #ff00ff33, #00ffff33);
  padding: 3rem 2rem;
  border: 2px dashed var(--color-primary);
  border-radius: var(--border-radius);
  margin: 4rem auto;
  max-width: var(--max-width);
  text-align: center;
}

.banner-content h2 {
  color: var(--color-secondary);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 12px var(--color-secondary);
}

.banner-content p {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.category-wrapper {
  position: relative;
  overflow: visible; /* ✅ 這行非常關鍵！ */
  border: 2px solid var(--color-primary);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0 12px var(--color-primary);
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #0f2027, #2c5364);
}

.category-swiper-container {
  position: relative;
  overflow: visible;
}

.category-swiper {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 3rem;
}

.category-card {
  background: #1f1f2e;
  padding: 1rem;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--border-radius);
  text-shadow: 0 0 4px var(--color-primary);
  text-align: center;
  font-size: 1.1rem;
  transition: transform var(--transition);
}

.category-card:hover {
  transform: scale(1.05);
  background-color: var(--color-secondary);
  color: #000;
}

</style>

<style>
.swiper-button-prev{
  left: -60px;
}

.swiper-button-next {
  background-color: rgba(17, 17, 17, 0.9);
  color: white;
  width: 40px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  border-radius: 4px;
  box-shadow: 0 0 8px cyan;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  right: -60px;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: #00ffff;
  color: black;
  opacity: 1;
}

.swiper-button-prev::after {
  content: '‹';
  font-size: 24px;
}

.swiper-button-next::after {
  content: '›';
  font-size: 24px;
}

.swiper-button-prev {
  left: 0;
}

.swiper-button-next {
  right: 0;
}
</style>