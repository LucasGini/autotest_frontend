import TestEnvView from "@/views/syetem/TestEnvView.vue";
import MenuView from "@/views/syetem/MenuView.vue";

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
    }
]

export default systemRoutes;