import {createRouter, createWebHistory} from "vue-router";
import names from '@/views/names.vue'

const routes = [
    {
        path: '/v2/user/names',
        name: 'names',
        component: names
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router