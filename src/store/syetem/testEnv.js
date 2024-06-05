import {defineStore} from "pinia";
import {getTestEnvInfo, getTestEnvList} from "@/service/basic/testEnvService.js";
import {ref} from "vue";

export const useTestEnvStore = defineStore("testEnv", () => {

    // 测试环境列表
    let testEnvList = ref([])
    // 测试环境详情
    let testEnvInfo = ref({})

    // 获取测试环境列表并更新状态
    const setAllTestEnv = async (config) => {
        let response = await getTestEnvList(config)
        testEnvList.value = response.data.data
        return response
    }

    // 获取测试环境详情并更新状态
    const setTestEnvInfo = async (testEnvId) => {
        let response = await getTestEnvInfo(testEnvId)
        testEnvInfo.value = response.data.data
        return response
    }

    return {
        testEnvList,
        testEnvInfo,
        setAllTestEnv,
        setTestEnvInfo,

    }

})