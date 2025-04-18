<template>
    <div class="layout">
  
      <main class="container">
        <section class="cart-section text-center mt-2">
          <h1 class="cart-title">SHOPPING CART</h1>
  
          <div v-if="cart.length === 0" class="empty-cart">
            <p class="text-lg text-gray-400">您的購物車目前是空的。</p>
          </div>
  
          <div v-else class="cart-box">
            <div class="cart-item" v-for="item in cart" :key="item.id">
              <img class="item-image" :src="item.image" :alt="item.name" />
              <div class="item-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">${{ item.price }}</p>
              </div>
              <button class="btn-remove" @click="removeFromCart(item.id)">Remove</button>
            </div>
  
            <div class="cart-summary">
              <p>Total: ${{ totalPrice }}</p>
              <button class="btn-neon checkout-btn">CHECKOUT</button>
            </div>
          </div>
        </section>
      </main>
  
    </div>
  </template>
  
  <script setup>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import { ref, computed } from 'vue';
  
  const cart = ref([
    { id: 1, name: 'Cyberpunk 2077', price: 59.99, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg' },
    { id: 2, name: 'Dark Souls III', price: 29.99, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg' }
  ]);
  
  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  });
  
  function removeFromCart(id) {
    cart.value = cart.value.filter(item => item.id !== id);
  }
  </script>
  
  <style scoped>
  .cart-title {
    font-size: 3rem;
    color: var(--color-secondary);
    text-shadow: 0 0 10px var(--color-secondary);
    margin-bottom: 2rem;
  }
  
  .cart-box {
    border: 2px solid var(--color-primary);
    padding: 2rem;
    border-radius: var(--border-radius);
    width: 60vw; /* ⬅️ 寬度改為畫面寬度 80% */
    margin: 0 auto;
    background-color: #1a1a2a;
    box-shadow: 0 0 15px var(--color-primary);
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-primary);
    padding: 1rem 0;
    gap: 1rem;
  }
  
  .item-image {
    width: 120px;
    height: auto;
    border: 2px solid var(--color-primary);
    border-radius: 4px;
    object-fit: cover;
  }
  
  .item-info {
    flex: 1;
    text-align: left;
    padding-left: 1rem;
  }
  
  .item-name {
    color: var(--color-primary);
    font-size: 1.3rem;
    text-shadow: 0 0 4px var(--color-primary);
  }
  
  .item-price {
    color: var(--color-muted);
  }
  
  .btn-remove {
    border: 1px solid var(--color-secondary);
    background: transparent;
    color: var(--color-secondary);
    padding: 0.5rem 1rem;
    cursor: pointer;
    text-shadow: 0 0 4px var(--color-secondary);
  }
  
  .btn-remove:hover {
    background: var(--color-secondary);
    color: var(--color-bg);
    box-shadow: 0 0 10px var(--color-secondary);
  }
  
  .cart-summary {
    margin-top: 2rem;
    text-align: right;
    font-size: 1.5rem;
    color: var(--color-primary);
    text-shadow: 0 0 6px var(--color-primary);
  }
  
  .checkout-btn {
    background: transparent ;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.75rem 2rem;
    text-shadow: 0 0 6px var(--color-primary);
    transition: var(--transition);
  }
  
  .checkout-btn:hover {
    background: var(--color-primary);
    color: var(--color-bg);
    box-shadow: 0 0 20px var(--color-primary); /* ⬅️ 加入流光效果 */
  }
  </style>