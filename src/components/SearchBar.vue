<template>
    <div class="search-wrapper" ref="wrapRef">
        <!-- 搜尋框 -->
        <input v-model="keyword" @focus="showList = true" @input="handleInput" type="text" placeholder="搜尋遊戲..." />

        <!-- 下拉清單 (v-show) -->
        <ul v-show="showList && results.length" class="result-list">
            <li v-for="g in results" :key="g.id" @click="selectGame(g.id)">
                <img :src="g.coverImageUrl" class="thumb" />
                <span class="title" v-html="highlight(g.name)"></span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const keyword = ref('')
const results = ref([])
const showList = ref(false)
const wrapRef = ref(null)

/* --------  debounce 搜尋 -------- */
let timer = null
function handleInput() {
    clearTimeout(timer)
    timer = setTimeout(search, 300)
}

async function search() {
    const kw = keyword.value.trim()
    if (!kw) { results.value = []; return }

    const { data } = await axios.get('/api/games/search', {
        params: { kw, limit: 8 }
    })
    results.value = data.slice(0, 4)
}

/* -------- 點擊結果 -------- */
function selectGame(id) {
    router.push(`/gamepage/${id}`)
    reset()
}

/* -------- 高亮 -------- */
function highlight(txt) {
    return txt.replace(new RegExp(keyword.value, 'gi'),
        m => `<mark>${m}</mark>`)
}

/* -------- 點擊外部關閉 -------- */
function handleClickOutside(e) {
    if (wrapRef.value && !wrapRef.value.contains(e.target)) {
        reset()
    }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    clearTimeout(timer)
})

function reset() {
    showList.value = false
    results.value = []
    keyword.value = ''
}
</script>

<style scoped>
/* 外層 */
.search-wrapper {
    position: relative;
    width: 250px;
    z-index: 99999;
    margin-right: 1rem;
    padding-right: 1rem;
}

/* 輸入框 */
.search-wrapper input {
    width: 100%;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    background: #353544;
    color: var(--color-primary);
    font-size: 16px;
}

.search-wrapper input:focus {
    outline: none;
    box-shadow: 0 0 12px var(--color-primary)
}

/* ===  清單 === */
.result-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: #1a1a2a;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,.5);
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
  padding: 0;
  width: 280px;

  /* ✅ 關鍵：保證直向排列 */
  display: block !important;     /* 或改 flex-direction:column 皆可 */
}

/* ===  每筆項目 === */
.result-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background .2s;
  width: 100%;                   /* 佔滿一行 */
}

.result-list li:hover {
    background: rgba(255, 0, 255, .15)
}

.thumb {
    width: 70px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.title {
    /* color: var(--color-primary); */
    font-size: 15px;
    line-height: 1.2;
}

:deep(mark) {
    background: transparent !important;
    color: inherit !important;
    font-weight: normal !important;
}
</style>