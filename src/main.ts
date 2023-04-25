import { createApp } from "vue";
import "./index.css";
import "./style.css";
import App from "./App.vue";
import VueMapboxTs from "vue-mapbox-ts";
import { store } from "./store";
import naive from "naive-ui";
import { Icon, IconConfigProvider } from "@vicons/utils";
import router from "./router";
import VueLazyLoad from "vue3-lazyload";
import { vue3Debounce } from "vue-debounce";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import imageNotVisiblePlaceholder from "./assets/afbeelding-niet-zichtbaar.png";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueMapboxTs);
app.use(naive);
app.use(VueLazyLoad, {
  loading:
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif",
  // error: "https://via.placeholder.com/350x150",
  error: imageNotVisiblePlaceholder,
  lifecycle: {
    error: (el: any) => {
      // console.warn(el);
    },
  },
});
app.use(VueViewer);
app.component("Icon", Icon);
app.component("IconConfigProvider", IconConfigProvider);
app.directive("debounce", vue3Debounce({ lock: true }));
app.mount("#app");
