<template>
    <section class="cyber-section">
      <div class="cyber-title">新品與話題商品</div>
      <div class="cyber-content">
        <ul class="game-list">
          <li v-for="game in games" :key="game.id"  @mouseover="updateSpotlight(game)">
            <div class="game-entry" >
              <img :src="game.img" alt="game image" class="game-thumb" />
              <div class="game-info">
                <div class="game-title">
                  <span>{{ game.name }}</span>
                  <span class="discount">-{{ game.discount }}%</span>
                </div>
                <div class="game-desc">{{ game.tags }}</div>
                <div class="game-price">NT$ {{ game.price }}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="spotlight">
          <img :src="spotlight.main" alt="Spotlight Game" class="spotlight-main" />
          <h3>{{ spotlight.name }}</h3>
          <p class="spotlight-desc">{{ spotlight.tags }}</p>
          <div class="spotlight-price">NT$ {{ spotlight.price }}</div>
          <div class="spotlight-previews">
            <img v-for="(img, index) in spotlight.previews" :key="index" :src="img" class="preview-img" />
        </div>
        <div class="spotlight-review">
            <span>整體使用者評論：</span>
            <span class="review-summary">{{ spotlight.reviewSummary }}</span>
            <span class="review-count">（{{ spotlight.reviewCount.toLocaleString() }} 篇評論）</span>
        </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>

  import { ref } from 'vue'
  const games = [
    { id: 1, name: 'Hogwarts Legacy', discount: 50, price: 899, tags: '奇幻冒險、角色扮演、動作', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg' },
    { id: 2, name: 'Eternal Return', discount: 25, price: 246, tags: 'MOBA、沉浸、體驗', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1049590/header.jpg' },
    { id: 3, name: 'Darkest Dungeon', discount: 85, price: 75, tags: '華元冒險、趨振撼、挫宕', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/262060/header.jpg' },
    { id: 4, name: 'No Man\'s Sky', discount: 50, price: 790, tags: '圓柱方目險、視察、冒險', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg' },
    { id: 5, name: 'MANOR LORDS', discount: 15, price: 1049, tags: '策略模擬、早期存取', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1363080/header.jpg' },
  ]
  
  const spotlight = ref({
  name: 'Risk of Rain 2',
  tags: '連軍蓄件、混撼、合-op',
  price: 308,
  main: 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
  previews: [
    'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/ss_df93b5e8a183f7232d68be94ae78920a90de1443.600x338.jpg?t=1743610330',
    'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/ss_94058497bf0f8fabdde17ee8d59bece609a60663.600x338.jpg?t=1743610330',
    'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/ss_8e08976236d29b1897769257ac3c64e9264792a5.600x338.jpg?t=1743610330'
  ],
  reviewSummary: '極度好評',
  reviewCount: 3728
})

function updateSpotlight(game) {
  spotlight.value.name = game.name
  spotlight.value.tags = game.tags
  spotlight.value.price = game.price
  spotlight.value.main = game.img
  spotlight.value.previews = [game.img, game.img, game.img]
  spotlight.value.reviewSummary = '暫無資料'
  spotlight.value.reviewCount = 0
}
  
  </script>
  
  <style scoped>
  .cyber-section {
    padding: 2rem;
    background: #1a1a2a;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    box-shadow: 0 0 20px var(--color-primary);
    font-family: var(--font-family);
  }
  .cyber-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 8px var(--color-secondary);
    color: var(--color-secondary);
  }
  .cyber-content {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .game-list {
    flex: 1;
    min-width: 280px;
    list-style: none;
  }
  .game-list li {
    background: #1a1a2a;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 4px solid var(--color-primary);
    box-shadow: 0 0 6px var(--color-primary);
  }
  .game-list li:hover {
  background: #252540;
  transform: translateX(1px);
  box-shadow: 0 0 10px var(--color-secondary);
}
  .game-entry {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .game-thumb {
    width: 200px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-muted);
    box-shadow: 0 0 4px var(--color-primary);
  }
  .game-info {
    flex: 1;
  }
  .game-title {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }
  .discount {
    color: lime;
  }
  .game-desc,
  .game-price {
    color: var(--color-text);
    font-size: 0.9rem;
  }
  .spotlight {
    flex: 1;
    background: #1f1f2e;
    padding: 1rem;
    border: 2px solid var(--color-secondary);
    border-radius: var(--border-radius);
    box-shadow: 0 0 10px var(--color-secondary);
    text-align: center;
  }
  .spotlight-main {
    width: 100%;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    border: 1px solid var(--color-primary);
  }
  .spotlight-desc {
    color: var(--color-muted);
    margin-bottom: 0.5rem;
  }
  .spotlight-price {
    color: var(--color-text);
    font-weight: bold;
    font-size: 1.2rem;
  }
  .spotlight-previews {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: center;
  }
  .preview-img {
    width: 33%;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-primary);
  }

  .spotlight-review {
  margin-top: 3rem;
  font-size: 0.95rem;
  color: var(--color-text);
}
.review-summary {
  font-weight: bold;
  color: lime;
  margin-left: 0.5rem;
}
.review-count {
  color: #aaa;
  margin-left: 0.3rem;
}

</style>
