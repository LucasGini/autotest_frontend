import {createRouter, createWebHistory} from "vue-router";
import HomePage from "@/components/HomePage.vue";
import systemRoutes from "@/router/syetemRouter.js";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    ...systemRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router