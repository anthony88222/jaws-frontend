<template>
  <div class="order-detail" v-if="order">
    <div class="checkout-wrapper">
      <h1 class="checkout-title">ORDER DETAIL</h1>

      <p>訂單編號: {{ order.orderId }}</p>
      <p>建立時間: {{ formatDate(order.createdAt) }}</p>
      <p>訂單狀態: {{ statusText(order.status) }}</p>
      <p>總金額: {{ order.total }} 元</p>
      <p v-if="order.status !== 1">使用遊戲幣: {{ order.walletUsed ?? 0 }} 元</p>
      <p v-if="order.status !== 1 && order.total != null">
        綠界付款: {{ order.total - (order.walletUsed ?? 0) }} 元
      </p>

      <h3 class="section-title">遊戲清單:</h3>
      <div class="checkout-game-list">
        <div class="checkout-game-row" v-for="(name, index) in order.gameNames" :key="index">
          <img class="checkout-thumb" :src="order.gameImages?.[index]" :alt="name" />
          <div class="checkout-game-info">
            <h2 class="checkout-game-name">{{ name }}</h2>
          </div>
          <div class="checkout-game-right">
            <div v-if="order.status === 1 && promotionMap[order.gameIds?.[index]]?.onSale" class="price-box">
              <div class="discount-tag">
                -{{ Math.floor(promotionMap[order.gameIds[index]].discountRate * 100) }}%
              </div>
              <div class="price-text">
                <div class="original-price">NT$ {{ order.gamePrices?.[index] }}</div>
                <div class="final-price">
                  NT$ {{ Math.floor(promotionMap[order.gameIds[index]].discountedPrice) }}
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

      <div v-if="order.status === 1" class="checkout-summary">
        <p class="checkout-total-label">訂單總金額：NT$ {{ order.total }}</p>
        <button class="btn-neon checkout-btn" @click="goToPayAgain">結帳</button>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>載入中...</p>
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
    const res = await axios.get(`http://localhost:8080/api/order/${route.params.orderId}`)
    order.value = res.data
  } catch (err) {
    console.error('取得訂單失敗', err)
  }
}

const fetchPromotions = async () => {
  if (!order.value?.gameIds) return
  for (let i = 0; i < order.value.gameIds.length; i++) {
    const gameId = order.value.gameIds[i]
    const res = await axios.get(`http://localhost:8080/api/promotions/status/${gameId}`)
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

onMounted(async () => {
  await fetchOrderDetail()
  if (order.value?.status === 1) {
    await fetchPromotions()
  }
})
</script>

<style scoped>
.checkout-wrapper {
  width: 1150px;
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  box-sizing: border-box;
  position: relative;
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

.checkout-game-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.checkout-game-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #1a1a2a;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: 1rem;
  box-shadow: 0 0 10px var(--color-primary);
  gap: 1rem;
}

.checkout-thumb {
  width: 220px;
  object-fit: cover;
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.checkout-game-info {
  flex-grow: 1;
  text-align: left;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.checkout-game-name {
  color: var(--color-primary);
  text-shadow: 0 0 6px var(--color-primary);
  font-size: 1.2rem;
}

.checkout-game-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;
}

.price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
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
  font-size: 0.7rem;
}

.final-price {
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}

.checkout-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.checkout-total-label {
  font-size: 1.2rem;
  font-weight: bold;
}

.checkout-btn {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.75rem 2rem;
  text-shadow: 0 0 6px var(--color-primary);
  transition: var(--transition);
  border-radius: var(--border-radius);
}

.checkout-btn:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 0 20px var(--color-primary);
}


</style>
