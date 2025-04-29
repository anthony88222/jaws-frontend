<template>
  <div class="flex">
    <!-- 左側分類選單 -->
    <aside class="w-1/5 bg-gray-100 p-4">
      <h2 class="text-xl font-bold mb-4">分類</h2>
      <ul>
        <li>
          <button @click="clearCategory" class="w-full text-left hover:underline font-bold text-blue-600 mb-2">
            全部
          </button>
        </li>
        <li v-for="cat in categories" :key="cat" class="mb-2">
          <button @click="filterByCategory(cat)" class="w-full text-left hover:underline">
            {{ cat }}
          </button>
        </li>
      </ul>
    </aside>

    <!-- 右側主內容 -->
    <div class="w-4/5 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <!-- 搜尋框 -->
        <div class="flex items-center mb-4 md:mb-0">
          <input
            v-model="keyword"
            type="text"
            placeholder="搜尋遊戲名稱..."
            class="border rounded p-2 w-64"
          />
          <button @click="fetchLibrary" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded">搜尋</button>
        </div>

        <!-- 排序選單＋按鈕 -->
        <div class="flex items-center">
          <select v-model="sortBy" @change="fetchLibrary" class="border rounded p-2 mr-2">
            <option value="">排序條件</option>
            <option value="releaseDate">發行時間</option>
            <option value="purchaseDate">購買時間</option>
            <option value="price">價格</option>
          </select>
          <button @click="orderAsc = true; fetchLibrary()" class="px-2">▲</button>
          <button @click="orderAsc = false; fetchLibrary()" class="px-2">▼</button>
        </div>
      </div>

      <!-- 遊戲列表 -->
      <div v-if="filteredLibraries.length > 0" class="space-y-6">
        <div v-for="game in filteredLibraries" :key="game.id" class="flex items-center border rounded shadow p-4">
          <img :src="game.coverImageUrl" alt="Game Cover" class="w-32 h-32 object-cover rounded mr-6" />
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ game.gameName }}</h2>
            <p class="mb-1">購買日期：{{ formatDate(game.purchaseDate) }}</p>
            <p class="mb-1">來源：{{ sourceText(game.source) }}</p>
            <p class="mb-1">價格：{{ game.price }} 元</p>
          </div>
        </div>
      </div>

      <!-- 沒有資料 -->
      <div v-else class="text-center py-16">
        <p class="text-2xl mb-4">目前還沒有遊戲</p>
        <router-link to="/" class="px-6 py-3 bg-blue-500 text-white rounded">回到首頁</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const libraries = ref([]);
const keyword = ref('');
const sortBy = ref('');
const orderAsc = ref(true);
const selectedCategory = ref('');
const categories = ['動作', '射擊', '卡牌', 'RPG'];
const userId = 1; // 測試用 userId

// 計算最終顯示的列表（分類後過濾）
const filteredLibraries = computed(() => {
  let result = [...libraries.value];

  if (selectedCategory.value) {
    result = result.filter(game => game.category === selectedCategory.value);
  }

  return result;
});

const fetchLibrary = async () => {
  try {
    let url = `/Library/user/${userId}/list-dto?status=1`;
    const response = await axios.get(url);
    let data = response.data;

    // 關鍵字搜尋（前端過濾）
    if (keyword.value.trim()) {
      const kw = keyword.value.trim().toLowerCase();
      data = data.filter(game => game.gameName.toLowerCase().includes(kw));
    }

    // 排序
    if (sortBy.value) {
      data.sort((a, b) => {
        let fieldA = a[sortBy.value];
        let fieldB = b[sortBy.value];

        if (sortBy.value.includes('Date')) {
          fieldA = new Date(fieldA);
          fieldB = new Date(fieldB);
        }

        if (orderAsc.value) {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      });
    }

    libraries.value = data;
  } catch (error) {
    console.error('載入庫存失敗', error);
    libraries.value = [];
  }
};

const filterByCategory = (category) => {
  selectedCategory.value = category;
};

const clearCategory = () => {
  selectedCategory.value = '';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const sourceText = (source) => {
  switch (source) {
    case 1: return '商城購買';
    case 2: return '活動贈送';
    default: return '其他';
  }
};

onMounted(() => {
  fetchLibrary();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
