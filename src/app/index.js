import Vue from 'vue';
import App from '@/App.vue';
import createStore from '@/store'
import createRouter from '@/router'
// 
export default function createApp() {
  const router = createRouter();
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });
  return { app, store, router }
}