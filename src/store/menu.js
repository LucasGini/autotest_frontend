import {defineStore} from "pinia";
import axios from 'axios'
import {reactive, ref} from "vue";

export const useMenu = defineStore('menu', () => {
    let menu = reactive([])
    let isCollapse = ref(false)

    async function getMenu() {
        try {
            const response = await axios.get('http://localhost:8000/basic/systemMenu')
            menu.value = response.data.data
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async function toggleCollapse() {
        isCollapse.value = !isCollapse.value
        console.log(isCollapse.value)
    }
    return {
        menu,
        getMenu,
        isCollapse,
        toggleCollapse
    }
})