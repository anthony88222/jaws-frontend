<template>
  <div class="library-wrapper">
    <!-- 獨立側欄 -->
    <aside class="sidebar">
      <h2 class="sidebar-title">分類</h2>
      <ul class="category-list">
        <li
          v-for="cat in categoryList"
          :key="cat"
          class="category-item"
          :class="{ active: selectedCategory === cat }"
          @click="filterByCategory(cat)"
        >
          {{ cat }}
        </li>
        <li
          class="category-item reset"
          :class="{ active: selectedCategory === '' }"
          @click="filterByCategory('')"
        >
          顯示全部
        </li>
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
          <option v-if="!sortBy" disabled hidden value="">請選擇排序方式</option>
          <option value="purchaseDate_desc">購買日期（新 → 舊）</option>
          <option value="purchaseDate_asc">購買日期（舊 → 新）</option>
          <option value="price_desc">價格（高 → 低）</option>
          <option value="price_asc">價格（低 → 高）</option>
        </select>
      </div>

      <!-- 遊戲列表 -->
      <div class="game-grid">
        <template v-if="filteredLibraries.length > 0">
          <div
            v-for="game in filteredLibraries"
            :key="game.id"
            class="game-card"
          >
            <img
              :src="game.coverImageUrl || '/placeholder.png'"
              @error="handleImageError"
              alt="Game Cover"
              class="game-image"
            />
            <div class="game-info">
              <h3 class="game-title">{{ game.gameName }}</h3>
              <p class="game-date">📅 購買日：{{ formatDate(game.purchaseDate) }}</p>
              <p class="game-category">🎮 類別：{{ game.categoryNames?.join(', ') || '無分類' }}</p>
              <p class="game-price">💰 金額：{{ game.price ?? '未知' }} 元</p>
            </div>
          </div>
        </template>

        <!-- 沒有遊戲時顯示提示 -->
     <!-- 沒有遊戲時顯示提示 -->
<div v-else class="no-game-placeholder">
  😢 目前這個分類沒有遊戲
</div>

      </div>

      <!-- 回頁首按鈕：放在 .main-content 底部 -->
      <button class="scroll-top-button" @click="scrollToTop">
        回頁首
      </button>

    </div> <!-- /.main-content -->
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const libraries = ref([])
const keyword = ref('')
const sortBy = ref("")
const userId = 1
const selectedCategory = ref('')

const categoryList = [
  "角色扮演",
  "動作",
  "獨立",
  "策略",
  "沙盒",
  "生存",
  "恐怖",
  "第一人稱射擊",
  "MOBA",
  "冒險"
]

const filterByCategory = (category) => {
  selectedCategory.value = category
}
if (selectedCategory.value) {
  result = result.filter((game) =>
    game.categoryNames?.includes(selectedCategory.value)
  )
}




// ✅ 圖片載入錯誤時使用預設圖
const handleImageError = (e) => {
  e.target.src = '/placeholder.png'
}

// ✅ 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "無日期"
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? "無效日期" : date.toLocaleDateString()
}

// ✅ 拉取並展平資料
const fetchLibrary = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/Library/user/${userId}/list-dto?status=1`)
    libraries.value = response.data
  } catch (error) {
    console.error('❌ 載入遊戲庫資料失敗', error)
  }
}




// ✅ 搜尋與排序
const filteredLibraries = computed(() => {
  let result = [...libraries.value]

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    result = result.filter(game =>
      game.gameName.toLowerCase().includes(kw)
    )
  }

  // ✅ 分類篩選條件（放這裡！）
  if (selectedCategory.value) {
    result = result.filter((game) =>
      game.categoryNames?.includes(selectedCategory.value)
    )
  }

  // ✅ 排序
  if (sortBy.value === "purchaseDate_desc") {
    result.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
  } else if (sortBy.value === "purchaseDate_asc") {
    result.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate))
  } else if (sortBy.value === "price_desc") {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === "price_asc") {
    result.sort((a, b) => a.price - b.price)
  }

  return result
})


// ✅ 回頁首
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(fetchLibrary)
</script>


<style scoped>

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 1000px; /* ⭐ 關鍵！設定一個不會收縮的最小寬度 */
}

.library-wrapper {
  display: flex;
  position: relative;
  min-height: 100vh;
  color: #0ff;
  font-weight: bold;
  padding: 20px 40px;
  box-sizing: border-box;
}

/* 側欄固定寬度 */
.sidebar {
  width: 200px;
  height: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}

.sidebar-title {
  margin-bottom: 16px;
  font-size: 1.5rem;
  color: #f0f;
  position: relative;
}

.sidebar-title::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #f0f;
  margin-top: 8px;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  padding: 8px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  font-size: 1.3rem;
  cursor: pointer;
  transition: color 0.3s;
}

.category-item:hover {
  color: #f0f;
}

.category-item.active {
  color: #f0f;
  font-weight: bold;
  border-left: 4px solid #f0f;
  padding-left: 10px;
  background: rgba(255, 255, 255, 0.05);
}

/* 主內容保持最大寬度與靠左不變形 */
.main-content {
  flex: 1;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

/* 搜尋與排序 */
.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;           /* ⭐ 加這行！保持左右間距一致 */
  margin-bottom: 30px;
}


.search-input {
  width: 300px;
  padding: 8px;
  border: 2px solid #0ff;
  background: transparent;
  color: #0ff;
  border-radius: 8px;
}

.sort-select {
  width: 200px;        /* ⭐ 建議加上這個！兩個元素寬度不要差太多 */
  padding: 8px;
  border: 2px solid #0ff;
  background: transparent;
  color: #0ff;
  border-radius: 8px;
}


/* 遊戲卡片格子排列 */
.game-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  min-height: 300px;
}

/* 沒有遊戲時的訊息仍佔滿一列 */
.no-game-placeholder {
  grid-column: 1 / -1;
  font-size: 1.5rem;
  color: #f0f;
  text-align: center;
  padding: 100px 0;
}

/* 卡片樣式統一 */
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
  font-size: 1.2rem;
  margin-bottom: 5px;
  text-shadow: 0 0 4px var(--color-primary);
}

.game-date,
.game-category,
.game-price {
  font-size: 0.9rem;
  color: #f0f;
  text-shadow: 0 0 4px var(--color-secondary);
}

/* 回到頁首按鈕 */
.scroll-top-button {
  padding: 12px 24px;
  border: 2px solid #f0f;
  background: transparent;
  color: #f0f;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  text-shadow: 0 0 6px #f0f;
  font-size: 1rem;
  display: block;
  margin: 3rem auto 2rem;
}
.scroll-top-button:hover {
  background: #f0f;
  color: #000;
}



</style>
