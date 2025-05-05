import { createApp } from 'vue'
import App from './App.vue'
import './styles/base.css'
import './styles/variables.css'
import './styles/layout.css'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080' // 統一設定後端baseURL

const app = createApp(App)
app.use(router)
app.mount('#app')
