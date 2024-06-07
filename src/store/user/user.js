import {defineStore} from "pinia";
import {getUserList} from "@/service/user/userService.js";
import {ref} from "vue";


export const useUserStore = defineStore('user', () => {

    // 用户列表
    const userList = ref()

    // 更新用户列表
    const setUserList = async (search) => {
        const response = await getUserList(search)
        userList.value = response.data.data
        return response
    }

    return {
        userList,
        setUserList,
    }
})