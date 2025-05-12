<template>
  <div class="order-detail" v-if="order">
    <div class="main-content">
      <h2>訂單詳情</h2>
      <p>訂單編號: {{ order.orderId }}</p>
      <p>建立時間: {{ formatDate(order.createdAt) }}</p>
      <p>支付狀態: {{ statusText(order.status) }}</p>
      <p>總金額: {{ order.total }} 元</p>
      <p v-if="order.status !== 1">使用遊戲幣: {{ order.walletUsed ?? 0 }} 元</p>
<p v-if="order.status !== 1 && order.total != null">
  綠界付款: {{ order.total - (order.walletUsed ?? 0) }} 元
</p>


      <button
        v-if="order.status === 1"
        class="action-btn"
        @click="goToPayAgain"
      >再次付款</button>

      <h3>遊戲清單:</h3>
      <div class="game-list">
        <div class="game-card" v-for="(name, index) in order.gameNames" :key="index">
          <img class="game-image" :src="order.gameImages?.[index]" :alt="name" />
          <div class="game-info">
            <div class="game-title">{{ name }}</div>
            <div class="game-price">
              <span v-if="order.status !== 1">購買金額: NT$ {{ order.gamePrices?.[index] }}</span>
              <span v-else>價格將依結帳時促銷計算</span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </div>

  <div v-else class="loading">
    <p>載入中...</p>
  </div>

  <!-- 固定底部的返回按鈕 -->
<button class="back-to-orders-btn" @click="goBack">返回歷史訂單</button>

</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const order = ref(null)

const fetchOrderDetail = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/order/${route.params.orderId}`)
    order.value = res.data
  } catch (err) {
    console.error('取得訂單失敗', err)
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

const payAgain = () => {
  router.push({ path: '/checkout', query: { orderId: order.value.orderId } })
}

onMounted(fetchOrderDetail)
</script>

<style scoped>
.order-detail {
  padding: 20px;
  color: #0ff;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.game-card {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: #111;
  padding: 10px;
  border: 1px solid #0ff;
  border-radius: 8px;
}

.game-image {
  width: 100%;
  border-radius: 4px;
}

.game-info {
  margin-top: 8px;
  text-align: center;
}

.btn-neon,
.back-to-orders-btn {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  padding: 12px 24px;
  border: 2px solid #f0f;
  background: transparent;
  color: #f0f;
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.3s, color 0.3s;
}

.back-to-orders-btn:hover {
  background: #f0f;
  color: #000;
}

</style>
