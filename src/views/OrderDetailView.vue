<template>
  <div class="order-detail-wrapper">
    <!-- 正確配對 v-if / v-else -->
    <div v-if="order">
      <div class="checkout-wrapper">
        <h1 class="checkout-title">ORDER DETAIL</h1>

        <!-- 基本資訊 -->
        <table class="order-info-table">
          <tbody>
            <tr>
              <th>訂單編號</th>
              <td>{{ order.orderId }}</td>
            </tr>
            <tr>
              <th>建立時間</th>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
            <tr>
              <th>訂單狀態</th>
              <td>{{ statusText(order.status) }}</td>
            </tr>
            <tr>
              <th>總金額</th>
              <td>{{ order.total }} 元</td>
            </tr>
            <tr v-if="order.status !== 1">
              <th>使用遊戲幣</th>
              <td>{{ order.walletUsed ?? 0 }} 元</td>
            </tr>
            <tr v-if="order.status !== 1 && order.total != null">
              <th>綠界付款</th>
              <td>{{ order.total - (order.walletUsed ?? 0) }} 元</td>
            </tr>
          </tbody>
        </table>

        <!-- 遊戲清單 -->
        <h3 class="section-title">遊戲清單:</h3>
        <div class="checkout-game-list">
          <div
  class="checkout-game-row"
  v-for="(name, index) in order.gameNames"
  :key="index"
  @click="goToGamePage(order.gameIds[index])"
  style="cursor: pointer"
>

            <img class="checkout-thumb" :src="order.gameImages?.[index]" :alt="name" />
            <div class="checkout-game-info">
              <h2 class="checkout-game-name">{{ name }}</h2>
              <div class="game-price-display">金額：NT$ {{ order.gamePrices?.[index] }}</div>
            </div>
            <div class="checkout-game-right">
              <div v-if="order.status === 1 && promotionMap[order.gameIds?.[index]]?.onSale" class="price-box">
                <div class="discount-tag">
                  -{{ Math.floor(promotionMap[order.gameIds[index]].discountRate * 100) }}%
                </div>
                <div class="price-text">
                  <div class="original-price">NT$ {{ order.gamePrices?.[index] }}</div>
                  <div class="final-price">NT$ {{ Math.floor(promotionMap[order.gameIds[index]].discountedPrice) }}
                  </div>
                </div>
              </div>
              <div v-else class="price-box">
                <div class="price-text">
                  <div class="final-price">NT$ {{ order.gamePrices?.[index] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 結帳按鈕（待付款才顯示） -->
        <div class="button-container">
        <div v-if="order.status === 1" class="checkout-summary">
          <p class="checkout-total-label">訂單總金額：NT$ {{ order.total }}</p>
          <button class="btn-neon checkout-btn" @click="goToPayAgain">結帳</button>
        </div>
        </div>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-else class="loading">
      <p>載入中...</p>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const order = ref(null)
const promotionMap = ref({})

const fetchOrderDetail = async () => {
  try {
    const res = await axios.get(`/api/order/${route.params.orderId}`)
    order.value = res.data
  } catch (err) {
    console.error('取得訂單失敗', err)
  }
}

const fetchPromotions = async () => {
  if (!order.value?.gameIds) return
  for (let i = 0; i < order.value.gameIds.length; i++) {
    const gameId = order.value.gameIds[i]
    const res = await axios.get(`/api/promotions/status/${gameId}`)
    promotionMap.value[gameId] = res.data
  }
}

const statusText = (status) => {
  switch (status) {
    case 1: return '待付款'
    case 2: return '已取消'
    case 3: return '已付款'
    case 4: return '全額退款'
    case 5: return '部分退款'
    default: return '未知狀態'
  }
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

const goBack = () => {
  router.push({ name: 'OrderHistory' })
}

const goToPayAgain = () => {
  router.push({ path: '/checkout', query: { orderId: order.value.orderId } })
}

const goToGamePage = (gameId) => {
  router.push(`/gamepage/${gameId}`)
}


onMounted(async () => {
  await fetchOrderDetail()
  if (order.value?.status === 1) {
    await fetchPromotions()
  }
})
</script>


<style scoped>
.checkout-wrapper {
  width: 1050px;
  max-width: 1050PX;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  box-sizing: border-box;
  position: relative;
}

.order-info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.order-info-table th,
.order-info-table td {
  border: 1px solid #0ff;
  padding: 8px 12px;
  text-align: left;
}

.order-info-table th {
  background-color: #111;
  color: #0ff;
  width: 160px;
}

.order-info-table td {
  background-color: #111;
}

.checkout-title {
  font-size: 2.5rem;
  color: var(--color-secondary);
  text-align: center;
  text-shadow: 0 0 10px var(--color-secondary);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #f0f;
  text-shadow: 0 0 6px #f0f;
}

.game-price-display {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #bbb;
}

.checkout-game-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a2a;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: 1rem;
  box-shadow: 0 0 10px var(--color-primary);
  gap: 1rem;
}

.checkout-thumb {
  width: 280px;
  /* 擴大圖片寬度 */
  height: auto;
  object-fit: cover;
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.checkout-game-info {
  flex-grow: 1;
  text-align: center;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 置中 */
}

.checkout-game-name {
  color: var(--color-primary);
  font-size: 1.5rem;
  text-shadow: 0 0 6px var(--color-primary);
  margin-bottom: 0.5rem;
}

.game-price-display {
  display: none;
  /* 👈 移除左側金額 */
}

.checkout-game-right {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.button-container {
  text-align: right;
  margin-top: 1rem; /* 或自行調整間距 */
}


.btn-neon {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.75rem 2rem;
  text-shadow: 0 0 6px var(--color-primary);
  transition: var(--transition);
  border-radius: var(--border-radius);
  }
</style>