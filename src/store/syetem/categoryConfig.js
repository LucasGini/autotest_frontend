import {getCategoryConfigTree, getCategoryConfigInfo, getCategoryConfigList} from "@/service/basic/categoryConfigService.js";
import {defineStore} from "pinia";
import {ref} from "vue";


export const useCategoryConfigStore = defineStore('categoryConfig', () => {

    // 类型配置树
    const categoryConfigTree = ref([])
    // 类型配置列表
    const categoryConfigList = ref([])
    // 类型配置详情
    const categoryConfigInfo = ref({})

    const setCategoryConfigTree = async (config) => {
        let response = await getCategoryConfigTree(config)
        categoryConfigTree.value = response.data.data
        return response
    }

    const setCategoryConfigList = async (config) => {
        let response = await getCategoryConfigList(config)
        categoryConfigList.value = response.data.data
        return response
    }

    const setCategoryConfigInfo = async () => {
        let response = await getCategoryConfigInfo()
        categoryConfigInfo.value = response.data.data
        return response
    }

    return {
        categoryConfigInfo,
        categoryConfigTree,
        categoryConfigList,
        setCategoryConfigInfo,
        setCategoryConfigTree,
        setCategoryConfigList
    }
})
