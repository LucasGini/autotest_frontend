import {createRouter, createWebHistory} from "vue-router";
import HomePage from "@/components/HomePage.vue";
import systemRoutes from "@/router/syetemRouter.js";
import caseRoutes from "@/router/caseRouter.js"
import pinia from "@/store/index.js";
import {useTabsStore} from "@/store/syetem/tabs.js";
import {useMenuStore} from "@/store/syetem/menu.js";


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

const tabsStore = useTabsStore(pinia)
const menuStore = useMenuStore(pinia)


// 通过路由递归查询菜单树
const recursiveMenuSearch = (menuTree, path) => {
    console.log(menuTree)
    for (const menu of menuTree) {
        if (menu.path === path) {
            return menu  //返回匹配的菜单
        }
        if (menu.children) {
            // 递归搜索子菜单
            const found = recursiveMenuSearch(menu.children, path)
            console.log(found)
            if (found) {
                return found;  //返回匹配的菜单
            }
        }
    }
    return null  //未找到返回空
}


// 使用导航守卫重定向未知路径
router.beforeEach(async (to, from, next) => {
    const knownPaths = router.getRoutes().map(route => route.path);
    if (!knownPaths.includes(to.path)) {
        tabsStore.updateEditableTabsValue('/')
        sessionStorage.removeItem('selectedTab')
        next('/');
    } else {
        menuStore.updateActivePath(tabsStore.editableTabsValue)
        next(); // 继续路由导航
        // 等待菜单树加载完成
        let menuTree = await menuStore.getMenuList();
        // 通过路由递归查询菜单树
        const menu = recursiveMenuSearch(menuTree, to.path)
        if (to.path === '/') {
            // 选中首页标签
            tabsStore.updateEditableTabsValue(to.path)
            // 删除本地种保存的标签页
            sessionStorage.removeItem('selectedTab')
        }
        if (menu) {
            // 如果查找到,添加标签页
            tabsStore.addTabs(menu)
        }
    }
});


export default router