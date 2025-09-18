import { createApp } from 'vue'

// 引入全局样式
import './style.css'

// 引入根组件
import App from './App.vue'

// 1. 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 2. 引入 Vue Router
import router from './router'

// 3. 引入 Pinia
import { createPinia } from 'pinia'
// 引入 pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'




const app = createApp(App)
const pinia = createPinia()

// 按顺序使用插件
app.use(pinia)          // 首先使用 Pinia
app.use(router)         // 接着使用 Router
app.use(ElementPlus)    // 最后使用 Element Plus

// 挂载应用
app.mount('#app')
