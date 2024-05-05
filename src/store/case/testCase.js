import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {getTestCaseList, updateTestCase, deleteTestCase, createTestCase, getTestCaseInfo} from "@/service/case/testCaseService.js";


export const useTestCase = defineStore('testCase', () => {

    // 测试数据
    const testData = reactive({
        header: {},
        param: {},
        assertion: [],
        body: {},
        dependent: {},
        fetch: [],
    })

    // 测试用例列表
    const testCaseList = ref()

    // 测试用例详情
    const testCaseInfo = reactive({
        data: testData
    })

    // 查询编辑页面显示状态
    const showSearchEditCard = ref(false)

    // 更新测试用例列表
    const setTestCaseList = async (config) => {
        const response = await getTestCaseList(config)
        testCaseList.value = response.data.data
        return response
    }

    // 更新测试用例详情
    const setTestCaseInfo = async (caseId) => {
        const response = await getTestCaseInfo(caseId)
        const responseData = response.data.data
        if (responseData) {
            testCaseInfo.value = responseData
            if (responseData.header) {
                testCaseInfo.data.header = responseData.header
            }
            if (responseData.body) {
                testCaseInfo.data.body = responseData.body
            }
            if (responseData.param) {
                testCaseInfo.data.param = responseData.param
            }
            if (responseData.fetch) {
                testCaseInfo.data.fetch = responseData.fetch
            }
            if (responseData.assertion) {
                testCaseInfo.data.assertion = responseData.assertion
            }
            if (responseData.dependent) {
                testCaseInfo.data.dependent = responseData.dependent
            }
        }
        return response
    }

    // 打开测试用例查询页面
    const openTestCaseSearchCard = () => {
        showSearchEditCard.value = false
    }

    // 打开测试用例编辑页面
    const openTestCaseEditCard = () => {
        showSearchEditCard.value = true
    }

    return {
        testCaseInfo,
        testCaseList,
        setTestCaseInfo,
        setTestCaseList,
        showSearchEditCard,
        openTestCaseSearchCard,
        openTestCaseEditCard
    }
})