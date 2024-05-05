import http from "@/utils/http.js";


// 获取用户列表
export const getUserList = async (search) => {
    return await http.get('/user/authUser', {
        params: {
            page: 1,
            page_size: 10,
            search: search,
        }
    })
}
