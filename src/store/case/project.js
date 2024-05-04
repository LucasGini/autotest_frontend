import {defineStore} from "pinia";
import {ref} from "vue";
import {getProjectList, getProjectInfo} from "@/service/case/testProjectService.js";

export const useProject = defineStore('project', () => {

    // 项目列表
    let projectList = ref([])

    // 项目详情
    let projectInfo = ref({})

    // 更新项目列表
    const setProjectList = async (config) => {
        try {
            const response = await getProjectList(config);
            projectList.value = response.data.data
            return response
        } catch (error) {
            console.log(error)
            throw error
        }

    }

    // 更新项目详情
    const setProjectInfo = async (ProjectId) => {
        try {
            const response = await getProjectInfo(ProjectId);
            projectInfo.value = response.data.data
            return response
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return {
        projectInfo,
        projectList,
        setProjectList,
        setProjectInfo,
    }


})