<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const userId = 1  // 假設目前登入的userId是1
const reviews = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`/api/reviews/user/${userId}`)
    reviews.value = res.data
  } catch (err) {
    console.error('查詢使用者評論失敗', err)
    error.value = err.response?.data || '查詢失敗'
  }
})
</script>

<template>
  <div>
    <h1>我的評論</h1>

    <div v-if="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <ul>
        <li v-for="review in reviews" :key="review.gameId">
          遊戲：{{ review.gameName }}，評分：{{ review.rate }}，評論：{{ review.comment }}
        </li>
      </ul>
    </div>
  </div>
</template>
