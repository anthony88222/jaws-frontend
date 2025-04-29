<template>
    <div class="order-detail">
      <h2>訂單詳情</h2>
      <p>訂單編號: {{ order.orderId }}</p>
      <p>支付狀態: {{ order.status }}</p>
      <p>總金額: {{ order.total }} 元</p>
      <p>遊戲清單:</p>
      <ul>
        <li v-for="game in order.gameNames" :key="game">{{ game }}</li>
      </ul>
      <p v-if="order.refundable">此訂單可退款</p>
      <p v-else>此訂單不可退款</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const order = ref({})
  
  const fetchOrderDetail = async () => {
    const response = await axios.get(`http://localhost:8080/order/${route.params.orderId}`)
    order.value = response.data
  }
  
  onMounted(fetchOrderDetail)
  </script>
  
  <style scoped>
  .order-detail {
    padding: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  </style>
  