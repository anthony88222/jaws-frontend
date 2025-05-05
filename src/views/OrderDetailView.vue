<template>
  <div class="order-detail">
    <h2>訂單詳情</h2>
    <p>訂單編號: {{ order.orderId }}</p>
    <p>支付狀態: {{ statusText(order.status) }}</p>
    <p>總金額: {{ order.total }} 元</p>

    <p>遊戲清單:</p>
    <div class="game-list">
      <div
        class="game-card"
        v-for="(name, index) in order.gameNames"
        :key="index"
      >
        <img
          class="game-image"
          :src="order.gameImages?.[index]"
          :alt="name"
        />
        <div class="game-title">{{ name }}</div>
        <div class="game-price">價格：{{ order.gamePrices?.[index] }} 元</div>
        <input
          type="checkbox"
          :value="order.gameIds[index]"
          v-model="selectedGameIds"
          :disabled="refundedGameIds.includes(order.gameIds[index])"
        />
      </div>
    </div>

    <p v-if="order.refundable">此訂單可退款</p>
    <p v-else>此訂單不可退款</p>

    <button
      v-if="order.refundable && !refunded"
      class="refund-btn"
      @click="refundAllGames"
    >
      整筆退款
    </button>

    <button
      v-if="order.refundable && selectedGameIds.length > 0"
      class="refund-btn"
      @click="refundSelectedGames"
    >
      退款所選遊戲
    </button>

    <p v-if="refunded">✅ 已退款成功，經驗值與錢包已更新</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const order = ref({})
const refunded = ref(false)
const selectedGameIds = ref([])
const refundedGameIds = ref([])

const fetchOrderDetail = async () => {
  const response = await axios.get(`http://localhost:8080/order/${route.params.orderId}`)
  order.value = response.data
  refundedGameIds.value = response.data.gameIds.filter((id, index) => {
    // 這邊根據後端邏輯可擴充，目前預設無標記已退款項目
    return false // 若能回傳 item.status，可在此過濾已退款項目
  })
}

const refundAllGames = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/order/refundAll`, null, {
      params: { orderId: order.value.orderId }
    })
    alert(`退款成功！金額：${response.data.refundAmount} 元\n訂單狀態已更新`)
    refunded.value = true
    selectedGameIds.value = []
    await fetchOrderDetail()
  } catch (error) {
    alert('退款失敗：' + (error.response?.data?.message || error.message))
  }
}

const refundSelectedGames = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/order/refund`, {
      orderId: order.value.orderId,
      refundGameIds: selectedGameIds.value
    })
    alert(`成功退款 ${response.data.refundAmount} 元`)
    refunded.value = true
    selectedGameIds.value = []
    await fetchOrderDetail()
  } catch (e) {
    alert('退款失敗：' + (e.response?.data?.message || e.message))
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
onMounted(() => {
  (async () => {
    await fetchOrderDetail()
    if (route.query.success === 'true') {
      alert('✅ 付款成功，感謝您的購買！')
    }
  })()
})

</script>






<style scoped>
.order-detail {
  padding: 20px;
  color: #0ff;
  font-weight: bold;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.game-card {
  background: rgba(15, 23, 42, 0.9);
  border: 2px solid #0ff;
  border-radius: 10px;
  overflow: hidden;
  width: 180px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px #f0f;
}

.game-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.game-title {
  padding: 10px;
  font-size: 1rem;
  color: #f0f;
  text-shadow: 0 0 4px #f0f;
}

.game-price {
  font-size: 0.9rem;
  color: #0ff;
  margin-bottom: 6px;
}

.refund-btn {
  padding: 10px 20px;
  background: transparent;
  color: #f0f;
  border: 2px solid #f0f;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 20px;
  margin-right: 10px;
}

.refund-btn:hover {
  background-color: #f0f;
  color: #000;
}
</style>
