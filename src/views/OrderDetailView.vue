<template>
  <div class="order-detail" v-if="order">
    <div class="main-content">
      <h2>訂單詳情</h2>
      <p>訂單編號: {{ order.orderId }}</p>
      <p>支付狀態: {{ statusText(order.status) }}</p>
      <p>總金額: {{ order.total }} 元</p>

      <p>遊戲清單:</p>
      <div class="game-list">
        <div class="game-card" v-for="(name, index) in order.gameNames" :key="index">
          <img
            class="game-image"
            :src="order.gameImages?.[index]"
            :alt="name"
          />
          <div class="game-title">{{ name }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>載入中...</p>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
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

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
  color: #0ff;
  font-weight: bold;
}
</style>
