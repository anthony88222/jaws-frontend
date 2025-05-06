<template>
  <div v-if="order && order.orderId" class="order-detail">
    <h2>訂單詳情</h2>
    <p>訂單編號：{{ order.orderId }}</p>
    <p>支付狀態：{{ statusText(order.status) }}</p>
    <p>總金額：{{ order.total }} 元</p>

    <p>遊戲清單：</p>
    <ul>
      <li v-for="(name, index) in order.gameNames" :key="index">
        {{ name }} - {{ order.gamePrices?.[index] }} 元
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const order = ref({})

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
