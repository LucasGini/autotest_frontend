import http from "@/utils/http.js";


// 获取测试用例列表
export const getTestCaseList = async (config) => {
    return await http.get('/case/testCase', config)
}

// 获取测试用例详情
export const getTestCaseInfo = async (caseId) => {
    return await http.get(`/case/testCase/${caseId}`)
}

// 新增测试用例
export const createTestCase = async (caseData) => {
    return await http.post('/case/testCase', caseData)
}

// 更新测试用例
export const updateTestCase = async (caseId, caseData) => {
    return await http.put(`/case/testCase/${caseId}`, caseData)
}

// 删除测试用例
export const deleteTestCase = async (caseId) => {
    return await http.delete(`/case/testCase/${caseId}`)
}