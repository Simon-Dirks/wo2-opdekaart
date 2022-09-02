import {createApp} from 'vue'
import './index.css'
import './style.css'
import App from './App.vue'
import VueMapboxTs from "vue-mapbox-ts";
import {store} from "./store";
import naive from "naive-ui";
import {Icon, IconConfigProvider} from "@vicons/utils";
import router from "./router";
import VueLazyLoad from 'vue3-lazyload'
import {vue3Debounce} from "vue-debounce";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueMapboxTs);
app.use(naive);
app.use(VueLazyLoad, {
    loading: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif',
    error: 'https://placekitten.com/1000/500',
    lifecycle: {
        error: (el: any) => {
            // console.warn(el);
        }
    }
});
app.component('Icon', Icon);
app.component('IconConfigProvider', IconConfigProvider);
app.directive('debounce', vue3Debounce({lock: true}));
app.mount('#app');