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

          <div v-if="promotionMap[item.gameId]?.onSale" class="price-box">
            <div class="discount-tag">-{{ Math.floor(promotionMap[item.gameId].discountRate * 100) }}%</div>
            <div class="price-text">
              <div class="original-price">NT$ {{ item.price }}</div>
              <div class="final-price">NT$ {{ Math.floor(promotionMap[item.gameId].discountedPrice) }}</div>
            </div>
          </div>
          <div v-else>
            <p class="game-price">NT$ {{ item.price }}</p>
          </div>
        </div>
        <div class="wishlist-actions">
          <button class="add-btn" @click="addToCart(item.gameId)">加入購物車</button>
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

const wishlist = ref([])
const promotionMap = ref({})
const userId = 1

const fetchPromotionStatus = async (gameId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/promotions/status/${gameId}`)
    promotionMap.value[gameId] = res.data
  } catch (e) {
    console.warn(`取得遊戲 ${gameId} 折扣狀態失敗`, e)
  }
}

const fetchWishlist = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/wishlist/${userId}`)
    wishlist.value = res.data
    for (const item of wishlist.value) {
      await fetchPromotionStatus(item.gameId)
    }
  } catch (error) {
    console.error('載入願望清單失敗', error)
  }
}

const removeFromWishlist = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/wishlist/${userId}/remove/${id}`)
    wishlist.value = wishlist.value.filter(item => item.gameId !== id)
    delete promotionMap.value[id]
  } catch (error) {
    console.error('移除失敗', error)
  }
}

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
  width: 960px;
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
  box-shadow: 0 0 10px var(--color-primary);
  gap: 1rem;
  box-sizing: border-box;
}

.wishlist-thumb {
  width: 120px;
  height: 75px;
  object-fit: cover;
  border-radius: var(--border-radius);
  flex-shrink: 0;
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
  font-size: 1rem;
  color: var(--color-secondary);
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
  font-size: 1.4rem;
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
  font-size: 0.9rem;
}

.final-price {
  color: var(--color-secondary);
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 0 6px var(--color-secondary);
}

.wishlist-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-btn,
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
</style>
