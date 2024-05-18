import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import {getTestCaseList, updateTestCase, deleteTestCase, createTestCase, getTestCaseInfo} from "@/service/case/testCaseService.js";
import {isEmpty} from "element-plus/es/utils/index";


export const useTestCase = defineStore('testCase', () => {

    // 测试用例列表
    const testCaseList = ref([])

    // 测试用例详情
    const testCaseInfo = reactive({
        id: null,
        // 前置用例
        precondition: [],
        // 用例名称
        caseName: '',
        // 优先级
        priority: 1,
        // 请求方法
        method: 0,
        // 请求路径
        path: '',
        // 所属项目
        project: null,
        // 项目ID
        projectId: null,
        // 项目名称
        projectName: '',
        // 请求头
        header: {},
        // 请求参数
        param: {},
        // 断言规则
        assertion: [],
        // 请求体
        body: {},
        // 依赖参数
        dependent: {},
        // 取值规则
        fetch: [],
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
            testCaseInfo.id = responseData.id
            testCaseInfo.precondition = responseData.precondition
            testCaseInfo.caseName = responseData.case_name
            testCaseInfo.priority = responseData.priority
            testCaseInfo.method = responseData.method
            testCaseInfo.path = responseData.path
            if (responseData.project) {
                testCaseInfo.project = responseData.project
                testCaseInfo.projectId = responseData.project.id
                testCaseInfo.projectName = responseData.project.project_name
            }
            if (responseData.data.header){
                testCaseInfo.header = responseData.data.header
            }
            testCaseInfo.body = responseData.data.body
            testCaseInfo.param = responseData.data.param
            testCaseInfo.fetch = responseData.data.fetch
            testCaseInfo.assertion = responseData.data.assertion
            testCaseInfo.dependent = responseData.data.dependent

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