<template>
  <div class="container">
    <div class="wishlist-wrapper">
      <h1 class="wishlist-title">WISHLIST</h1>

      <div v-if="wishlist.length > 0" class="wishlist-list">
        <div v-for="item in wishlist" :key="item.id" class="wishlist-row">
          <router-link :to="`/gamepage/${item.gameId}`">
            <img :src="item.coverImageUrl" :alt="item.gameName" class="wishlist-thumb" />
          </router-link>

          <div class="wishlist-info">
            <router-link :to="`/gamepage/${item.gameId}`" class="game-name">
              <h2 class="game-name">{{ item.gameName }}</h2>
            </router-link>

            <!-- ✅ 評分顯示 -->
            <div class="rating-display">
              <template v-if="ratingMap[item.gameId]">
                <span class="avg">{{ ratingMap[item.gameId].averageRating.toFixed(1) }}</span>
                <span class="stars">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="star"
                    :class="{ full: n <= Math.round(ratingMap[item.gameId].averageRating) }"
                  >★</span>
                </span>
                <span class="count">({{ ratingMap[item.gameId].totalReviews.toLocaleString() }})</span>
              </template>
              <template v-else>
                <span class="review-text">尚無評分</span>
              </template>
            </div>

            <p class="game-description">{{ item.description }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id || 0)

const wishlist = ref([])
const promotionMap = ref({})
const tagMap = ref({})
const ratingMap = ref({})

// 取得分類
const fetchCategories = async (gameId) => {
  const { data } = await axios.get(
    `http://localhost:8080/api/games/${gameId}/categories`
  )
  return data.map((c) => c.name)
}

// 折扣
const fetchPromotion = (gameId) =>
  axios
    .get(`http://localhost:8080/api/promotions/status/${gameId}`)
    .then(({ data }) => (promotionMap.value[gameId] = data))

// 評分
const fetchRating = (gameId) =>
  axios
    .get(`http://localhost:8080/api/games/${gameId}/rating-summary`)
    .then(({ data }) => (ratingMap.value[gameId] = data))
    .catch(() => (ratingMap.value[gameId] = null))

// 主流程
const fetchWishlist = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/wishlist/${userId.value}`
    )
    wishlist.value = data

    // 並行處理每款遊戲的額外資料
    await Promise.all(
      wishlist.value.map(async ({ gameId }) => {
        await Promise.all([
          fetchPromotion(gameId),
          fetchRating(gameId),
          fetchCategories(gameId).then((tags) => (tagMap.value[gameId] = tags)),
        ])
      })
    )
  } catch (err) {
    console.error('載入願望清單失敗', err)
  }
}

// 移除
const removeFromWishlist = async (gameId) => {
  await axios.delete(
    `http://localhost:8080/api/wishlist/${userId.value}/remove/${gameId}`
  )
  wishlist.value = wishlist.value.filter((w) => w.gameId !== gameId)
  ;[promotionMap, tagMap, ratingMap].forEach((m) => delete m.value[gameId])
}

// 加入購物車
const addToCart = async (gameId) => {
  await axios.post(
    `http://localhost:8080/api/cart/${userId.value}/add/${gameId}`
  )
  alert('已加入購物車')
}

// 登入後自動刷新
watch(userId, (id) => id && fetchWishlist())

onMounted(() => {
  if (userId.value) fetchWishlist()
})
</script>

<style scoped>
/* ❗保留原本樣式，若需細調再增刪 */
</style>


<style scoped>
.container {  
  height: 100%;
}
.wishlist-wrapper {
  width: 1050px;
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
  text-decoration: none;
  margin-bottom: 0.1rem;
  margin-top: 0.8rem;
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
  width: 100px;
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

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: #ccc;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.rating-display .avg {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}

.rating-display .stars {
  display: flex;
  font-size: 1rem;
  color: #666;
}

.rating-display .star {
  color: #444;
}

.rating-display .star.full {
  color: #ffc107;
  text-shadow: 0 0 3px #ffc107;
}

.rating-display .count {
  font-size: 0.85rem;
  color: var(--color-muted);
}
</style>
