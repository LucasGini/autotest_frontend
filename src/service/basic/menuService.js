import http from "@/utils/http.js";


// 获取菜单树
export const getAllMenu = async () => {
    return await http.get('/basic/systemMenu');
}

// 获取菜单
export const getMenuInfo = async (menuId) => {
    return await http.get(`/basic/systemMenu/${menuId}`);
}

// 新增菜单
export const createMenu = async (menuData) => {
    return await http.post('/basic/systemMenu', menuData);
}

// 更新菜单
export const updateMenu = async (menuId, menuData) => {
    return await http.put(`/basic/systemMenu/${menuId}`, menuData);
}

// 删除菜单
export const deleteMenu = async (menuId) => {
    return await http.delete(`/basic/systemMenu/${menuId}`);
}