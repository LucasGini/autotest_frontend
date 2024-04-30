import {createRouter, createWebHistory} from "vue-router";
import menu from '@/views/MenuView.vue'
import HomePage from "@/components/HomePage.vue";

const routes = [
    {
        path: '/system/menu',
        name: 'menu',
        component: menu
    },
    {
        path: '/',
        name: 'home',
        component: HomePage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router