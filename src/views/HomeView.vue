<template>
  <section class="section">
    <hero />
  </section>
  
  <PromotionWall/>

  <section class="section featured-games">
    <h2>熱門遊戲</h2>
    <div class="game-grid">
      <GameCard v-for="game in hotGames.slice(0,9)" :key="game.id" :game="game" />
    </div>
  </section>
  
  <section class="section category-wrapper">
    <h2>分類瀏覽</h2>

    <div class="category-swiper-container">
      <!-- 左箭頭 -->
      <div class="swiper-button-prev custom-swiper-button"></div>

      <!--主要分類滑動區塊-->
    <swiper
      :modules="[Navigation]"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }"
      :slides-per-view="4"
      :space-between="20"
      class="category-swiper"
    >
      <swiper-slide v-for="cat in categories" :key="cat.name" class="category-button"  @click="goToCategory(cat.name)">
        <div class="category-card">
    <div
      class="category-image"
      :style="{ backgroundImage: `url(${cat.bg})` }"
    ></div>
    <div class="category-text">{{ cat.name }}</div>
  </div>
      </swiper-slide>
    </swiper>
    <!-- 右箭頭 -->
    <div class="swiper-button-next custom-swiper-button"></div>
    </div>
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
  { name: '角色扮演', bg:'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg' },
  { name: '動作', bg:'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg' },
  { name: '獨立', bg:'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg' },
  { name: '策略', bg:'https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg' },
  { name: '沙盒', bg:'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg' },
  { name: '生存', bg:'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg' },
  { name: '恐怖', bg:'https://cdn.akamai.steamstatic.com/steam/apps/304430/header.jpg' },
  { name: '第一人稱射擊', bg:'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg' },
  { name: 'MOBA', bg:'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg' },
  { name: '冒險', bg:'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg' }
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
  padding: 1rem 3rem;
}

.category-card {
  width: 220px;
  border: 2px solid var(--color-primary);
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: #1f1f2e;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px var(--color-secondary);
}

.category-card .overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.4));
}

.category-image {
  height: 120px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.category-text {
  padding: 0.75rem 0;
  font-size: 1.1rem;
  color: var(--color-primary);
  text-align: center;
  background-color: #1f1f2e;
  text-shadow: 0 0 4px var(--color-primary);
  font-weight: bold;
}
</style>

<style>

.custom-swiper-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  color: #00ffff;
  font-size: 2rem;
  width: 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 10px cyan;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.swiper-button-prev{
  left: 0;
}

.swiper-button-next {
  right: 0;
}



.swiper-button-prev::after {
  content: '‹';
}

.swiper-button-next::after {
  content: '›';
}


</style>