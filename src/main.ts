import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import OpenLayersMap from 'vue3-openlayers'
// import "vue3-openlayers/style.css"

const app = createApp(App)

// 注册elementPlus内置icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(OpenLayersMap)
  .use(ElementPlus)
  .use(router)
  .mount('#app')
