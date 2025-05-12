<template>
  <div class="checkout-container">
    <div class="checkout-wrapper">
      <h1 class="checkout-title">CHECKOUT</h1>

      <p class="wallet-info">目前可用遊戲幣：{{ walletBalance }} 元</p>

      <!-- 支付方式選擇 -->
      <div class="checkout-payment-method">
  <label>
    <input type="radio" value="1" v-model.number="paymentType" />
    <span>全額刷卡</span>
  </label>
  <label>
    <input type="radio" value="2" v-model.number="paymentType" />
    <span>全額使用遊戲幣</span>
  </label>
  <label>
    <input type="radio" value="3" v-model.number="paymentType" />
    <span>混合支付</span>
  </label>
</div>

      <!-- 混合支付時顯示 -->
      <div v-if="Number(paymentType) === 3" class="checkout-wallet-used">
        <label>
          使用遊戲幣金額：
          <input type="number" v-model.number="walletUsed" />
        </label>
        <p>剩餘需支付：{{ remainingToPay }} 元</p>
      </div>

      <!-- 遊戲清單 -->
      <div class="checkout-game-list">
        <div class="checkout-game-row" v-for="item in gameList" :key="item.gameId">
          <img class="checkout-thumb" :src="item.coverImageUrl" :alt="item.name" />
          <div class="checkout-game-info">
            <h2 class="checkout-game-name">{{ item.name }}</h2>
          </div>
          <div class="checkout-game-right">
            <div class="checkout-price-box">
              <div class="checkout-price-text">
                <div class="checkout-final-price">NT$ {{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交按鈕與總金額 -->
      <div class="checkout-summary">
        <p class="checkout-total-label">訂單總金額：NT$ {{ total }}</p>
        <button class="btn-neon checkout-btn" @click="submitOrder" :disabled="!canSubmit">結帳</button>
      </div>

  

      <!-- 綠界付款表單 -->
      <div v-if="ecpayForm" v-html="ecpayForm"></div>

      <!-- Loading 遮罩 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">付款處理中...</div>
      </div>
    </div>    
  </div>

  <!-- 返回歷史訂單 -->
    
  <button class="back-to-orders-btn" @click="$router.push('/order-history')">
  返回歷史訂單
</button>


     
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, onMounted, nextTick } from 'vue'


const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userId = authStore.user?.id ?? 1
const walletBalance = ref(0)
const paymentType = ref(1)
const walletUsed = ref(0)
const total = ref(0)
const gameList = ref([])
const ecpayForm = ref('')
const isLoading = ref(false)


const submitOrder = async () => {
  isLoading.value = true
  try {
    const payload = {
      userId,
      paymentType: paymentType.value,
      walletUsed: (paymentType.value === 2 || paymentType.value === 3) ? walletUsed.value : 0
    }

    const orderId = route.query.orderId
    let response

    if (orderId) {
      // 再次付款
      response = await axios.post(
        `http://localhost:8080/order/pay-again`,
        payload,
        { params: { orderId } }
      )
    } else {
      // 建立新訂單
      response = await axios.post(`http://localhost:8080/order/create`, payload)
    }

    if (response.data.ecpayHtmlForm) {
      ecpayForm.value = response.data.ecpayHtmlForm
      nextTick(() => {
        const div = document.createElement('div')
        div.innerHTML = ecpayForm.value
        const form = div.querySelector('form')
        if (form) {
          document.body.appendChild(form)
          form.submit()
        } else {
          alert('❌ 綠界表單產生失敗')
        }
      })
    } else if (response.data.status === 3) {
      alert('✅ 付款完成')
      router.push('/library')
    } else {
      alert('⚠️ 訂單尚未付款完成，請稍後再試')
      router.push('/order-history')
    }
  } catch (err) {
    console.error(err)
    alert('❌ 結帳失敗，請稍後再試')
    router.push('/order-history')
  } finally {
    isLoading.value = false
  }
}


const remainingToPay = computed(() => {
  return Math.max(total.value - walletUsed.value, 0)
})

const canSubmit = computed(() => {
  if (paymentType.value === 2) {
    return walletBalance.value >= total.value
  }
  if (paymentType.value === 3) {
    return (
      walletUsed.value > 0 &&
      walletUsed.value <= walletBalance.value &&
      walletUsed.value < total.value
    )
  }
  return true
})

// 👇 取得訂單資訊（再次付款 or 購物車）
onMounted(async () => {
  const orderId = route.query.orderId
  if (orderId) {
    const res = await axios.get(`http://localhost:8080/order/${orderId}`)
    const order = res.data
    total.value = order.total
    gameList.value = order.gameIds.map((id, idx) => ({
      gameId: id,
      name: order.gameNames[idx],
      coverImageUrl: order.gameImages[idx],
      price: order.gamePrices[idx]
    }))
    const userRes = await axios.get(`http://localhost:8080/api/user/${userId}`)
    walletBalance.value = userRes.data.walletBalance
  } else {
    // 假設你有從購物車結帳邏輯，要另外補 gameList
    total.value = parseInt(route.query.total || 0)
    const userRes = await axios.get(`http://localhost:8080/api/user/${userId}`)
    walletBalance.value = userRes.data.walletBalance
    // 此處你可以 fetchCart() 並轉為 gameList 格式
  }
})

</script>


<style scoped>
.checkout-container {
  height: 100%;
}

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
  margin-top: 0.5rem;
}

.wallet-info {
  color: var(--color-text);
  font-weight: bold;
  margin-bottom: 1rem;
}

.checkout-payment-method {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.checkout-payment-method input[type="radio"] {
  display: none;
}

.checkout-payment-method label {
  cursor: pointer;
}

.checkout-payment-method span {
  background: var(--color-primary);
  color: #000;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: bold;
  display: inline-block;
}

/* 當 input 被選取時，對應的 span 改為副色調 */
.checkout-payment-method input[type="radio"]:checked + span {
  background: var(--color-secondary);
  color: #fff;
}


.checkout-wallet-used {
  margin-bottom: 1rem;
  color: var(--color-text);
}

.checkout-game-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 2rem;
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
}

.checkout-game-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;
}

.checkout-price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.checkout-price-text {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.checkout-final-price {
  font-size: 1rem;
  font-weight: bold;
}

.total-price {
  text-align: right;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
  color: var(--color-text);
}

.checkout-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

/* checkout btn 使用購物車樣式 */
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

/* 固定底部返回按鈕樣式（參考 scroll-top-button） */
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

/* loading 遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  color: white;
  font-size: 1.5rem;
  background: #222;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px cyan;
}
</style>
