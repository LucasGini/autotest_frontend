import TestEnvView from "@/views/syetem/TestEnvView.vue";
import MenuView from "@/views/syetem/MenuView.vue";
import CategoryConfigView from "@/views/syetem/CategoryConfigView.vue";

const systemRoutes = [
    {
        path: '/system/menu',
        name: 'menu',
        component: MenuView
    },
    {
        path: '/system/testEnv',
        name: 'testEnv',
        component: TestEnvView
    },
    {
        path: '/system/categoryConfig',
        name: 'categoryConfig',
        component: CategoryConfigView
    }
]

export default systemRoutes;