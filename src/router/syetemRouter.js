import TestEnvView from "@/views/TestEnvView.vue";
import MenuView from "@/views/MenuView.vue";

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