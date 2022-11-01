import { createRouter, createWebHistory } from "vue-router";
import Map from "../components/_Map.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Map,
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
