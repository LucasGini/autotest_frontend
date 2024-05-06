import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from "@/store/index.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/styles/index.css"

const app = createApp(App)
// 引入element-plus
app.use(ElementPlus, {size: 'small', zIndex: 3000, locale: zhCn})
// 引入路由
app.use(router)
// 引入pinia
app.use(pinia)
// 引入element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')