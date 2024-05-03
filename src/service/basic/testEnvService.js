import http from '@/utils/http.js'

// 获取测试环境列表
export const getTestEnvList = async (config) => {
    return await http.get('/basic/testEnv', config)
}

// 获取测试环境
export const getTestEnvInfo = async (testEnvId) => {
    return await http.get(`/basic/testEnv/${testEnvId}`)
}

// 创建测试环境
export const createTestEnv = async (testEnvData) => {
    return await http.post('/basic/testEnv', testEnvData)
}

// 更新测试环境
export const updateTestEnv = async (testEnvId ,testEnvData) => {
    return await http.put(`/basic/testEnv/${testEnvId}`,testEnvData);
}

// 删除测试环境
export const deleteTestEnv = async (testEnvId) => {
    return await http.delete(`/basic/testEnv/${testEnvId}`);
}