<!-- PromotionView.vue -->
<template>
  <section class="promotion-view">
    <h1>特別優惠</h1>
    <PromotionHero :featuredPromotions="featuredPromotions" />

    <!-- 類別篩選 -->
    <div class="category-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="{ active: selectedCategory === cat }"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 促銷遊戲展示區 -->
    <div class="promotion-grid">
      <div
        v-for="(row, rowIndex) in groupedPromotions"
        :key="rowIndex"
        class="promotion-row"
        :style="{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }"
      >
        <router-link
          v-for="item in row"
          :key="item.game.id"
          :to="`/gamepage/${item.game.id}`"
          class="promo-card"
        >
          <div class="card-img">
            <img :src="item.game.coverImageUrl" :alt="item.game.name" />
            <div class="hover-info">
              <h3>{{ item.game.name }}</h3>
              <p>{{ item.game.description }}</p>
            </div>
          </div>

          <div class="price-box-bottom">
            <!-- 有折扣才顯示 -->
            <div v-if="item.discountRate > 0" class="discount-tag">-{{ item.discountRate }}%</div>
            <div class="price-text">
              <div v-if="item.discountRate > 0" class="original-price">NT$ {{ item.game.price }}</div>
              <div class="final-price">NT$ {{ getDiscountedPrice(item) }}</div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <section class="section">
      <HotNewReleases />
    </section>
  </section>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import PromotionHero from '../components/PromotionHero.vue'

const promotions = ref([])
const featuredPromotions = ref([])
const currentHero = ref(0)
const autoSlideInterval = ref(null)
const selectedCategory = ref('全部')

const categories = [
  '全部',
  '角色扮演', '動作',  '策略', '生存', '恐怖', '第一人稱射擊',  '冒險'
]

// 快取每款遊戲的分類
const categoryMap = ref({})

// 取得促銷資料與分類
const fetchPromotions = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/promotions/active')
    const allGames = res.data.flatMap(p => p.promotionGame || [])
    promotions.value = allGames
    featuredPromotions.value = allGames.slice(0, 10)

    // 抓取每款遊戲的分類
    await Promise.all(allGames.map(async item => {
      const gameId = item.game.id
      if (!categoryMap.value[gameId]) {
        try {
          const catRes = await axios.get(`http://localhost:8080/api/games/${gameId}/categories`)
          categoryMap.value[gameId] = catRes.data.map(c => c.name)
        } catch (err) {
          console.error(`取得 gameId=${gameId} 分類失敗`, err)
          categoryMap.value[gameId] = []
        }
      }
    }))
  } catch (e) {
    console.error('取得促銷失敗', e)
  }
}

// 顯示選中分類的遊戲
const filteredPromotions = computed(() => {
  if (selectedCategory.value === '全部') return promotions.value
  return promotions.value.filter(item => {
    const gameId = item.game.id
    const cats = categoryMap.value[gameId] || []
    return cats.includes(selectedCategory.value)
  })
})

// 固定排版樣式：2,3,4,3,2,4
const layoutPattern = [2, 3, 4, 3, 2, 4]
const groupedPromotions = computed(() => {
  const result = []
  let i = 0
  let index = 0
  while (index < filteredPromotions.value.length && i < layoutPattern.length) {
    const count = layoutPattern[i]
    result.push(filteredPromotions.value.slice(index, index + count))
    index += count
    i++
  }
  return result
})

// 折扣後價格
const getDiscountedPrice = (item) =>
  Math.floor(item.game.price * (100 - item.discountRate) / 100)

// Hero 輪播控制（如有需求）
const nextSlide = () => {
  currentHero.value = (currentHero.value + 1) % featuredPromotions.value.length
}
const prevSlide = () =>
  currentHero.value = (currentHero.value - 1 + featuredPromotions.value.length) % featuredPromotions.value.length

const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(nextSlide, 10000)
}
const stopAutoSlide = () => {
  clearInterval(autoSlideInterval.value)
}

onMounted(() => {
  fetchPromotions()
  startAutoSlide()
})
</script>
  
  <style scoped>
  /* 整個 promotion 頁面 */
  a {
    text-decoration: none;
    color: white;
  }
  .promotion-view {
    background: var(--color-bg);
    padding-bottom: 4rem;
  }

  h1 {
    font-size: 5rem;
    text-align: center;
    margin: 1rem;
    color: white;
    text-shadow: 0 0 6px var(--color-primary);
    font-weight: bold;
  }

  /* Hero 輪播區 */
  
  



  
  /* 分類列 */
  .category-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    margin-top: 4rem;
  }
  .category-bar button {
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.4rem 1.2rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    text-shadow: 0 0 6px var(--color-primary);
    transition: all 0.3s;
  }
  .category-bar button.active,
  .category-bar button:hover {
    background: var(--color-primary);
    color: black;
    box-shadow: 0 0 10px var(--color-primary);
  }
  
  /* 促銷列表區 */
  .promotion-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0 2rem;
    width: 1150px;
    margin-left: auto;
    margin-right: auto; 
    margin-bottom: 4rem;
  }
  .promotion-row {
    display: grid;
    gap: 1rem;
    width: 100%;
  }
  .promo-card {
    background: #1a1a2a;
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 10px var(--color-primary);
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  .promo-card:hover {
    transform: scale(1.05);
  }
  
  /* 卡片內圖片與 hover 說明 */
  .card-img {
  position: relative;
  width: 100%;
  padding-top: 48%; /* 固定比例16:9（9/16=0.5625） */
  background: #000;
  overflow: hidden;
}
.card-img img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: contain; /* 重要：改成contain，圖片完整顯示 */
  transform: translate(-50%, -50%);
}
  .hover-info {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    transition: opacity 0.3s ease;
    font-size: 0.8rem;
  }
  .hover-info h3 {
      font-size: 1.4rem;
      margin-bottom: 0.2rem;
  }
  .card-img:hover .hover-info {
    opacity: 1;
  }
  
  /* 價格區 */
  .price-box-bottom {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 0.5rem;
  margin-right: 10px;
  margin-bottom: 10px;
    }
  .discount-tag {
    background: #4a772f;
    color: #bfff00;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-weight: bold;
    font-size: 1.1rem;
  }
  .price-text {
    text-align: right;
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
  </style>
  