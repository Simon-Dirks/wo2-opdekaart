import {createApp} from 'vue'
import './index.css'
import './style.css'
import App from './App.vue'
import VueMapboxTs from "vue-mapbox-ts";

const app = createApp(App);
app.mount('#app');
app.use(VueMapboxTs);