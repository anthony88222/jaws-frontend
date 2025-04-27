<template>
    <div class="hero-wrapper" @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">
      <button class="nav-btn left" @click="prevSlide">&#8249;</button>
  
      <div class="hero-content" v-if="featuredGames.length > 0">
        <!-- 左邊封面圖 -->
        <div class="hero-left">
          <img
            :src="currentItem.game.coverImageUrl"
            alt="game cover"
            class="hero-img"
          />
        </div>
  
        <!-- 右邊資訊 -->
        <div class="hero-right">
          <!-- 遊戲名稱 -->
          <h2 class="hero-title">{{ currentItem.game.name }}</h2>
  
          <!-- 標籤 -->
          <div class="hero-tags-area">
            <span
              v-for="tag in getTags(currentItem.game.id)"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
  
          <!-- 描述 -->
          <div class="hero-desc-area">
            <p class="hero-desc">{{ currentItem.game.description }}</p>
          </div>
  
          <!-- 價格 -->
          <div class="hero-price-area">
            <div class="price-box-bottom">
              <div class="discount-tag">-{{ currentItem.discountRate }}%</div>
              <div class="price-text">
                <div class="original-price">NT$ {{ currentItem.game.price }}</div>
                <div class="final-price">
                  NT$ {{ getDiscountedPrice(currentItem) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <button class="nav-btn right" @click="nextSlide">&#8250;</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  
  /* --- API資料 --- */
  const featuredGames = ref([])
  
  const fetchPromotions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/promotions/active')
      // 把所有 promotionGame 拉平
      featuredGames.value = res.data.flatMap(p => p.promotionGame || [])
    } catch (error) {
      console.error('取得促銷失敗', error)
    }
  }
  
  /* --- 輪播控制 --- */
  const currentHero = ref(0)
  const autoSlideInterval = ref(null)
  
  const currentItem = computed(() => featuredGames.value[currentHero.value])
  
  const nextSlide = () => {
    currentHero.value = (currentHero.value + 1) % featuredGames.value.length
  }
  const prevSlide = () => {
    currentHero.value =
      (currentHero.value - 1 + featuredGames.value.length) % featuredGames.value.length
  }
  
  const startAutoSlide = () => {
    autoSlideInterval.value = setInterval(nextSlide, 10000)
  }
  const stopAutoSlide = () => clearInterval(autoSlideInterval.value)
  
  /* --- 假標籤資料 --- */
  const getTags = (gameId) => {
    const all = ['動作', '冒險', '角色扮演', '合作', '多人', '日系', '射擊', '策略', '模擬']
    return all.slice(0, (gameId % 3) + 2)
  }
  
  const getDiscountedPrice = (item) =>
    Math.floor((item.game.price * (100 - item.discountRate)) / 100)
  
  onMounted(() => {
    fetchPromotions()
    startAutoSlide()
  })
  </script>
  
  <style scoped>
  /* === 外層容器 === */
  .hero-wrapper {
    width: 100%;
    position: relative;
    margin: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 卡片 */
  .hero-content {
    width: 1200px;
    display: flex;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    overflow: hidden;
    background: #1a1a2a;
    box-shadow: 0 0 10px var(--color-primary);
  }
  
  /* 左：封面圖 */
  .hero-left {
    flex: 0 0 70%;
    background: #1a1a2a;
  }
  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 右：資訊欄 */
  .hero-right {
    flex: 0 0 27%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  /* 遊戲名稱 */
  .hero-title {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: 0.8rem;
    height: 100px;
    margin-top: 0.2rem;
    text-shadow: 0 0 6px var(--color-primary);
  }
  
  /* tag */
  .hero-tags-area {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    max-height: 72px;
    overflow: auto;
    margin-bottom: 0.6rem;
  }
  .tag {
    /* background: #1f1f2e; */
    border: 1px solid rgb(218, 208, 208);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.72rem;
    color: rgb(218, 208, 208);
    white-space: nowrap;
  }
  
  /* 描述 */
  .hero-desc-area {
    flex: 1;
    overflow: auto;
    margin-bottom: 1rem;
  }
  .hero-desc {
    color: var(--color-text);
    font-size: 0.9rem;
    line-height: 1.2;
  }
  
  /* 價格 */
  .hero-price-area {
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
  .price-box-bottom {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .discount-tag {
    background: #4a772f;
    color: #bfff00;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-weight: bold;
  }
  .price-text {
    text-align: left;
  }
  .original-price {
    text-decoration: line-through;
    color: #bbb;
    font-size: 0.8rem;
  }
  .final-price {
    color: #bfff00;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 0 0 6px #bfff00;
  }
  
  /* 左右箭頭 */
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3rem;
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    user-select: none;
  }
  .nav-btn.left  { left: -3.2rem; }
  .nav-btn.right { right: -3.2rem; }
  </style>
  