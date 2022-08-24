import {createApp} from 'vue'
import './index.css'
import './style.css'
import App from './App.vue'
import VueMapboxTs from "vue-mapbox-ts";
import {store} from "./store";
import naive from "naive-ui";
import {Icon, IconConfigProvider} from "@vicons/utils";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueMapboxTs);
app.use(naive);
app.component('Icon', Icon);
app.component('IconConfigProvider', IconConfigProvider);
app.mount('#app');