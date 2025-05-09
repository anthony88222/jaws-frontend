<template>
  <section class="hero-carousel">
    <transition-group name="fade" tag="div">
      <div
        class="hero-slide"
        v-for="(item, index) in items"
        :key="index"
        v-show="index === current"
        :style="{ backgroundImage: `url(${item.bg})` }"
      >
        <div class="overlay"></div>
        <div class="hero-content">
          <h1>{{ item.title }}</h1>
          <a @click.prevent="router.push('/games')" class="btn-neon">立即探索</a>
        </div>
        <button class="carousel-btn left" @click="prevSlide">‹</button>
        <button class="carousel-btn right" @click="nextSlide">›</button>
      </div>
    </transition-group>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = [
  {
    title: 'JAWS 精選',
    bg: 'https://media.steelseriescdn.com/thumbs/filer_public/8c/ee/8cee8334-eb5e-482e-a194-03fbcafeea68/hero_cp2077_desktop_v3.png__540x540_crop-scale_optimize_subsampling-2.png'
  },
  {
    title: '晉見艾爾登之王',
    bg: 'https://www.microcharon.com/usr/uploads/2022/10/1790587180.webp'
  },
  {
    title: '沉浸魔法世界',
    bg: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1CnF2m.img?w=2200&h=1100&m=4&q=79'
  }
]

const current = ref(0)
let timer = null

const nextSlide = () => {
  current.value = (current.value + 1) % items.length
}
const prevSlide = () => {
  current.value = (current.value - 1 + items.length) % items.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 5000) // 每 5 秒輪播一次
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  height: 40vh;
  overflow: hidden;
  box-shadow: 0 0 20px var(--color-primary);
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 1s ease;
  color: var(--color-text);
}

.overlay {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-slide h1 {
  font-size: 3rem;
  color: var(--color-secondary);
  text-shadow: 0 0 10px var(--color-secondary);
  margin-bottom: 1rem;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  background: transparent;
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  z-index: 2;
  padding: 0 1rem;
}

.carousel-btn.left {
  left: 0;
}

.carousel-btn.right {
  right: 0;
}

/* 過場動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
