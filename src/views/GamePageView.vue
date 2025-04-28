<template>
    <div class="game-page-container">
      <!-- Hero 區塊 -->
      <h1 class="game-title">THE LONG DARK</h1>
      <section class="game-hero-carousel">
        <!-- 左側：主圖 + 縮圖 -->
        <div class="carousel-wrapper-vertical">
          <div class="main-image-container">
            <img :src="screenshots[currentIndex]" alt="遊戲截圖" class="carousel-image" />
          </div>
          <div class="thumbnail-list">
            <div
              v-for="(img, index) in screenshots"
              :key="index"
              class="thumbnail-item"
              :class="{ active: currentIndex === index }"
              @click="currentIndex = index"
            >
              <img :src="img" :alt="`縮圖${index}`" />
            </div>
          </div>
        </div>
  
        <!-- 右側：遊戲資訊 -->
        <div class="game-info right-info">
          <img class="hero-cover" src="https://cdn.akamai.steamstatic.com/steam/apps/305620/header.jpg" alt="The Long Dark" />
          <p class="game-description">
            挑戰玩家獨自求生的探索遊戲，在地磁風暴後的極地荒野中掙扎求生。
          </p>
          <ul class="meta-info">
            <li>評論數：<span class="highlight">9萬+</span></li>
            <li>發行日：2017 年 8 月 1 日</li>
            <li>標籤：
              <span class="tag">生存</span>
              <span class="tag">劇情</span>
              <span class="tag">探索</span>
            </li>
          </ul>
          <button class="cart-btn">立即購買</button>
        </div>
      </section>
  
      <!-- 遊戲版本 -->
      <section class="edition-section">
        <h2 class="section-title">遊戲版本</h2>
        <div class="edition-card" v-for="edition in editions" :key="edition.id">
          <div class="edition-left">
            <h3 class="edition-name">{{ edition.name }}</h3>
            <p class="edition-desc">{{ edition.description }}</p>
          </div>
          <div class="edition-right">
            <div class="price-box">
              <div v-if="edition.discount > 0" class="discount-tag">-{{ edition.discount }}%</div>
              <div :class="['price-text', edition.discount > 0 ? 'green' : 'white']">
                <div v-if="edition.discount > 0" class="original-price">NT$ {{ edition.originalPrice }}</div>
                <div class="final-price">NT$ {{ edition.finalPrice }}</div>
              </div>
            </div>
            <button class="cart-btn">加入購物車</button>
          </div>
        </div>
      </section>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const screenshots = [
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/305620/ss_718af4cf5640b3227a530adf6d5f6d9e3a46703b.600x338.jpg?t=1745525398',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/305620/ss_70d3a9799c9b003a53c8ac512f163678a4967672.600x338.jpg?t=1745525398',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/305620/ss_6b411930012a9f6794fe32e36504517aa54c3e4c.600x338.jpg?t=1745525398',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/305620/ss_05c7f5d1b2ec2b2a1cf4ca2aa1ff609c7542f6b5.600x338.jpg?t=1745525398'
  ]
  
  const currentIndex = ref(0)
  let interval = null
  
  onMounted(() => {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % screenshots.length
    }, 3000)
  })
  
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
  
  const editions = [
    {
      id: 1,
      name: '標準版',
      description: '包含完整主遊戲體驗',
      originalPrice: 1790,
      discount: 40,
      finalPrice: 1074,
    },
    {
      id: 2,
      name: '夜城擴充包',
      description: '新增地圖區域、任務與角色',
      originalPrice: 890,
      discount: 30,
      finalPrice: 623,
    },
    {
      id: 3,
      name: '終極收藏版',
      description: '主遊戲 + 所有DLC內容',
      originalPrice: 2490,
    //   discount: 50,
      finalPrice: 1245,
    }
  ]
  </script>
  
  <style scoped>
  :root {
    --color-primary: #00fff7;
    --color-secondary: #ff00ff;
  }
  
  :root {
  --color-primary: #00fff7;
  --color-secondary: #ff00ff;
}

/* 基本容器 */
.game-page-container {
  padding: 2rem;
  font-family: 'Orbitron', sans-serif;
  color: #e0e0e0;
}

/* Hero 區塊 */
.game-hero-carousel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(135deg, #080b17, #230034);
  border: 2px solid var(--color-primary);
  border-radius: 1rem;
  box-shadow: 0 0 10px var(--color-primary);
  padding: 2rem;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 左側圖片上下結構 */
.carousel-wrapper-vertical {
  display: flex;
  flex-direction: column;
  width: 640px;
}

.main-image-container {
  width: 100%;
  height: 360px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 8px var(--color-primary);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

/* 修正縮圖滾動問題 */
.thumbnail-list {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  height: 60px;
}

.thumbnail-item {
  width: 100px;
  height: 56px;
  border: 2px solid transparent;
  border-radius: 0.4rem;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.thumbnail-item:hover {
  transform: scale(1.05);
  border-color: #00ccff;
}

.thumbnail-item.active {
  border-color: var(--color-secondary);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右側資訊 */
.right-info {
  width: 320px;
  display: flex;
  flex-direction: column;
}

.hero-cover {
  width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 0 12px var(--color-primary);
}

.game-title {
  /* color: var(--color-secondary); */
  font-size: 2rem;
  margin: 0.7rem;
  /* text-shadow: 0 0 10px var(white); */
}

.game-description {
  font-size: 0.95rem;
  color: #bbb;
  margin-bottom: 1rem;
}

.meta-info {
  list-style: none;
  padding: 0;
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.meta-info .highlight {
  color: var(--color-primary);
  font-weight: bold;
}

.tag {
  background-color: #00ccff;
  color: #000;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  margin-left: 0.25rem;
  font-size: 0.8rem;
}

.buy-btn {
  background-color: var(--color-secondary);
  border-radius: 1rem;
  color: white;
  font-weight: bold;
}

/* 遊戲版本 */
.edition-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 4px var(white);
}

.edition-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1c2e;
  border: 1px solid var(--color-primary);
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 12px var(--color-primary);
}

.edition-left {
  flex: 1;
}

.edition-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-direction: row;
}

.edition-name {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.edition-desc {
  font-size: 0.95rem;
  color: #aaa;
}

.edition-price {
  text-align: right;
  font-size: 1.1rem;
}

.edition-price .original {
  text-decoration: line-through;
  margin-right: 0.5rem;
  color: #666;
}

/* ===== 新增區塊：價格樣式依折扣變色 ===== */
.price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}

.discount-tag {
  background-color: #4a772f;
  color: #bfff00;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  font-size: 1.3rem;
  border-radius: 2px;
  min-width: 60px;
  text-align: center;
}

.price-text {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.price-text.green .final-price {
  color: #bfff00;
  text-shadow: 0 0 6px #bfff00;
}

.price-text.white .final-price {
  color: #fff;
  text-shadow: none;
}

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.9rem;
}

.final-price {
  font-size: 1.2rem;
  font-weight: bold;
}

/* 加入購物車按鈕 */
.cart-btn {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-primary);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.cart-btn:hover {
  background-color: var(--color-primary);
  color: #000;
  box-shadow: 0 0 12px var(--color-primary);
}

  </style>
  