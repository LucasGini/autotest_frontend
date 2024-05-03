import {defineStore} from "pinia";
import {getAllMenu, getMenuInfo} from "@/service/basic/menuService.js";
import {reactive, ref} from "vue";

export const useMenu = defineStore('menu', () => {
    let menuList = reactive([])
    let menu = ref('')
    let isCollapse = ref(false)
    let activePath = ref('')

    async function getMenuList() {
        try {
            const response = await getAllMenu()
            menuList.value = response.data.data
            return response.data.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function getMenu() {
        try {
            const response = await getMenuInfo()
            menu.value = response.data.data
            return response.data.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    function updateActivePath(path) {
        activePath.value = path
    }

    function toggleCollapse() {
        isCollapse.value = !isCollapse.value
        console.log(isCollapse.value)
    }
    return {
        menuList,
        activePath,
        getMenuList,
        isCollapse,
        toggleCollapse,
        updateActivePath,
        getMenu
    }
})