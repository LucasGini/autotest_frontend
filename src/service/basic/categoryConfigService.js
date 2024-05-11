import http from "@/utils/http.js";

// 查询类型配置树
export const getCategoryConfigTree = async (config) => {
    return await http.get('/basic/categoryConfig?searchType=tree', config)
}

// 查询类型配置列表
export const getCategoryConfigList = async (config) => {
    return await http.get('/basic/categoryConfig', config)
}

// 查询类型配置详情
export const getCategoryConfigInfo = async (config_id) => {
    return await http.get(`/basic/categoryConfig/${config_id}`)
}

// 创建类型配置
export const createCategoryConfig = async (config_data) => {
    return await http.post('/basic/categoryConfig', config_data)
}

// 修改类型配置
export const updateCategoryConfig = async (config_id, config_data) => {
    return await http.put(`/basic/categoryConfig/${config_id}`, config_data)
}

// 删除类型配置
export const deleteCategoryConfig = async (config_id) => {
    return await http.delete(`/basic/categoryConfig/${config_id}`, config_id)
}