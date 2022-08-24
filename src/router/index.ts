import {createRouter, createWebHistory} from "vue-router";
import Map from "../components/Map.vue";
import LandingPage from "../components/LandingPage.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: LandingPage,
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