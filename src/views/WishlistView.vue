<template>
  <div class="container">
    <div class="wishlist-wrapper">
      <h1 class="wishlist-title">WISHLIST</h1>

      <div v-if="wishlist.length > 0" class="wishlist-list">
        <div v-for="item in wishlist" :key="item.id" class="wishlist-row">
          <img :src="item.coverImageUrl" :alt="item.gameName" class="wishlist-thumb" />

          <div class="wishlist-info">
            <h2 class="game-name">{{ item.gameName }}</h2>
            <p class="game-description">{{ item.description }}</p>

            <div class="user-review">
              整體評價：
              <a v-if="reviewMap[item.gameId]" :href="reviewMap[item.gameId].link" class="review-link" target="_blank">
                {{ reviewMap[item.gameId].text }}
              </a>
              <span v-else class="review-text">尚無評論</span>
            </div>

            <div class="tag-list">
              <span class="tag" v-for="tag in tagMap[item.gameId] || []" :key="tag">{{ tag }}</span>
            </div>
          </div>

          <div class="wishlist-actions">
            <div class="price-button-row">
              <div v-if="promotionMap[item.gameId]?.onSale" class="price-box-horizontal">
                <div class="discount-tag">-{{ Math.floor(promotionMap[item.gameId].discountRate * 100) }}%</div>
                <div class="price-text">
                  <div class="original-price">NT$ {{ item.price }}</div>
                  <div class="final-price">NT$ {{ Math.floor(promotionMap[item.gameId].discountedPrice) }}</div>
                </div>
              </div>
              <div v-else class="price-box-horizontal">
                <div class="no-sale-price">NT$ {{ item.price }}</div>
              </div>

              <button class="add-btn" @click="addToCart(item.gameId)">加入購物車</button>
            </div>

            <button class="remove-btn" @click="removeFromWishlist(item.gameId)">Remove</button>
          </div>
        </div>
      </div>

      <p v-else class="empty-message">目前尚未收藏任何遊戲</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const userId = 1
const wishlist = ref([])
const promotionMap = ref({})
const reviewMap = ref({})
const tagMap = ref({})

// 假資料 fallback（如無後端分類）
const mockReviewMap = {
  1: { text: "極度好評", link: "/reviews/1" },
  2: { text: "褒貶不一", link: "/reviews/2" },
  4: { text: "褒貶不一", link: "/reviews/2" },
  5: { text: "壓倒性好評", link: "/reviews/2" }
}

const mockTagMap = {
  1: ["動作類", "Rogue", "射擊"],
  2: ["劇情", "平台跳躍"],
  4: ["劇情", "Rogue"],
  5: ["劇情", "開放世界", "魂類遊戲"]
}

// ✅ 取得分類資料（從後端）
const fetchCategories = async (gameId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/games/${gameId}/categories`)
    // 取回分類名稱陣列，例如 ['獨立', '角色扮演']
    return res.data.map(c => c.name)
  } catch (err) {
    console.warn(`遊戲 ${gameId} 分類取得失敗，使用 mock 資料`, err)
    return mockTagMap[gameId] || []
  }
}

// ✅ 折扣資料
const fetchPromotionStatus = async (gameId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/promotions/status/${gameId}`)
    promotionMap.value[gameId] = res.data
  } catch (e) {
    console.warn(`取得遊戲 ${gameId} 折扣狀態失敗`, e)
  }
}

// ✅ 載入 wishlist 主流程
const fetchWishlist = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/wishlist/${userId}`)
    wishlist.value = res.data

    for (const item of wishlist.value) {
      const gameId = item.gameId

      await fetchPromotionStatus(gameId)

      // 🔁 額外加入分類與評論
      const tags = await fetchCategories(gameId)
      tagMap.value[gameId] = tags
      reviewMap.value[gameId] = mockReviewMap[gameId] || null
    }
  } catch (error) {
    console.error('載入願望清單失敗', error)
  }
}

// ✅ 移除遊戲
const removeFromWishlist = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/wishlist/${userId}/remove/${id}`)
    wishlist.value = wishlist.value.filter(item => item.gameId !== id)
    delete promotionMap.value[id]
    delete reviewMap.value[id]
    delete tagMap.value[id]
  } catch (error) {
    console.error('移除失敗', error)
  }
}

// ✅ 加入購物車
const addToCart = async (gameId) => {
  try {
    await axios.post(`http://localhost:8080/api/cart/${userId}/add/${gameId}`)
    alert('已加入購物車')
  } catch (error) {
    console.error('加入購物車失敗', error)
  }
}

onMounted(fetchWishlist)
</script>

<style scoped>
.container {  
  height: 100%;
}
.wishlist-wrapper {
  width: 1150px;
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  box-sizing: border-box;
}

.wishlist-title {
  font-size: 2.5rem;
  color: var(--color-secondary);
  text-align: center;
  text-shadow: 0 0 10px var(--color-secondary);
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.wishlist-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.wishlist-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #1a1a2a;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: 1rem;
  padding-top: 0rem;
  padding-bottom: 1rem;
  box-shadow: 0 0 10px var(--color-primary);
  gap: 1rem;
  box-sizing: border-box;
}

.wishlist-thumb {
  width: 220px;
  /* height: 90px; */
  object-fit: cover;
  border-radius: var(--border-radius);
  flex-shrink: 0;
  margin-top: 10px;
}

.wishlist-info {
  flex-grow: 1;
  text-align: left;
  color: var(--color-text);
  min-width: 0;
  overflow: hidden;
}

.game-name {
  font-size: 1.2rem;
  color: var(--color-primary);
  text-shadow: 0 0 6px var(--color-primary);
  word-wrap: break-word;
}

.game-description {
  font-size: 0.9rem;
  color: var(--color-muted);
  margin: 0.3rem 0;
}

.game-price {
  font-size: 0.9rem;
  /* color: var(--color-secondary); */
  font-weight: bold;
}

.highlight-price {
  color: var(--color-primary);
  font-size: 1.2rem;
  text-shadow: 0 0 5px var(--color-primary);
}

.discount {
  color: var(--color-secondary);
  font-size: 0.9rem;
  margin-left: 0.5rem;
  text-shadow: 0 0 4px var(--color-secondary);
}

.remove-btn {
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-secondary);
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: var(--color-secondary);
  color: #000;
  box-shadow: 0 0 8px var(--color-secondary);
}

.empty-message {
  text-align: center;
  color: var(--color-muted);
  font-size: 1.1rem;
  text-shadow: 0 0 4px var(--color-muted);
  padding: 2rem 0;
}
.sale-badge {
  width: 24px;
  height: 24px;
  margin-left: 0.5rem;
  vertical-align: middle;
  filter: drop-shadow(0 0 6px var(--color-secondary));
}

.price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
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

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.8rem;
}

.final-price {
  color: #bfff00;
  font-size: 0.9rem;
  font-weight: bold;
  /* text-shadow: 0 0 6px var(--color-secondary); */
}

.wishlist-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 200px;
  margin-top: 17px;
}

.add-btn,
.remove-btn {
  background: transparent;
  width: 120px;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-secondary);
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.add-btn {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  text-shadow: 0 0 4px var(--color-primary);
}


.remove-btn:hover {
  background: var(--color-secondary);
  color: #000;
  box-shadow: 0 0 8px var(--color-secondary);
}

.add-btn:hover {
  background: var(--color-primary);
  color: #000;
  box-shadow: 0 0 8px var(--color-primary);
}
.user-review {
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  color: #ccc;
}

.review-link {
  color: var(--color-primary);
  font-weight: bold;
  text-decoration: underline;
  margin-left: 0.3rem;
}

.review-text {
  color: var(--color-muted);
  font-style: italic;
  margin-left: 0.3rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.tag {
  padding: 0.3rem 0.6rem;
  background: #2c2f44;
  color: #ccc;
  font-size: 0.75rem;
  border-radius: 3px;
  border: 1px solid var(--color-muted);
  white-space: nowrap;
}

.price-button-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-box-horizontal {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-box-horizontal .discount-tag {
  background-color: #4a772f;
  color: #bfff00;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  font-size: 1rem;
  border-radius: 2px;
  min-width: 50px;
  text-align: center;
}

.price-box-horizontal .original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.8rem;
}

.price-box-horizontal .final-price {
  color: bfff00;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0 6px var(#bfff00);
}

.price-box-horizontal .no-sale-price {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}
</style>
