import { createRouter, createWebHistory } from "vue-router";
import NewMap from "../components/NewMap.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: NewMap,
  },
  {
    path: "/map",
    name: "Map",
    component: NewMap,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
