<template>
  <div class="container">
    <div class="cart-wrapper">
      <h1 class="cart-title">SHOPPING CART</h1>

      <div v-if="cart.length === 0" class="empty-cart">
        <p class="text-lg text-gray-400">您的購物車目前是空的。</p>
      </div>

      <div v-else class="cart-list">
        <div class="cart-row" v-for="item in cart" :key="item.id">
          <img class="cart-thumb" :src="item.coverImageUrl" :alt="item.gameName" />
          
          <div class="cart-info">
            <h2 class="game-name">{{ item.gameName }}</h2>
          </div>

          <div class="cart-right">
            <div v-if="promotionMap[item.gameId]?.onSale" class="price-box">
              <div class="discount-tag">-{{ Math.floor(promotionMap[item.gameId].discountRate * 100) }}%</div>
              <div class="price-text">
                <div class="original-price">NT$ {{ item.price }}</div>
                <div class="final-price">NT$ {{ Math.floor(promotionMap[item.gameId].discountedPrice) }}</div>
              </div>
            </div>
            <div v-else class="price-box">
              <div class="price-text">
                <div class="final-price">NT$ {{ item.price }}</div>
              </div>
            </div>

            <div class="cart-actions">
              <button class="remove-btn" @click="removeFromCart(item.gameId)">移除</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <p>Total: NT$ {{ totalPrice }}</p>
          <button class="btn-neon checkout-btn">CHECKOUT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const userId = 1
const cart = ref([])
const promotionMap = ref({})

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => {
    const promo = promotionMap.value[item.gameId]
    const price = promo?.onSale ? promo.discountedPrice : item.price
    return sum + price
  }, 0).toFixed(0)
})

async function fetchCart() {
  const res = await axios.get(`http://localhost:8080/api/cart/${userId}`)
  cart.value = res.data
  await fetchPromotions()
}

async function fetchPromotions() {
  for (const item of cart.value) {
    const res = await axios.get(`http://localhost:8080/api/promotions/status/${item.gameId}`)
    promotionMap.value[item.gameId] = res.data
  }
}

async function removeFromCart(gameId) {
  await axios.delete(`http://localhost:8080/api/cart/${userId}/remove/${gameId}`)
  await fetchCart()
}

onMounted(fetchCart)
</script>

<style scoped>
.container {
  height: 100%;
}
.cart-wrapper {
  width: 1150px;
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background: #1a1a2a;
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  box-sizing: border-box;
}

.cart-title {
  font-size: 2.5rem;
  color: var(--color-secondary);
  text-align: center;
  text-shadow: 0 0 10px var(--color-secondary);
  margin-bottom: 2rem;
  margin-top: 0.5rem;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.cart-row {
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

.cart-thumb {
  width: 220px;
  object-fit: cover;
  border-radius: var(--border-radius);
  flex-shrink: 0;
}

.cart-info {
  flex-grow: 1;
  text-align: left;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cart-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;
}

.game-name {
  color: var(--color-primary);
  text-shadow: 0 0 6px var(--color-primary);
}

.price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
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

.price-text {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.9rem;
}

.final-price {
  /* color: var(--color-primary); */
  font-size: 1rem;
  font-weight: bold;
  /* text-shadow: 0 0 6px var(--color-primary); */
}

.cart-actions {
  text-align: right;
}

.remove-btn {
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-secondary);
  transition: all 0.3s;
  white-space: nowrap;
}

.remove-btn:hover {
  background: var(--color-secondary);
  color: #000;
  box-shadow: 0 0 8px var(--color-secondary);
}

.cart-summary {
  text-align: right;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  /* color: var(--color-primary); */
  /* text-shadow: 0 0 6px var(--color-primary); */
}

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
</style>
