import {createRouter, createWebHistory} from "vue-router";
import hello from '../views/hello.vue'

const routes = [
    {
        path: '/v2/user/names',
        name: 'hello',
        component: hello
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router