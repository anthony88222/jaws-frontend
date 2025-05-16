<template>
  <div class="container">
    <div class="wallet-view">
      <h2>🎮 錢包加值中心</h2>

      <div class="wallet-info">
        <p>目前餘額：<strong>{{ wallet }} 元</strong></p>
        <p class="bonus-hint">💡 每加值滿 1000 元，即送 100 元遊戲幣！</p>
      </div>

      <div class="topup-section">
        <label for="amount">加值金額：</label>
        <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0"
          step="100"
          placeholder="請輸入加值金額"
        />

        <p :class="{ 'dim-text': amount <= 0 }">
          🎁 預計獲得遊戲幣：{{ bonusAmount }} 元
          <span v-if="bonus > 0" class="gift-text">（其中 {{ bonus }} 元為贈送）</span>
        </p>

        <button class="btn-neon" @click="topUpEcpay">立即加值</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const wallet = ref(0)
const amount = ref(0)

// ✅ 新增：計算贈送的部分（滿千送百）
const bonus = computed(() => Math.floor(amount.value / 1000) * 100)

// ✅ 修改：總遊戲幣 = 加值金額 + 贈送
const bonusAmount = computed(() => amount.value + bonus.value)

onMounted(async () => {
  try {
    const res = await axios.get(`/user/${auth.user.id}`)
    wallet.value = typeof res.data.wallet === 'number' ? res.data.wallet : 0
  } catch (error) {
    wallet.value = 0
  }
})

const topUpEcpay = async () => {
  if (amount.value <= 0) return alert('請輸入有效加值金額')

  const res = await axios.post('/wallet/ecpay-form', {
    userId: auth.user.id,
    amount: amount.value
  })

  const formHtml = res.data
  const form = document.createElement('div')
  form.innerHTML = formHtml
  document.body.appendChild(form)
  form.querySelector('form').submit()
}
</script>


<style scoped>
.container {
  height: 75vh;
}

.wallet-view {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1e1e2e;
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  box-shadow: 0 0 20px var(--color-primary);
  color: var(--color-text);
}

.wallet-info {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.bonus-hint {
  font-size: 0.95rem;
  color: var(--color-secondary);
  margin-top: 0.5rem;
}

.topup-section input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-secondary);
}

.dim-text {
  color: #888;
}

.btn-neon {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: var(--color-primary);
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: 10px;
  cursor: pointer;
  text-shadow: 0 0 5px var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary);
  transition: 0.3s;
}

.btn-neon:hover {
  background: var(--color-primary);
  color: #000;
  box-shadow: 0 0 15px var(--color-primary);
}
</style>

