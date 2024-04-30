import {defineStore} from "pinia";
import axios from 'axios'
import {reactive, ref} from "vue";

export const useMenu = defineStore('menu', () => {
    let menuList = reactive([])
    let isCollapse = ref(false)
    let activePath = ref('')

    async function getMenu() {
        try {
            const response = await axios.get('http://localhost:8000/basic/systemMenu')
            menuList.value = response.data.data
            return response.data
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
        getMenu,
        isCollapse,
        toggleCollapse,
        updateActivePath
    }
})