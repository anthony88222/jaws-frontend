<template>
  <div class="game-page-container">
    <div v-if="loading" class="text-center py-8">載入中…</div>
    <div v-else>
      <section class="game-hero-carousel">
        <div class="carousel-wrapper-vertical">
          <div class="main-image-container" v-if="screenshots.length > 0">
            <img :src="screenshots[currentIndex]" alt="遊戲封面" class="carousel-image" />
          </div>
          <div class="thumbnail-scroll-wrapper">
            <button class="scroll-btn left" @click="changeImage('left')">◀</button>
            <div class="thumbnail-list" ref="thumbnailList">
              <div v-for="(img, index) in screenshots" :key="index" class="thumbnail-item"
                :class="{ active: currentIndex === index }"
                @click="currentIndex = index; nextTick(() => scrollToThumbnail(index))">
                <img :src="img" :alt="`縮圖${index}`" />
              </div>
            </div>
            <button class="scroll-btn right" @click="changeImage('right')">▶</button>
          </div>
        </div>

        <div class="game-info right-info">
          <img class="hero-cover" :src="game.coverImageUrl" :alt="game.name" />
          <h1 class="game-title">{{ game.name }}</h1>
          <p class="game-description">{{ game.description }}</p>
          <ul class="meta-info">
            <li>平均評分：
              <span class="stars">
                <span v-for="n in 5" :key="n">
                  <i v-if="n <= Math.round(averageRating)" class="filled-star">★</i>
                  <i v-else class="empty-star">☆</i>
                </span>
                ({{ averageRating }}/5)
              </span>
            </li>
            <li>評論數：<span class="highlight">{{ game.reviews.length }} 則</span></li>
            <li>分類：
              <span class="tag" v-for="cat in categories" :key="cat.id">{{ cat.name }}</span>
            </li>

            <li class="price-box">價格：
              <template v-if="promotionStatus.onSale">
                <span class="discount-tag">
                  -{{ Math.round(promotionStatus.discountRate * 100) }}%
                </span>
                <span class="original-price">
                  NT$ {{ game.price }}
                </span>
                <span class="final-price green">
                  NT$ {{ Math.floor(promotionStatus.discountedPrice) }}
                </span>
              </template>
              <template v-else>
                <span class="final-price white">
                  NT$ {{ game.price }}
                </span>
              </template>
            </li>
          </ul>
          <button class="cart-btn" @click="addToCart">加入購物車</button>
          <button class="wishlist-btn" @click="addToWishlist">
            {{ inWishlist ? '已加入願望清單' : '加入願望清單' }}
          </button>
        </div>
      </section>

      <section class="related-games">
        <h2 class="section-title">相似遊戲</h2>
        <div class="thumbnail-list">
          <div v-for="related in relatedGames" :key="related.id" class="thumbnail-item"
            @click="goToGamePage(related.id)">
            <img :src="related.coverImageUrl" :alt="related.name" />
          </div>
        </div>
      </section>

      <section class="game-description-box">
        <h2 class="section-title">遊戲介紹</h2>
        <p class="game-description-full">{{ game.description }}</p>
      </section>

      <section class="user-review">
        <h2 class="section-title">我要評論</h2>
        <textarea v-model="newComment" rows="5" placeholder="輸入您的評論..." class="comment-box" />
        <div class="rate-group">
          <label>評分：</label>
          <span v-for="n in 5" :key="n" class="rating-star" @click="newRate = n">
            <i :class="n <= newRate ? 'filled-star' : 'empty-star'">★</i>
          </span>
          ({{ newRate }}/5)
        </div>
        <button class="cart-btn" @click="submitReview" :disabled="submitting">
          {{ submitting ? '送出中...' : '送出評論' }}
        </button>
      </section>

      <section class="edition-section">
        <h2 class="section-title">玩家評論</h2>
        <ul>
          <li v-for="review in sortedReviews" :key="review.id" class="review-item">
            <strong>{{ review.username }}</strong>：
            <div class="stars-with-score">
              <div class="stars">
                <span v-for="n in 5" :key="n">
                  <i v-if="n <= Math.round(review.rate)" class="filled-star">★</i>
                  <i v-else class="empty-star">☆</i>
                </span>
              </div>
              <span class="score-text">({{ review.rate }}/5)</span>
            </div>
            {{ review.comment }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const gameId = ref(Number(route.params.gameId));
const loading = ref(true);
const submitting = ref(false);
const newComment = ref('');
const newRate = ref(5);
const game = ref({ reviews: [], });
const averageRating = ref(0);
const ratingSummary = ref({ averageRating: 0, totalReviews: 0 });
const screenshots = ref([]);
const currentIndex = ref(0);
const categories = ref([]);
const relatedGames = ref([]);
const thumbnailList = ref(null);
const inWishlist = ref(false); // 假設有一個狀態來判斷是否在願望清單中

const promotionStatus = ref({
  gameId: 0,
  discountRate: 0,
  finalPrice: 0,
  originalPrice: 0,
  isPromoted: false,
});


const sortedReviews = computed(() => {
  return game.value.reviews;
});

const fetchGameDetail = async () => {
  try {
    const res = await axios.get(`/api/games/${gameId.value}`);
    game.value = res.data;

    const previewRes = await axios.get(`/api/games/${gameId.value}/previews`);
    const previews = previewRes.data.map(p => p.imageUrl);
    screenshots.value = previews;
  } catch (err) {
    console.error('取得遊戲細節失敗', err);
  } finally {
    loading.value = false;
  }
};

const fetchRatingSummary = async () => {
  try {
    const res = await axios.get(`/api/games/${gameId.value}/rating-summary`);
    ratingSummary.value = res.data;
    averageRating.value = ratingSummary.value.averageRating;
  } catch (err) {
    console.error('取得評分摘要失敗', err);
  }
};

const fetchCategories = async () => {
  try {
    const res = await axios.get(`/api/games/${gameId.value}/categories`);
    categories.value = res.data;
  } catch (err) {
    console.error('取得分類失敗', err);
  }
};

const fetchRelatedGames = async () => {
  try {
    const res = await axios.get(`/api/games/${gameId.value}/related-games`);
    relatedGames.value = res.data;
  } catch (err) {
    console.error('取得相似遊戲失敗', err);
  }
};

const fetchPromotionStatus = async () => {
  try {
    const res = await axios.get(`/api/promotions/status/${gameId.value}`);
    console.log('促銷狀態:', res.data);
    promotionStatus.value = res.data;
  } catch (err) {
    console.warn('無促銷活動或讀取失敗', err);
  }
};

function goToGamePage(targetId) {
  if (targetId !== gameId.value) {
    router.push(`/gamepage/${targetId}`);
  }
}

async function submitReview() {
  if (!newComment.value || newRate.value <= 0) {
    alert('請填寫完整評論與正確分數');
    return;
  }

  if (!authStore.token) {
    alert('請先登入才能發表評論');
    router.push('/login');
    return;
  }

  submitting.value = true;

  try {
    console.log(gameId.value)
    await axios.post(
      `/api/reviews/game/${gameId.value}`,
      {
        // gameId: gameId.value,
        userId: authStore.user?.id,   // ✅ 補上這個
        rate: newRate.value,
        comment: newComment.value
      },
    );

    await fetchGameDetail(); // 新增成功後重新載入評論
    newComment.value = '';
    newRate.value = 5;
    alert('評論已成功發表！');
  } catch (err) {
    const message = err?.response?.data?.message || '新增評論失敗';
    alert(message);
  } finally {
    submitting.value = false;
  }
}

async function addToCart() {
  const userId = authStore.user?.id;
  if (!userId) {
    alert('請先登入才能加入購物車');
    router.push('/login');
    return;
  }
  try {
    await axios.post(`/api/cart/${userId}/add/${game.value.id}`);
    alert('成功加入購物車！');
  } catch (err) {
    console.error('加入購物車失敗', err);
    alert('加入購物車失敗');
  }
}

async function clearCart() {
  const userId = authStore.user?.id;
  if (!userId) {
    alert('請先登入才能清空購物車');
    router.push('/login');
    return;
  }
  try {
    await axios.delete(`/api/cart/${userId}/clear`);
    alert('已清空購物車！');
  } catch (err) {
    console.error('清空購物車失敗', err);
    alert('清空購物車失敗');
  }
}

function changeImage(direction) {
  if (direction === 'left') {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  } else {
    if (currentIndex.value < screenshots.value.length - 1) {
      currentIndex.value++;
    }
  }
  nextTick(() => scrollToThumbnail(currentIndex.value));
}

function scrollToThumbnail(index) {
  const container = thumbnailList.value;
  const item = container?.children[index];
  if (item && container) {
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const isOutOfViewLeft = itemRect.left < containerRect.left;
    const isOutOfViewRight = itemRect.right > containerRect.right;
    if (isOutOfViewLeft || isOutOfViewRight) {
      const scrollAmount = item.offsetLeft - container.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}

async function addToWishlist() {
  const userId = authStore.user?.id;
  if (!userId) {
    alert('請先登入才能加入願望清單');
    router.push('/login');
    return;
  }
  try {
    await axios.post(`/api/wishlist/${userId}/add/${game.value.id}`);
    alert('已加入願望清單！');
    inWishlist.value = true;
    localStorage.setItem(`wishlist-${game.value.id}`, 'true');
  } catch (err) {
    console.error('加入願望清單失敗', err);
    alert('加入願望清單失敗');
  }
}

onMounted(async () => {
  loading.value = true;
  await fetchGameDetail();
  await fetchRatingSummary();
  await fetchCategories();
  await fetchRelatedGames();
  await fetchPromotionStatus();
  loading.value = false;
  const stored = localStorage.getItem(`wishlist-${gameId.value}`);
  inWishlist.value = stored === 'true';
});

watch(() => route.params.gameId, async newVal => {
  gameId.value = Number(newVal);
  loading.value = true;
  await fetchGameDetail();
  await fetchRatingSummary();
  await fetchCategories();
  await fetchRelatedGames();
  await fetchPromotionStatus(); // << 加這行
  currentIndex.value = 0;
  loading.value = false;
});
</script>

<style scoped>
/* 新增的介紹區塊樣式 */
.game-description-box {
  background: linear-gradient(135deg, #0e1628, #1e0040);
  border: 1px solid var(--color-primary);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 12px var(--color-primary);
  margin: 2rem 0;
}

.game-description-full {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.6;
}

.comment-box {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #555;
  resize: vertical;
  margin-bottom: 1rem;
}

.edition-row-section {
  margin-top: 3rem;
}

.edition-row-horizontal {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.edition-card-horizontal {
  flex: 1;
  min-width: 280px;
  background: #1a1c2e;
  border: 1px solid var(--color-primary);
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  box-shadow: 0 0 12px var(--color-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:root {
  --color-primary: #00fff7;
  --color-secondary: #ff00ff;
}

:root {
  --color-primary: #00fff7;
  --color-secondary: #ff00ff;
}

/* 基本容器 */
.game-page-container {
  padding: 2rem;
  /* font-family: 'Orbitron', sans-serif; */
  color: #e0e0e0;
}

/* Hero 區塊 */
.game-hero-carousel {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  background: linear-gradient(135deg, #080b17, #230034);
  border: 2px solid var(--color-primary);
  border-radius: 1rem;
  box-shadow: 0 0 10px var(--color-primary);
  padding: 2rem;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 左側圖片上下結構 */
.carousel-wrapper-vertical {
  display: flex;
  flex-direction: column;
  width: 640px;
}

.main-image-container {
  width: 100%;
  height: 360px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 8px var(--color-primary);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

/* 修正縮圖滾動問題 */
.thumbnail-list {
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  height: 60px;
  padding-bottom: 6px;
  margin-bottom: 8px;
  scroll-behavior: smooth;
}

.thumbnail-item {
  width: 100px;
  height: 56px;
  border: 2px solid transparent;
  border-radius: 0.4rem;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.thumbnail-item:hover {
  transform: scale(1.05);
  border-color: #00ccff;
}

.thumbnail-item.active {
  border-color: var(--color-secondary);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list::-webkit-scrollbar {
  height: 6px;
  /* 隱藏滾動條 */
}

.thumbnail-list::-webkit-scrollbar-thumb {
  background: #00ccff;
  /* 滾動條顏色 */
  border-radius: 3px;
  /* 滾動條圓角 */
}

.thumbnail-list::-webkit-scrollbar-track {
  background: transparent;
  /* 滾動條背景顏色 */
}

.thumbnail-scroll-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
}

.scroll-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: #7ddafc;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 6px 10px;
  border-radius: 4px;
  z-index: 1;
  height: 60px;
}

.scroll-btn.left {
  margin-right: 6px;
}

.scroll-btn.right {
  margin-left: 6px;
}

/* 右側資訊 */
.right-info {
  width: 320px;
  display: flex;
  flex-direction: column;
}

.hero-cover {
  width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 0 12px var(--color-primary);
}

.game-title {
  /* color: var(--color-secondary); */
  font-size: 2rem;
  margin: 0.7rem;
  color: white;
  text-decoration: none;
  /* text-shadow: 0 0 10px var(white); */
}

.game-description {
  font-size: 0.95rem;
  color: #bbb;
  margin-bottom: 1rem;
}

.meta-info {
  list-style: none;
  padding: 0;
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.meta-info .highlight {
  color: var(--color-primary);
  font-weight: bold;
}

.tag {
  /* background: #1f1f2e; */
  border: 1px solid rgb(218, 208, 208);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.72rem;
  color: rgb(218, 208, 208);
  white-space: nowrap;
  margin-right: 0.3rem;
}

.buy-btn {
  background-color: var(--color-secondary);
  border-radius: 1rem;
  color: white;
  font-weight: bold;
}

/* 遊戲版本 */
.edition-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 4px var(white);
}

.edition-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1c2e;
  border: 1px solid var(--color-primary);
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 12px var(--color-primary);
}

.edition-left {
  flex: 1;
}

.edition-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-direction: row;
}

.edition-name {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.edition-desc {
  font-size: 0.95rem;
  color: #aaa;
}

.edition-price {
  text-align: right;
  font-size: 1.1rem;
}

.edition-price .original {
  text-decoration: line-through;
  margin-right: 0.5rem;
  color: #666;
}

/* ===== 新增區塊：價格樣式依折扣變色 ===== */
.price-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
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
}

.final-price.green {
  color: #bfff00;
  text-shadow: 0 0 6px #bfff00;
}

.final-price.white {
  color: #ffffff;
  text-shadow: 0 0 6px var(--color-primary);
}

.original-price {
  text-decoration: line-through;
  color: #bbb;
  font-size: 0.9rem;
}

.final-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #bfff00;
  text-shadow: 0 0 6px #bfff00;
}

/* 加入購物車按鈕 */
.cart-btn {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  text-shadow: 0 0 4px var(--color-primary);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.cart-btn:hover {
  background-color: var(--color-primary);
  color: #000;
  box-shadow: 0 0 12px var(--color-primary);
}

.stars-with-score {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.stars {
  color: gold;
  font-size: 1.2rem;
}

.filled-star {
  color: gold;
}

.empty-star {
  color: lightgray;
}

.score-text {
  color: #ccc;
  font-size: 1rem;
}

.review-container {
  border: 1px solid var(--color-primary);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px var(--color-primary);
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.review-box {
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}

.review-box:last-child {
  border-bottom: none;
}

.review-item {
  margin-bottom: 1.5rem;
  /* 加大間距 */
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  /* 可以讓每則評論更分明 */
}


.comment-text {
  margin-top: 0.5rem;
  color: #ddd;
}

.cart-btn.danger {
  background-color: transparent;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  margin-left: 10px;
  transition: all 0.3s ease;
}

.cart-btn.danger:hover {
  background-color: #ff4d4f;
  color: white;
}


/* 加入購物車按鈕 */
.wishlist-btn {
  background: transparent;
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  /* text-shadow: 0 0 4px var(--color-secondary); */
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.wishlist-btn:hover {
  background-color: var(--color-secondary);
  color: #000;
  box-shadow: 0 0 12px var(--color-secondary);
}
</style>