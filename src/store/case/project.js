import {defineStore} from "pinia";
import {ref} from "vue";
import {getProjectList, getProjectInfo, searchProject} from "@/service/case/testProjectService.js";
import {getUserList} from "@/service/user/userService.js";

export const useProject = defineStore('project', () => {

    // 项目列表
    const projectList = ref([])

    // 项目详情
    const projectInfo = ref({})

    // 查询的项目列表
    const searchProjectList = ref([])

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

    // 查询测试项目
    const setSearchProjectList = async (search) => {
        const response = await searchProject(search)
        searchProjectList.value = response.data.data
        return response
    }

    return {
        projectInfo,
        projectList,
        searchProjectList,
        setProjectList,
        setProjectInfo,
        setSearchProjectList
    }


})