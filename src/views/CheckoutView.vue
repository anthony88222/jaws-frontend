<template>
  <div class="checkout-container">
    <div class="checkout-wrapper">
      <h1 class="checkout-title">CHECKOUT</h1>

      <p class="wallet-info">目前可用遊戲幣：{{ walletBalance }} 元</p>

      <!-- 贈送好友欄位（可選） -->
<div class="checkout-receiver">
  <label>
    贈送對象（可留空代表自購）：
    <select v-model="receiverId">
      <option :value="undefined">-- 自購（不贈送） --</option>
      <option v-for="friend in friends" :key="friend.id" :value="friend.id">
        {{ friend.username }}
      </option>
    </select>
  </label>
</div>



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
            <div v-if="item.discountRate > 0" class="checkout-price-box">
  <div class="discount-tag">-{{ item.discountRate }}%</div>
  <div class="checkout-price-text">
    <div class="original-price">NT$ {{ item.originalPrice }}</div>
    <div class="checkout-final-price">NT$ {{ item.price }}</div>
  </div>
</div>
<div v-else class="checkout-price-box">
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
    
      <!-- 返回歷史訂單 -->
    

  </div>




     
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, onMounted, nextTick } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userId = computed(() => authStore.user?.id)
const walletBalance = ref(0)
const paymentType = ref(1)
const walletUsed = ref(0)
const total = ref(0)
const gameList = ref([])
const ecpayForm = ref('')
const receiverId = ref(null) // ✅ 受贈者 ID，可為 null（代表自購）
const friendList = ref([]) // ✅ 好友清單
const isLoading = ref(false)
const friends = ref([])

const submitOrder = async () => {
  if (!userId.value) {
    alert('請先登入')
    router.push('/login')
    return
  }

  isLoading.value = true
  try {
    // ✅ 嚴格轉為整數避免浮點錯誤，並加上 console.log
    const rawWalletUsed = Number(walletUsed.value)
const finalWalletUsed = ([2, 3].includes(Number(paymentType.value)))
  ? Math.floor(rawWalletUsed)
  : 0


    console.log('🎯 paymentType:', paymentType.value)
    console.log('🎯 walletUsed.value:', walletUsed.value)
    console.log('🎯 finalWalletUsed:', finalWalletUsed)

    const payload = {
      userId: userId.value,
      paymentType: paymentType.value,
      walletUsed: finalWalletUsed,
      receiverId: receiverId.value ?? null

    }

    console.log('✅ payload:', payload)

    const orderId = route.query.orderId
    let response

    if (orderId) {
      response = await axios.post(
        "http://localhost:8080/api/order/pay-again",
        payload,
        { params: { orderId } }
      )
    } else {
      response = await axios.post("http://localhost:8080/api/order/create", payload)
    }

    // ... 保持後續邏輯不變


    if (response.data.ecpayHtmlForm) {
      ecpayForm.value = response.data.ecpayHtmlForm

      nextTick(() => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = ecpayForm.value
        const form = wrapper.querySelector('form')
        if (form) {
          document.body.appendChild(form)
          requestAnimationFrame(() => form.submit()) // ✅ CSP 安全觸發
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

const fetchFriends = async () => {
  try {
    const res = await fetch(`/api/friend/getFriends?userId=${userId.value}`)
    const data = await res.json()

    friends.value = data.map(f => {
      const isSelfUser = f.userId === userId
      const otherId = isSelfUser ? f.friendId : f.userId

      return {
        id: otherId,
        username: f.username
      }
    })
  } catch (err) {
    console.error('取得好友失敗', err)
  }
}

onMounted(async () => {
  if (!userId.value) {
    alert('請先登入')
    router.push('/login')
    return
  }

  // 取得使用者遊戲幣餘額
  try {
    const userRes = await axios.get(`http://localhost:8080/api/user/${userId.value}`)
    walletBalance.value = userRes.data.wallet ?? 0
  } catch (e) {
    console.warn('❌ 無法取得使用者餘額', e)
    walletBalance.value = 0
  }

  fetchFriends()

  const orderId = route.query.orderId
  if (orderId) {
    // ✅ 再次付款模式：從訂單載入資料（價格已是正確折扣價）
    try {
      const res = await axios.get(`http://localhost:8080/api/order/${orderId}`)
      const order = res.data
      total.value = order.total
      gameList.value = order.gameIds.map((id, idx) => ({
        gameId: id,
        name: order.gameNames[idx],
        coverImageUrl: order.gameImages[idx],
        price: Math.floor(order.gamePrices[idx]),
        originalPrice: Math.floor(order.gamePrices[idx]), // 無打折就同原價
        discountRate: 0 // 預設無折扣
      }))
    } catch (e) {
      console.error('❌ 無法載入訂單資料', e)
    }
  } else {
    // ✅ 首次結帳：從購物車載入資料 + 查詢促銷折扣
    try {
      const cartRes = await axios.get(`http://localhost:8080/api/cart/${userId.value}`)
      gameList.value = cartRes.data.map(item => ({
        gameId: item.gameId,
        name: item.name,
        coverImageUrl: item.coverImageUrl,
        price: item.price,
        originalPrice: item.price, // 預設原價與售價相同
        discountRate: 0 // 預設沒打折
      }))

      // 查詢所有遊戲的促銷狀態，若有折扣則更新折扣資料
      for (const item of gameList.value) {
        try {
          const promoRes = await axios.get(`http://localhost:8080/api/promotions/status/${item.gameId}`)
          const promo = promoRes.data
          if (promo.onSale) {
            item.originalPrice = item.price
            item.price = Math.floor(promo.discountedPrice)
            item.discountRate = Math.floor(promo.discountRate * 100)
          }
        } catch (e) {
          console.warn(`❌ 查詢促銷失敗 - 遊戲ID ${item.gameId}`, e)
        }
      }

      total.value = gameList.value.reduce((sum, item) => sum + item.price, 0)
    } catch (e) {
      console.error('❌ 無法載入購物車資料', e)
      gameList.value = []
      total.value = 0
    }
  }
})




</script>





<style scoped>
.checkout-container {
  height: 100%;
  min-height: 75vh;
}

.checkout-wrapper {
  width: 1050px;
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

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.7rem;
}

</style>


