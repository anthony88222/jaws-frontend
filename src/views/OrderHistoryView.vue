<template>
  <div class="order-history">
    <h1>歷史訂單</h1>

    <div class="top-bar">
      <input v-model="searchTerm" type="text" placeholder="搜尋訂單編號或遊戲名稱..." />
      <select v-model="sortBy">
        <option value="time_desc">時間：新到舊</option>
        <option value="time_asc">時間：舊到新</option>
        <option value="total_desc">金額：高到低</option>
        <option value="total_asc">金額：低到高</option>
        <option value="count_desc">遊戲數：多到少</option>
        <option value="count_asc">遊戲數：少到多</option>
      </select>
      <select v-model="statusFilter">
        <option value="">所有狀態</option>
        <option value="1">待付款</option>
        <option value="2">已取消</option>
        <option value="3">已付款</option>
        <option value="4">整筆退款</option>
        <option value="5">部分退款</option>
      </select>
    </div>

    <div v-if="filteredAndSortedOrders.length === 0" class="no-records">
      尚無歷史訂單
    </div>

    <div v-else v-for="ord in filteredAndSortedOrders" :key="ord.orderId" class="order-card">
      <p>訂單編號: {{ ord.orderId }}</p>
      <p>總金額: {{ ord.total }} 元</p>
      <p>狀態: {{ getStatusText(ord.status) }}</p>
      <p>建立時間: {{ formatDate(ord.createdAt) }}</p>
      <p>
        遊戲清單:
        <span v-for="game in ord.gameNames" :key="game">{{ game }}</span>
      </p>
      <button @click="viewOrder(ord.orderId)">查看詳情</button>
      <button v-if="ord.status === 1" @click="payAgain(ord.orderId)">再次付款</button>
      <button v-if="ord.status === 1" @click="cancelOrder(ord.orderId)">取消訂單</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const userId = localStorage.getItem('userId') || 1
const orders = ref([])

const searchTerm = ref('')
const sortBy = ref('time_desc')
const statusFilter = ref('')

const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/order/findByUser?userId=${userId}`)
    orders.value = response.data
  } catch (error) {
    console.error('無法獲取訂單資料:', error)
    alert('獲取訂單資料時發生錯誤，請稍後再試。')
  }
}

onMounted(fetchOrders)

const viewOrder = (orderId) => {
  router.push({ name: 'OrderDetail', params: { orderId } })
}

const payAgain = async (orderId) => {
  try {
    const response = await axios.post(`http://localhost:8080/order/pay-again`, null, {
      params: { orderId }
    })
    const html = response.data
    const newWindow = window.open('', '_blank')
    newWindow.document.write(html)
    newWindow.document.close()
  } catch (error) {
    console.error('重新付款失敗:', error)
    alert('無法重新付款，請稍後再試。')
  }
}

const cancelOrder = async (orderId) => {
  try {
    await axios.post(`http://localhost:8080/order/${orderId}/cancel`)
    alert('訂單已取消')
    fetchOrders()
  } catch (error) {
    console.error('取消訂單失敗:', error)
    alert('取消訂單時發生錯誤，請稍後再試。')
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 1: return '待付款'
    case 2: return '已取消'
    case 3: return '已付款'
    case 4: return '整筆退款'
    case 5: return '部分退款'
    default: return '未知狀態'
  }
}

const filteredAndSortedOrders = computed(() => {
  const keyword = searchTerm.value.toLowerCase()
  let filtered = orders.value.filter(order => {
    const matchKeyword =
      order.orderId.toString().includes(keyword) ||
      order.gameNames.some(name => name.toLowerCase().includes(keyword))
    const matchStatus = statusFilter.value === '' || order.status.toString() === statusFilter.value
    return matchKeyword && matchStatus
  })


  switch (sortBy.value) {
    case 'time_desc': return filtered.sort((a, b) => b.orderId - a.orderId)
    case 'time_asc': return filtered.sort((a, b) => a.orderId - b.orderId)
    case 'total_desc': return filtered.sort((a, b) => b.total - a.total)
    case 'total_asc': return filtered.sort((a, b) => a.total - b.total)
    case 'count_desc': return filtered.sort((a, b) => b.gameNames.length - a.gameNames.length)
    case 'count_asc': return filtered.sort((a, b) => a.gameNames.length - b.gameNames.length)
    case 'time_desc': return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'time_asc': return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    default: return filtered
  }
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}




</script>

<style scoped>
.order-history {
  padding: 20px;
  color: #0ff;
}

.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"],
select {
  padding: 8px;
  border: 1px solid #0ff;
  border-radius: 6px;
  background-color: #000;
  color: #0ff;
  flex-grow: 1;
  min-width: 180px;
}
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #000;
  color: #0ff;
  border: 1px solid #0ff;
  border-radius: 6px;
  padding: 8px;
  flex-grow: 1;
  min-width: 180px;
}
select:focus {
  outline: none;
  box-shadow: 0 0 6px #f0f;
}


.order-card {
  background: linear-gradient(100deg, #000, #0ff); /* 原始背景 */
  border: 1px solid #0ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  color: #f0f;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-4px) scale(1.02);
  background: linear-gradient(100deg, #000, #f0f); /* hover 背景加亮 */
  box-shadow: 0 0 30px #f0f;
  color: #0ff; /* <--- 讓字體也變亮色（副色調或白色） */
}


button {
  background-color: #0ff;
  color: #000;
  border: none;
  padding: 6px 12px;
  margin-right: 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #f0f;
  color: #fff;
}

.no-records {
  text-align: center;
  font-size: 1.2rem;
  color: #ccc;
  margin-top: 2rem;
}
</style>
