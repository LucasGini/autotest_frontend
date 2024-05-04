import {createRouter, createWebHistory} from "vue-router";
import HomePage from "@/components/HomePage.vue";
import systemRoutes from "@/router/syetemRouter.js";
import caseRoutes from "@/router/caseRouter.js"

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    // 系统配置路由
    ...systemRoutes,
    // 测试数据路由
    ...caseRoutes,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})



export default router