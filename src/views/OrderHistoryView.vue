<template>
    <div class="order-history">
      <h1>歷史訂單</h1>
      
      <!-- 當訂單資料為空時顯示 "尚無歷史訂單" -->
      <div v-if="orders.length === 0" class="no-records">
        尚無歷史訂單
      </div>
      
      <!-- 顯示每筆訂單 -->
      <div v-else v-for="order in orders" :key="order.orderId" class="order-card">
        <p>訂單編號: {{ order.orderId }}</p>
        <p>總金額: {{ order.total }} 元</p>
        <p>狀態: {{ getStatusText(order.status) }}</p>
        <p>遊戲清單: <span v-for="game in order.gameNames" :key="game">{{ game }}</span></p>
        <button @click="viewOrder(order.orderId)">查看詳情</button>
        <button @click="cancelOrder(order.orderId)" v-if="order.status === 1">取消訂單</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  // 動態獲取 userId，這裡使用 localStorage 假設為登入後取得的 ID 
const userId = localStorage.getItem('userId') || 1;// 如果沒有從 localStorage 取得，就預設為 1
console.log('Fetching orders for userId:', userId);  // 確認 userId 是否正確

  const orders = ref([])

  const getStatusText = (status) => {
  switch (status) {
    case 1:
      return '待付款';
    case 2:
      return '已取消';
    case 3:
      return '已付款';
    case 4:
      return '整筆退款';
    case 5:
      return '部分退款';
    default:
      return '未知狀態';
  }
};
  
const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/order/findByUser?userId=${userId}`)
    console.log(response.data);  // 這應該是從後端返回的訂單資料
    orders.value = response.data;
  } catch (error) {
    console.error('無法獲取訂單資料:', error);
    alert('獲取訂單資料時發生錯誤，請稍後再試。');
  }
};
  // 查看訂單詳情
  const viewOrder = (orderId) => {
    // 跳轉到單一訂單頁面
    console.log('查看訂單詳情', orderId)
  }
  
  // 取消訂單
  const cancelOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:8080/order/${orderId}/cancel`)
      alert('訂單已取消')
      fetchOrders() // 重新獲取訂單列表
    } catch (error) {
      console.error('取消訂單失敗:', error)
      alert('取消訂單時發生錯誤，請稍後再試。')
    }
  }
  
  console.log('Fetching orders for userId:', userId);

  onMounted(fetchOrders)
  </script>
  
  <style scoped>
  .order-history {
    padding: 20px;
  }
  
  .order-card {
    background-color: #333;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: transform 0.2s;
  }
  
  .order-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .no-records {
    text-align: center;
    font-size: 1.2rem;
    color: #ccc;
    margin-top: 2rem;
  }
  </style>
  