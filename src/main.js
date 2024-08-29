import './assets/all.scss'
import './assets/main.css'
import 'vue-loading-overlay/dist/css/index.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {LoadingPlugin} from 'vue-loading-overlay';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(LoadingPlugin)
app.use(createPinia())
app.use(router)

app.mount('#app')
