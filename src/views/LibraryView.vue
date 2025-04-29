<template>
  <div class="library-wrapper">
    <!-- 獨立側欄 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">分類</h2>
      <ul class="category-list">
        <li class="category-item">動作</li>
        <li class="category-item">射擊</li>
        <li class="category-item">RPG</li>
        <li class="category-item">模擬</li>
        <li class="category-item">策略</li>
        <li class="category-item">冒險</li>
        <li class="category-item">恐怖</li>
        <li class="category-item">解謎</li>
        <li class="category-item">賽車</li>
        <li class="category-item">音樂</li>
      </ul>
    </aside>

    <!-- 主內容 -->
    <div class="main-content">
      <!-- 搜尋與排序 -->
      <div class="top-bar">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋遊戲名稱..."
          class="search-input"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="purchaseDate">購買日期</option>
        </select>
      </div>

      <!-- 遊戲列表 -->
      <div class="game-grid">
        <div
          v-for="game in filteredLibraries"
          :key="game.id"
          class="game-card"
        >
          <img
            :src="game.coverImageUrl"
            alt="Game Cover"
            class="game-image"
          />
          <div class="game-info">
            <h3 class="game-title">{{ game.gameName }}</h3>
            <p class="game-date">
              購買日：{{ formatDate(game.purchaseDate) }}
            </p>
          </div>
        </div>
      </div> <!-- /.game-grid -->

      <!-- 回頁首按鈕：放在 .main-content 底部 -->
      <button class="scroll-top-button" @click="scrollToTop">
        回頁首
      </button>
    </div> <!-- /.main-content -->
  </div> <!-- /.library-wrapper -->
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const libraries = ref([])
const keyword = ref('')
const sortBy = ref('purchaseDate')
const userId = 1

const fetchLibrary = async () => {
  try {
    const response = await axios.get(
      `/Library/user/${userId}/list-dto?status=1`
    )
    libraries.value = response.data
  } catch (error) {
    console.error('載入庫存失敗', error)
  }
}

const filteredLibraries = computed(() => {
  let result = [...libraries.value]

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter((game) =>
      game.gameName.toLowerCase().includes(kw)
    )
  }

  if (sortBy.value === 'purchaseDate') {
    result.sort(
      (a, b) =>
        new Date(b.purchaseDate) - new Date(a.purchaseDate)
    )
  } else if (sortBy.value === 'price') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(fetchLibrary)
</script>

<style scoped>
/* 整體外層，包含側欄與主內容 */
.library-wrapper {
  display: flex;
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
   
  );
  color: #0ff;
  font-weight: bold;
}

/* 側欄：固定於畫面左側 */
.sidebar {
  /* position: fixed; */
  top: 0;
  left: 0;
  width: 200px;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  /* background-color: #2c2733; */
}

.sidebar-title {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #f0f;  
}

.sidebar-title {
  position: relative;
  margin-bottom: 16px;
  font-size: 1.5rem;
}

.sidebar-title::after {
  content: "";
  display: block;
  width: 100%;          /* 線條寬度可改為 50%、80px... */
  height: 1px;          /* 線條高度 */
  background: #f0f;     /* 線條顏色 */
  margin-top: 8px;      /* 標題與線條間距 */
}

.category-list {
  list-style: none;
  padding: 0;
}

.category-item {
  margin-bottom: 20px;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 1.3rem
}
.category-item {
  padding: 8px 0;                                    /* 上下間距 */
  border-bottom: 1px solid rgba(255,255,255,0.2);    /* 分隔線：可調透明度和顏色 */
}
/* 滑鼠移到分類項目時，文字變成 SECOND 顏色 */
.category-item:hover {
  color: #f0f; /* 或者用 var(--color-secondary) */
}

.category-item:last-child {
  border-bottom: none;                               /* 最後一個不需要分隔線 */
}

/* 主內容：靠右留出側欄寬度 */
.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* 搜尋與排序區域 */
.top-bar {


  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.search-input {
  width: 300px;
  padding: 8px;
  margin-right: 10px;
  border: 2px solid #0ff;
  background: transparent;
  color: #0ff;
  border-radius: 8px;
}

.sort-select {
  padding: 8px;
  border: 2px solid #0ff;
  background: transparent;
  color: #0ff;
  border-radius: 8px;
}

/* 遊戲卡片格子 */
.game-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}


.game-card {
  background: rgba(15, 23, 42, 0.9);
  border: 2px solid #0ff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 50px #f0f; 
}

.game-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.game-info {
  padding: 10px;
}

.game-title {
  color: var(--color-primary);
  margin-bottom: 5px;
  font-size: 1.2rem;
  text-shadow: 0 0 4px var(--color-primary);
}

.game-date,
.game-price {
  color: #f0f;
  font-size: 0.9rem;
  text-shadow: 0 0 4px var(--color-secondary);
}

/* 回頁首按鈕：固定於視窗底部置中 */
.scroll-top-button {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  padding: 12px 24px;
  border: 2px solid #f0f;
  background: transparent;
  color: #f0f;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  z-index: 100; /* 確保不被其他元素覆蓋 */
}

.scroll-top-button:hover {
  background: #f0f;
  color: #000;
}
</style>
