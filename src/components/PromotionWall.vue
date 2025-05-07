<template>
    <section class="promotion-wall">
      <div class="promotion-header">
      <h2>限時特賣</h2>
      <a href="/promotion" class="more-button">看更多</a>
    </div>
      <div class="carousel-container">
        <button class="nav-btn" @click="prevSlide" @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">&#8249;</button>
  
        <!-- 整排使用 out-in cross-fade，避免版面塌陷 -->
        <transition name="fade" mode="out-in">
          <div
            class="carousel-track"
            :key="currentIndex"              
            @mouseover="stopAutoSlide"
            @mouseleave="startAutoSlide"
          >
            <router-link
              v-for="item in visiblePromotions"
              :key="item.game.id"
              class="promo-card"
              :to="{ name: 'GamePage', params: { gameId: item.game.id } }"
            >
              <img :src="item.game.coverImageUrl" :alt="item.game.name" />
              <div class="promo-overlay">
                <h3>{{ item.game.name }}</h3>

                  <div class="price-box-bottom" v-if="item.discountRate">
                    <div class="discount-tag">-{{ item.discountRate }}%</div>
                    <div class="price-text">
                      <div class="original-price">NT$ {{ item.game.price }}</div>
                      <div class="final-price">NT$ {{ getDiscountedPrice(item) }}</div>
                    </div>
                  </div>

                <div class="price-box-bottom" v-else>
                  <div class="final-price">NT$ {{ item.game.price }}</div>
                </div>
              </div>
            </router-link>
          </div>
        </transition>
  
        <button class="nav-btn" @click="nextSlide" @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">&#8250;</button>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import axios from 'axios'
  
  const promotions     = ref([])       // 所有促銷遊戲
  const currentIndex   = ref(0)        // 目前排頭索引
  const visibleCount   = 4             // 同時顯示卡片數
  let   timer          = null          // 自動輪播計時器
  
  /* 取得促銷資料 */
  const fetchPromotions = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:8080/api/promotions/active'
      )
      promotions.value = data.flatMap(p => p.promotionGame || [])
    } catch (err) {
      console.error('取得促銷資料失敗', err)
    }
  }
  
  /* 折扣後價格，無條件捨去小數 */
  const getDiscountedPrice = item =>
    Math.floor(item.game.price * (100 - item.discountRate) / 100)
  
  /* 回傳固定 4 張，索引環繞避免空白 */
  const visiblePromotions = computed(() => {
    if (!promotions.value.length) return []
    const list = []
    for (let i = 0; i < visibleCount; i++) {
      list.push(
        promotions.value[(currentIndex.value + i) % promotions.value.length]
      )
    }
    return list
  })
  
  const nextSlide = () => {
    if (!promotions.value.length) return
    currentIndex.value = (currentIndex.value + 4) % promotions.value.length
  }
  
  const prevSlide = () => {
    if (!promotions.value.length) return
    currentIndex.value =
      (currentIndex.value - 1 + promotions.value.length) % promotions.value.length
  }
  
  /* 自動輪播控制 */
  const startAutoSlide = () => {
    stopAutoSlide()
    timer = setInterval(nextSlide, 3000)
  }
  const stopAutoSlide = () => clearInterval(timer)
  
  onMounted(() => {
    fetchPromotions()
    startAutoSlide()
  })
  onBeforeUnmount(stopAutoSlide)
  </script>
  
  <style scoped>
  .promotion-wall {
    text-align: center;
    margin: 4rem auto;
    padding: 0.5rem;
    max-width: 100%;
    background: linear-gradient(135deg, #0ff3, #f0f3);
    border: 2px solid var(--color-primary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 6px var(--color-primary);
  }
  
  .promotion-title {
    color: var(--color-primary);
    font-size: 2rem;
    text-shadow: 0 0 6px var(--color-primary);
    margin: 0.5rem;
  }
  
  .carousel-container {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-bottom: 0px;
  }
  
  .carousel-track {
    display: flex;
    gap: 1rem;
    justify-content: space-evenly;
    padding: 1rem 0;
    overflow: hidden;
    min-height: 230px;          /* 150px 圖片 + 110px 文字區 */
    position: relative;
    transition: transform 0.5s ease;
    flex: 1;
  }
  
  .promo-card {
    min-width: 220px;
    max-width: 260px;
    /* max-height: 211px; */
    flex-shrink: 0;
    background: #000;
    border: 2px solid var(--color-primary);
    /* border-radius: var(--border-radius); */
    overflow: visible;
    box-shadow: 0 0 12px var(--color-primary);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 0;
  }
  
  h3 {
    /* line-height: 10px; */
    margin: 0px;
    height: 65px;
  }

  
  .promo-card:hover {
    transform: scale(1.05);
    z-index: 10;
  }
  
  .promo-card img {
    width: 100%;
    /* height: 150px; */
    object-fit:contain ;
  }
  
  .promo-overlay {
    position: relative;
    padding: 0.5rem;
    text-align: left;
    color: var(--color-text);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-color: #1f1f2e;
  }
  
  .price-box-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: auto;
    gap: 0.5rem;
  }
  
  .discount-tag {
    background-color: #4a772f;
    color: #bfff00;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    font-size: 1.3rem;
    border-radius: 2px;
    min-width: 50px;
    text-align: center;
  }
  
  .price-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
  
  .nav-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--color-primary);
    cursor: pointer;
    transition: 0.3s ease;
    padding: 0 1rem;
    user-select: none;
  }
  
  .nav-btn:hover {
    color: var(--color-secondary);
    text-shadow: 0 0 10px var(--color-secondary);
  }
  
  /* ✨ 淡入淡出過渡（整排） */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s linear;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .promotion-header {
  display: flex;
  justify-content: center; /* 讓 h2 置中 */
  align-items: center;
  position: relative; /* 讓更多按鈕絕對定位在右邊 */
}

.promotion-header h2 {
  color: white;
  font-size: 2.5rem;
  margin: 0; /* 去掉預設的外邊距 */
  text-shadow: 0 0 3px var(--color-primary);
}
.more-button {
  position: absolute;
  right: 60px;
  top: 25px;
  background: transparent;
  width: 50px;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.4rem 1rem;
  /* border-radius: var(--border-radius); */
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-primary);
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
  flex-shrink: 0;
  font-size: 0.8rem;

} 

.more-button:hover {
  background-color: var(--color-primary);
  color: #000;
}
  </style>
  