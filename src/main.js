import '@/assets/styles/fonts.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useTaskStore } from '@/stores/taskStore.js';

const app = createApp(App)

const pinia = createPinia();
pinia.use(useTaskStore);

app.use(createPinia())

app.mount('#app')
