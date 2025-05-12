<template>
    <div class="checkout-container">
      <h2>結帳頁面</h2>
  
      <p>目前可用遊戲幣：{{ walletBalance }} 元</p>
  
      <!-- 支付方式選擇 -->
      <div class="payment-method">
        <label>
          <input type="radio" value="1" v-model.number="paymentType" /> 綠界付款
        </label>
        <label>
          <input type="radio" value="2" v-model.number="paymentType" /> 全額使用遊戲幣
        </label>
        <label>
          <input type="radio" value="3" v-model.number="paymentType" /> 混合支付
        </label>
      </div>
  
      <!-- 混合支付時顯示遊戲幣輸入 -->
      <div v-if="Number(paymentType) === 3">
        <label>
          使用遊戲幣金額：
          <input type="number" v-model.number="walletUsed" />
        </label>
        <p>剩餘需綠界支付：{{ remainingToPay }} 元</p>
      </div>
  
      <p>訂單總金額：{{ total }} 元</p>
  
      <button :disabled="!canSubmit" @click="submitOrder">提交訂單</button>
  
      <!-- 綠界表單 HTML -->
      <div v-if="ecpayForm" v-html="ecpayForm"></div>
  
      <!-- ✅ Loading 動畫遮罩 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">付款處理中...</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { useAuthStore } from '@/stores/authStore'
  
  export default {
    name: 'CheckoutView',
    data() {
      const authStore = useAuthStore()
      return {
        userId: authStore.user?.id ?? 1,
        total: 0,
        walletBalance: 0,
        paymentType: 1,
        walletUsed: 0,
        ecpayForm: '',
        isLoading: false
      }
    },
    computed: {
      remainingToPay() {
        return Math.max(this.total - this.walletUsed, 0)
      },
      canSubmit() {
        if (this.paymentType === 2) {
          return this.walletBalance >= this.total
        }
        if (this.paymentType === 3) {
          return (
            this.walletUsed > 0 &&
            this.walletUsed <= this.walletBalance &&
            this.walletUsed < this.total
          )
        }
        return true
      }
    },
    watch: {
      walletUsed(val) {
        if (val >= this.total && this.walletBalance >= this.total) {
          this.paymentType = 2
          this.walletUsed = this.total
        } else if (val > 0 && val < this.total) {
          this.paymentType = 3
        }
      }
    },
    mounted() {
      const orderId = this.$route.query.orderId
      if (orderId) {
        // ✅ 歷史訂單付款流程
        axios
          .get(`http://localhost:8080/order/${orderId}`)
          .then((res) => {
            const order = res.data
            this.userId = order.userId
            this.total = order.total
            return axios.get(`http://localhost:8080/api/user/${this.userId}`)
          })
          .then((res) => {
            this.walletBalance = res.data.walletBalance
          })
          .catch((err) => {
            console.error('❌ 查詢訂單或使用者錢包失敗', err)
            alert('❌ 無法載入訂單資料')
            this.$router.push('/order-history')
          })
      } else {
        // ✅ 購物車結帳流程
        this.total = parseInt(this.$route.query.total || 0)
        axios
          .get(`http://localhost:8080/api/user/${this.userId}`)
          .then((res) => {
            this.walletBalance = res.data.walletBalance
          })
          .catch((err) => {
            console.error('❌ 取得使用者錢包失敗', err)
            this.walletBalance = 0
          })
      }
    },
    methods: {
      async submitOrder() {
        this.isLoading = true
        try {
          const payload = {
            userId: this.userId,
            paymentType: this.paymentType,
            walletUsed:
              this.paymentType === 3 || this.paymentType === 2
                ? this.walletUsed
                : 0
          }
  
          const orderId = this.$route.query.orderId
          let response
  
          if (orderId) {
            // ✅ 再次付款 API
            response = await axios.post(
              `http://localhost:8080/order/pay-again`,
              payload,
              { params: { orderId } }
            )
          } else {
            // ✅ 建立新訂單
            response = await axios.post(
              `http://localhost:8080/order/create`,
              payload
            )
          }
  
          if (response.data.ecpayHtmlForm) {
            this.ecpayForm = response.data.ecpayHtmlForm
            this.$nextTick(() => {
              const div = document.createElement('div')
              div.innerHTML = this.ecpayForm
              const form = div.querySelector('form')
              if (form) {
                document.body.appendChild(form)
                form.submit()
              } else {
                alert('❌ 綠界表單產生失敗')
                this.isLoading = false
              }
            })
          } else {
            alert('✅ 付款完成')
            this.$router.push('/library')
          }
        } catch (err) {
          console.error(err)
          const errorMsg = err?.response?.data?.message?.includes('購物車')
            ? '❌ 您的購物車是空的，請先加入遊戲再結帳！'
            : err?.response?.data?.message || '❌ 付款失敗，請稍後再試'
          alert(errorMsg)
          this.$router.push('/order-history')
        } finally {
          this.isLoading = false
        }
      }
    }
  }
  </script>
  

  
  <style scoped>
  .checkout-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
  }
  .payment-method {
    margin-bottom: 16px;
  }
  button {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* ✅ loading 遮罩樣式 */
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
  