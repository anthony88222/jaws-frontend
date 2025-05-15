<template>
  <div class="hero-wrapper" @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">
    <button class="nav-btn left" @click="prevSlide">&#8249;</button>

    <!-- 點擊跳轉整塊 -->
    <router-link
      v-if="featuredGames.length > 0"
      :to="`/gamepage/${currentItem.game.id}`"
      class="hero-content"
      @click="scrollToTop"
    >
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
        <h2 class="hero-title">{{ currentItem.game.name }}</h2>

        <div class="hero-tags-area">
          <span
            v-for="tag in categoriesMap[currentItem.game.id] || []"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="hero-desc-area">
          <p class="hero-desc">{{ currentItem.game.description }}</p>
        </div>

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
    </router-link>

    <button class="nav-btn right" @click="nextSlide">&#8250;</button>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

/* --- 資料狀態 --- */
const featuredGames = ref([])
const categoriesMap = ref({})  // 快取每款遊戲的分類

/* --- 輪播控制 --- */
const currentHero = ref(0)
const autoSlideInterval = ref(null)
const currentItem = computed(() => featuredGames.value[currentHero.value] || {})

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

/* --- API 請求 --- */
// 取得促銷遊戲
const fetchPromotions = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/promotions/active')
    featuredGames.value = res.data.flatMap(p => p.promotionGame || [])
  } catch (error) {
    console.error('取得促銷失敗', error)
  }
}

// 取得特定遊戲分類（並快取）
const getCategories = async (gameId) => {
  if (!categoriesMap.value[gameId]) {
    try {
      const res = await axios.get(`http://localhost:8080/api/games/${gameId}/categories`)
      categoriesMap.value[gameId] = res.data.map(c => c.name)
    } catch (err) {
      console.error(`取得遊戲 ${gameId} 的分類失敗`, err)
      categoriesMap.value[gameId] = []
    }
  }
}

/* --- 價格計算 --- */
const getDiscountedPrice = (item) =>
  Math.floor((item.game.price * (100 - item.discountRate)) / 100)

/* --- 掛載後初始化 --- */
onMounted(async () => {
  await fetchPromotions()
  for (const item of featuredGames.value) {
    await getCategories(item.game.id)
  }
  startAutoSlide()
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
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
    max-height: 390px;
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
    font-size: 2.2rem;
    color: var(--color-primary);
    margin-bottom: 0.8rem;
    /* height: 100px; */
    margin-top: 0.2rem;
    text-shadow: 0 0 6px var(--color-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;       /* 限制最多兩行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    font-size: 1rem;
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
    font-size: 1rem;
    line-height: 1.2;
  }
  
  /* 價格 */
  .hero-price-area {
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    scale: 1.2;
    position: relative;
    right: 25px;
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

  a {
    text-decoration: none;
  }
  </style>
  