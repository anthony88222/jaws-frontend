<template>
  <div class="game-display-wrapper">
    <!-- 左側上下頁按鈕 -->
    <button class="nav-arrow left" @click="prevPage" :disabled="currentPage === 0">‹</button>

    <div class="game-display">
      <!-- 遊戲清單 -->
      <div class="game-list">
        <!-- ✅ 排序選單放置這裡 -->
        <div class="sort-bar">
          <label for="sortSelect">排序：</label>
          <select id="sortSelect" v-model="sortOption">
            <option value="default">---------------------</option>
            <option value="priceAsc">價格：由低到高</option>
            <option value="priceDesc">價格：由高到低</option>
            <option value="discountDesc">折扣：由高到低</option>
          </select>
        </div>

        <div
          v-for="game in pagedGames"
          :key="game.id"
          class="game-item"
          :class="{ selected: game.id === selectedGame.id }"
          @mouseenter="selectGame(game)"
          @click="goToGamePage(game.id)"
        >
          <img :src="game.cover" alt="cover" class="game-cover" />
          <div class="info-section">
            <h3 class="game-title">{{ game.name }}</h3>
            <div class="tag-row">
              <span v-for="(tag, idx) in game.tags" :key="idx" class="tag">{{ tag }}</span>
              <p class="game-description">{{ game.description }}</p>
            </div>
          </div>
          <div class="price-section">
            <span v-if="game.discount > 0" class="discount-badge">-{{ game.discount }}%</span>
            <div class="price-block">
              <span v-if="game.discount > 0" class="price-original">NT${{ game.price }}</span>
              <span class="price-final">NT${{ game.finalPrice }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 遊戲預覽 + 評價 -->
      <div class="game-review" v-if="selectedGame.id">
        <div class="review-summary">
          <h3>整體使用者評論：</h3>
          <div class="rating-display">
            <span class="avg">{{ ratingSummary.averageRating.toFixed(1) }}</span>
            <span class="stars">
              <span
                v-for="n in 5"
                :key="n"
                class="star"
                :class="{ full: n <= Math.floor(ratingSummary.averageRating) }"
              >★</span>
            </span>
            <span class="count">({{ ratingSummary.totalReviews.toLocaleString() }})</span>
          </div>
        </div>
        <transition name="fade-preview" mode="out-in">
          <div class="preview-list" :key="selectedGame.id">
            <img
              v-for="(img, idx) in previewImages.slice(0, 4)"
              :key="img"
              :src="img"
              class="preview-img"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- 右側上下頁按鈕 -->
    <button class="nav-arrow right" @click="nextPage" :disabled="endIndex >= allGames.length">›</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HotNewReleases',
  data() {
    return {
      allGames: [],
      selectedGame: {},
      ratingSummary: { totalReviews: 0, averageRating: 0 },
      previewImages: [],
      currentPage: 0,
      pageSize: 8,
      sortOption: 'default',
    };
  },
  computed: {
  startIndex() {
    return this.currentPage * this.pageSize;
  },
  endIndex() {
    return this.startIndex + this.pageSize;
  },
    sortedGames() {
      return this.allGames
        .filter(g => g.discount > 0)
        .sort((a, b) => {
          if (this.sortOption === 'priceAsc') return a.finalPrice - b.finalPrice;
          if (this.sortOption === 'priceDesc') return b.finalPrice - a.finalPrice;
          if (this.sortOption === 'discountDesc') return b.discount - a.discount;
          return 0; // default
        });
    },
    pagedGames() {
      // 確保 computed 追蹤 sortedGames 的結果
      const start = this.startIndex;
      const end = this.endIndex;
      return this.sortedGames.slice(start, end);
    }
  },
  async mounted() {
    await this.fetchGames();
    if (this.pagedGames.length) this.selectGame(this.pagedGames[0]);
  },
  watch: {
    selectedGame(newGame) {
      if (newGame?.id) {
        this.fetchRatingSummary(newGame.id);
        this.fetchPreviewImages(newGame.id);
      }
    },
  },
  methods: {
    async fetchGames() {
      try {
        const { data } = await axios.get('http://localhost:8080/api/games/game');
        const gameArray = Array.isArray(data) ? data : data.games || [];

        const mapped = await Promise.all(
          gameArray.map(async (g) => {
            let discount = 0;
            let finalPrice = g.price;

            try {
              const { data: promo } = await axios.get(
                `http://localhost:8080/api/promotions/status/${g.id}`
              );
              if (promo.onSale) {
                discount = Math.round(promo.discountRate * 100);
                finalPrice = Math.floor(promo.discountedPrice);
              }
            } catch (err) {
              console.warn(`查折扣失敗 (gameId=${g.id})`, err);
            }

            return {
              id: g.id,
              name: g.name,
              description: g.description,
              tags: g.categories?.map(c => c.name) || [],
              price: g.price,
              discount,
              finalPrice,
              cover: g.coverImageUrl,
            };
          })
        );

        this.allGames = mapped;
        if (this.pagedGames.length) this.selectGame(this.pagedGames[0]);
      } catch (e) {
        console.error('載入遊戲列表失敗：', e);
      }
    },

    selectGame(game) {
      this.selectedGame = game;
    },

    async fetchRatingSummary(gameId) {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/games/${gameId}/rating-summary`);
        this.ratingSummary = data;
      } catch (err) {
        console.error('載入評分摘要失敗：', err);
        this.ratingSummary = { totalReviews: 0, averageRating: 0 };
      }
    },

    async fetchPreviewImages(gameId) {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/games/${gameId}`);
        this.previewImages = data.previewImages || [];
      } catch (err) {
        console.error('載入預覽圖失敗：', err);
        this.previewImages = [];
      }
    },

    goToGamePage(gameId) {
      this.$router.push({ name: 'gamepage', params: { gameId } });
    },

    nextPage() {
      if (this.endIndex < this.allGames.length) {
        this.currentPage++;
        this.selectGame(this.pagedGames[0]);
      }
    },

    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.selectGame(this.pagedGames[0]);
      }
    },
  },
};
</script>

<style scoped>
.game-display-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-arrow {
  font-size: 3rem;
  color: var(--color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  z-index: 10;
  height: 100%;
  width: 40px;
}

.nav-arrow.left {
  position: absolute;
  left: -30px;
}

.nav-arrow.right {
  position: absolute;
  right: -30px;
}

.game-display {
  display: flex;
  gap: 1.5rem;
  width: 1080px;
  padding: 1.5rem;
  color: var(--color-text);
  font-family: var(--font-family);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px var(--color-primary);
  background: #00000050;
}

.game-list {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.game-item {
  display: flex;
  align-items: center;
  background: hsl(212, 55%, 15%);
  padding-right: 0.75rem;
  cursor: pointer;
  transition: 0.25s;
  height: 115px;
  border: var(--color-primary) 2px solid;
  box-shadow: 0 0 10px var(--color-primary);
  border-radius: 6px;
}
.game-item:hover,
.game-item.selected {
  border-color: var(--color-primary);
  background: rgb(79, 123, 147);
}
.game-cover {
  width: 210px;
  object-fit: cover;
  flex-shrink: 0;
}
.info-section {
  flex: 1;
  margin-left: 0.5rem;
  margin-top: 0.2rem;
  overflow: hidden;
  height: 100%;
}
.game-title {
  font-size: 1rem;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  margin: 0 0 2px 0;
}
.game-description {
  font-size: 0.75rem;
  color: #c5d1e0;
  margin: 2px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tag-row {
  font-size: 0.75rem;
  color: #9eb0c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  margin-top: 7px;
}
.tag {
  display: inline-block;
  padding: 2px 6px;
  margin-right: 4px;
  font-size: 0.65rem;
  border-radius: 3px;
  background-color: #454547;
  color: #ccc;
}
.price-section {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  margin-left: auto;
}
.discount-badge {
  background: #4a772f;
  color: #bfff00;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 2px;
}
.price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px;
}
.price-original {
  font-size: 0.65rem;
  text-decoration: line-through;
}
.price-final {
  font-size: 0.90rem;
  font-weight: bold;
  color: #bfff00;
}
.game-review {
  width: 34%;
  display: flex;
  flex-direction: column;
  border: var(--color-primary) 2px solid;
  background-color: rgb(79, 123, 147);
  box-shadow: 0 0 10px var(--color-primary);
  margin-left: 0.8rem ;
  border-radius: 6px;
}
.review-summary h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ccc;
  margin: 0;
  text-align: left;
}
.review-summary {
  font-size: 0.9rem;
  padding: 0.5rem;
  margin: 1rem;
  color: var(--color-primary);
  background-color: hsl(210, 47%, 27%);
  border-radius: 6px;
  width: 85%;
}
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 0.5rem;
}
.preview-img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
  max-height: 198px;
  animation: fadeIn 0.5s ease-in-out;
}
.rating-display {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 500;
  color: #ccc;
}
.rating-display .avg {
  font-size: 1rem;
  color: #fff;
}
.rating-display .stars {
  display: flex;
  font-size: 1rem;
  color: #999;
}
.rating-display .star {
  color: #666;
}
.rating-display .star.full {
  color: #ffc107;
}

.fade-preview-enter-active,
.fade-preview-leave-active {
  transition: opacity 1ms ease;
}
.fade-preview-enter-from,
.fade-preview-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0.3;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ccc;
  margin: 0.2rem 0 0.6rem 0;
  padding-left: 0.5rem;
}
.sort-bar select {
  padding: 4px 8px;
  background-color: #1e1e2f;
  color: #ccc;
  border: 1px solid var(--color-primary);
  border-radius: 4px;
}

</style>
