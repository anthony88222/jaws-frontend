<template>
  <div class="game-card">
    <router-link :to="{ name: 'GamePage', params: { gameId: game.id } }">
      <img :src="game.coverImageUrl" alt="Game Cover" />
      <!-- 把名稱放到上方 -->
      <h3>{{ game.name }}</h3>
      <!-- 價格區塊放下面 -->
      <div class="price-info">
        <template v-if="promotion && promotion.onSale">
          <span class="discount-tag">-{{ Math.round(promotion.discountRate * 100) }}%</span>
          <span class="original-price">NT$ {{ game.price }}</span>
          <span class="final-price">NT$ {{ Math.round(promotion.discountedPrice) }}</span>
        </template>
        <template v-else>
          <span class="no-discount-price">NT$ {{ game.price }}</span>
        </template>
      </div>
    </router-link>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps(['game'])

const promotion = ref({
  onSale: false,
  discountedPrice: null,
  discountRate: null,
})

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/promotions/status/${props.game.id}`)
    promotion.value = res.data
  } catch (err) {
    console.warn('促銷查詢失敗', err)
  }
})
</script>


<style scoped>
.game-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;
  /* font-family: Arial, Helvetica, sans-serif; ⬅️ 改成一般字型  */
  text-shadow: 0 0 6px rgba(0, 255, 255, 0.4);
}

.game-card:hover h3 {
  color: #00ffff;
  text-shadow: 0 0 12px #00ffff;
  transform: scale(1.05);
}

.price-info {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  align-items: center;
  padding: 0.3rem 0.5rem;
}

.discounted-price {
  color: #bfff00;
  font-size: 1rem;
  text-shadow: 0 0 4px #bfff00;
}

.discount-tag {
  background-color: #4a772f;
  color: #bfff00;
  font-weight: bold;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.85rem;
}

.final-price {
  color: #bfff00;
  font-weight: bold;
}

.no-discount-price {
  font-weight: bold;
  color: white; /* 白色顯示 */
  font-size: 1rem;
}
</style>