import http from "@/utils/http.js";


// 获取项目列表
export const getProjectList = async (config) => {
    return await http.get('/case/project', config)
}

// 获取项目详情
export const getProjectInfo = async (projectId) => {
    return await http.get(`/case/project/${projectId}`)
}

// 新增项目
export const createProject = async (projectData) => {
    return await http.post(`/case/project`, projectData)
}

// 修改项目
export const updateProject = async (projectId, projectData) => {
    return await http.put(`/case/project/${projectId}`, projectData)
}

// 删除项目
export const deleteProject = async (projectId) => {
    return await http.delete(`/case/project/${projectId}`)
}