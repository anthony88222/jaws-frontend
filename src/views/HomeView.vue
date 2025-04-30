<template>
  <section class="section">
    <hero />
  </section>
  
  <PromotionWall/>
  <section class="section featured-games">
    <h2>熱門遊戲</h2>
    <div class="game-grid">
      <GameCard v-for="(img, index) in gameImages" :key="index" :img="img" />
    </div>
  </section>
  


  <section class="section new-releases">
    <h2>最新上架</h2>
    <div class="game-grid">
      <GameCard v-for="(img, index) in newGameImages" :key="index" :img="img" />
    </div>
  </section>


  <section class="section categories">
    <h2>分類瀏覽</h2>
    <div class="category-grid">
      <div class="category-card">🎮 動作</div>
      <div class="category-card">🧠 策略</div>
      <div class="category-card">🕵️‍♂️ 冒險</div>
      <div class="category-card">👾 獨立製作</div>
    </div>
  </section>

  <section class="section">
    <HotNewReleases />
  </section>
</template>

<script setup>
import Hero from '../components/Hero.vue'
import GameCard from '../components/GameCard.vue'
import HotNewReleases from '../components/HotNewReleases.vue'
import PromotionWall from '../components/PromotionWall.vue'

const gameImages = [
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/aa1c51a9b45c88e770b443d8d3cd28f3024b0760/ss_aa1c51a9b45c88e770b443d8d3cd28f3024b0760.1920x1080.jpg?t=1743471348',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/601150/ss_4410bada2565843dae693b03ac3a50256ff5dd66.1920x1080.jpg?t=1701395090',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2680010/ss_402c7ba6898d27f9d7dcd6ccd79fc6233a09e832.1920x1080.jpg?t=1743150319',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/ss_7be97aa12cfc0e8feccdbb95dac3de71480f2140.600x338.jpg?t=1725652915',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/ss_c1c31d5252307bd9e331f21509c8fd8dc39c2d61.600x338.jpg?t=1743743917',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_ab807f8ad9e968a620777caf483cb6020367b9ee.600x338.jpg?t=1736385712'
]

const newGameImages = [
  'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg',
  'https://cdn.cloudflare.steamstatic.com/steam/apps/2187220/header.jpg',
  'https://cdn.cloudflare.steamstatic.com/steam/apps/2804530/header.jpg',
  'https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg'
]

const recommendedGames = [
  { name: 'Medieval Blacksmith', price: 'NT$ 214.00', discount: '-20%' },
  { name: 'FUBUKI', price: 'NT$ 210.00', discount: '-15%' },
  { name: '商店的寶包', price: 'NT$ 175.00', discount: '-30%' },
  { name: '消滅大陸2', price: 'NT$ 408.00', discount: '' },
  { name: 'Girls Made Pudding', price: 'NT$ 158.00', discount: '-17%' }
]

const previewImage = [
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_ab807f8ad9e968a620777caf483cb6020367b9ee.600x338.jpg?t=1736385712',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_ab807f8ad9e968a620777caf483cb6020367b9ee.600x338.jpg?t=1736385712',
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/ss_ab807f8ad9e968a620777caf483cb6020367b9ee.600x338.jpg?t=1736385712'
]
</script>


<style scoped>
.section {
  margin: 4rem 0;
  text-align: center;
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

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  max-width: var(--max-width);
  margin: 2rem auto;
  padding: 0 var(--container-padding);
}

.category-card {
  background: #1f1f2e;
  padding: 1rem;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--border-radius);
  text-shadow: 0 0 4px var(--color-primary);
  transition: transform var(--transition);
}
.category-card:hover {
  transform: scale(1.05);
  background-color: var(--color-secondary);
  color: #000;
}
.recommendation-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  max-width: var(--max-width);
  margin: 2rem auto;
  padding: 0 var(--container-padding);
}

.game-list {
  flex: 1;
  min-width: 300px;
  list-style: none;
  padding: 0;
  color: var(--color-text);
}

.game-list li {
  background: #1a1a2a;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--color-primary);
  box-shadow: 0 0 5px var(--color-primary);
  transition: var(--transition);
}

.game-list li:hover {
  background: #222;
  transform: translateX(5px);
}

.game-title {
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  color: var(--color-primary);
}

.game-price {
  margin-top: 0.5rem;
  color: var(--color-muted);
}

.discount {
  color: lime;
  font-size: 0.9rem;
}

.game-preview {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-preview img {
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 10px var(--color-primary);
  max-width: 100%;
}

</style>