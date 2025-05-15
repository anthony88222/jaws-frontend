<template>
  <div class="order-history content-wrapper">
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

    <table v-else class="order-table">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>總金額</th>
          <th>狀態</th>
          <th>建立時間</th>
          <th>遊戲名稱</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ord in filteredAndSortedOrders" :key="ord.orderId">
          <td>{{ ord.orderId }}</td>
          <td>{{ ord.total }} 元</td>
          <td>{{ getStatusText(ord.status) }}</td>
          <td>{{ formatDate(ord.createdAt) }}</td>
          <td>
            <ul>
              <li v-for="g in ord.gameNames" :key="g">{{ g }}</li>
            </ul>
          </td>
          <td>
  <button @click="viewOrder(ord.orderId)">查看詳情</button>
  <button v-if="ord.status === 1" @click="payAgain(ord.orderId)">再次付款</button>
  <button v-if="ord.status === 1" @click="cancelOrder(ord.orderId)">取消訂單</button>
  <button
    v-if="(ord.status === 3 || ord.status === 5) && isRefundable(ord)"
    @click="openRefundModal(ord)"
  >
    申請退款
  </button>
</td>

        </tr>
      </tbody>
    </table>

    <!-- ✅ 退款彈出視窗 -->
<div v-if="showRefundModal" class="refund-confirm-overlay">
  <div class="refund-confirm-box">
    <h3>選擇欲退款的遊戲</h3>

    <div class="checkbox-list">
      <label
  v-for="(name, idx) in selectedRefundOrder?.gameNames"
  :key="selectedRefundOrder.gameIds[idx]"
  :class="{ disabled: refundedGameIds.includes(selectedRefundOrder.gameIds[idx]) }"
>
  <input
    type="checkbox"
    :value="selectedRefundOrder.gameIds[idx]"
    v-model="selectedRefundGames"
    :disabled="refundedGameIds.includes(selectedRefundOrder.gameIds[idx])"
  />
  {{ name }} - NT$ {{ selectedRefundOrder.gamePrices[idx] }}
</label>


    </div>

    <p class="summary">退款總額：NT$ {{ refundTotal }}，將以遊戲幣退還</p>

    <div class="button-group">
      <button @click="submitRefund">確認退款</button>
      <button @click="cancelRefund">取消</button>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id)
const orders = ref([])


const searchTerm = ref('')
const sortBy = ref('time_desc')
const statusFilter = ref('')

const refundedGameIds = ref([]) // 這是存已退款遊戲 ID 的列表


// ✅ Refund modal 狀態與資料
const showRefundModal = ref(false)
const selectedRefundOrder = ref(null)
const selectedRefundGames = ref([])

const isRefundable = (ord) => {
  const createdAt = new Date(ord.createdAt)
  const now = new Date()
  const diffInDays = (now - createdAt) / (1000 * 60 * 60 * 24)
  return diffInDays <= 3
}

const openRefundModal = (order) => {
  selectedRefundOrder.value = order
  selectedRefundGames.value = []
  refundedGameIds.value = order.refundedGameIds || []  // 👈 加上這行
  showRefundModal.value = true
}


const cancelRefund = () => {
  showRefundModal.value = false
  selectedRefundOrder.value = null
  selectedRefundGames.value = []
}

const refundTotal = computed(() => {
  if (!selectedRefundOrder.value) return 0
  return selectedRefundGames.value.reduce((sum, gameId) => {
    const idx = selectedRefundOrder.value.gameIds.indexOf(gameId)
    return sum + (selectedRefundOrder.value.gamePrices[idx] || 0)
  }, 0)
})

const submitRefund = async () => {
  try {
    const payload = {
      orderId: selectedRefundOrder.value.orderId,
      refundGameIds: selectedRefundGames.value
    }
    const res = await axios.post('http://localhost:8080/api/order/refund', payload)
    alert(`退款成功，遊戲幣增加：${res.data.refundAmount} 元`)
    cancelRefund()
    await fetchOrders()
  } catch (e) {
    console.error('退款失敗', e)
    alert('退款失敗，請稍後再試')
  }
}

// ==================== 訂單相關 ====================

const fetchOrders = async () => {
  if (!userId.value) {
    alert('請先登入')
    router.push('/login')
    return
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/order/findByUser?userId=${userId.value}`)
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

const payAgain = (orderId) => {
  router.push({ path: '/checkout', query: { orderId } })
}

const cancelOrder = async (orderId) => {
  try {
    await axios.post(`/api/order/${orderId}/cancel`)
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
    default: return filtered
  }
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}
</script>


<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
  min-width: 180px;
  flex-grow: 1;
}

.order-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  background-color: #000;
  color: #0ff;
  box-shadow: 0 0 8px #0ff;
  border: 1px solid #0ff;
}

.order-table th,
.order-table td {
  padding: 10px 14px;
  text-align: left;
  border: 1px solid #0ff;
  vertical-align: top;
}

.order-table th {
  background-color: #111;
  color: #f0f;
  white-space: nowrap;
}

.order-table td ul {
  margin: 0;
  padding-left: 20px;
}

.order-table tr:hover {
  background-color: #111;
}

button {
  background-color: #0ff;
  color: #000;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  transition: 0.3s;
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

/* ✅ 退款彈窗樣式 */
.refund-confirm-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.refund-confirm-box {
  background: #111;
  padding: 2rem;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 0 20px #0ff;
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.checkbox-list {
  margin: 1rem 0;
  text-align: left;
}

.checkbox-list label {
  display: block;
  margin: 0.5rem 0;
  color: #0ff;
}

.summary {
  margin: 1rem 0;
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.button-group button {
  padding: 0.5rem 1.5rem;
  border: 2px solid #0ff;
  background: transparent;
  color: #0ff;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.button-group button:hover {
  background: #0ff;
  color: #000;
}

.disabled {
  color: #666;
  opacity: 0.5;
  pointer-events: none;
}


</style>
