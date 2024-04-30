import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/index.css';
import EventEmitter from 'eventemitter3';

window._EE_ = new EventEmitter();

createApp(App).use(router).mount('#app');