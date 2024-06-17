<script setup>
import {useTestCaseStore} from "@/store/case/testCase.js";
import {reactive, ref, onMounted} from "vue";
import {ElMessage} from "element-plus";
import {useProjectStore} from "@/store/case/project.js";
import {isEmpty} from "element-plus/es/utils/index";
import JsonEditorVue from "json-editor-vue3";
import {toObject, toKeyValuePair} from "@/utils/dataFormatConversion.js"
import KeyValueEditor from "@/components/KeyValueEditor.vue";
import AssertEditor from "@/components/AssertEditor.vue";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {createTestCase, updateTestCase} from "@/service/case/testCaseService.js";

// 测试用例状态管理工具
const testCaseStore = useTestCaseStore()

//测试项目状态管理工具
const projectStore = useProjectStore()

const route = useRoute()

// 远程搜索加载状态
const remoteSearchLoading = ref(false)

// 搜索项目列表
const searchProjectList = ref([])

// 用例基础数据表单
const caseBaseForm = reactive({
  id: '',
  caseName: '',
  projectName: '',
  projectId: '',
  priority: 1,
  method: 1,
  path: '',
})

// header键值对
let headerKeyValue = reactive([])

// params键值对
let paramsKeyValue = reactive([])

// body数据
let bodyData = reactive({})

// 断言规则数组
const assertData = reactive([])

// 取值规则键值对
let fetchKeyValue = reactive([])

// 依赖参数键值对
let dependentKeyValue = reactive([])

// 默认选中的标签
const editableTabsValue = ref('headers')

// loading
const isLoading = ref(false)

// 穿梭框选中的数据
const selectedValue = ref()

// 全部测试用例
const allTestCase = reactive([])

// caseBaseForm表单的refs
const caseBaseFormRef = ref()

// 表单验证规则
let  caseBaseFormRules = ref({
  projectName: [
    {required: true, message: '所属项目不能为空', trigger: 'blur'},
  ],
  caseName: [
    {required: true, message: '用例名称不能为空', trigger: 'blur'},
  ],
  priority: [
    {required: true, message: '优先级不能为空', trigger: 'blur'},
  ],
  method: [
    {required: true, message: '请求方法不能为空', trigger: 'blur'},
  ],
  path: [
    {required: true, message: '请求路径不能为空', trigger: 'blur'},
  ]

})

// 枚举
// 请求方法枚举
const methodEnum = [
  {label: 'GET', value:0},
  {label: 'POST', value:1},
  {label: 'PUT', value:2},
  {label: 'PATCH', value:3},
  {label: 'DELETE', value:4},
  {label: 'OPTIONS', value:5},
]
// 优先级枚举
const priorityEnum = [
  {label: 1, value:1},
  {label: 2, value:2},
  {label: 3, value:3},
  {label: 4, value:4},
]

// 组件挂载后执行
onMounted(async () => {
  if (route.query.id) {
    await fetchTestCaseInfo(route.query.id)
    buildTestCaseInfo();
  } else {
    await handleAllTestCaseData()
    initTestCaseInfo()
  }
});

// 将自身的测试用例排除
const handleAllTestCaseData = async (caseId) => {
  await testCaseStore.setAllTestCase()
  if (caseId) {
    Object.assign(allTestCase, testCaseStore.allTestCase.filter( item => item.id.toString() !== caseId))
  }
  else {
    Object.assign(allTestCase, testCaseStore.allTestCase)
  }
}

// 获取测试用例信息
const fetchTestCaseInfo = async (caseId) => {
  try {
    isLoading.value = true
    await testCaseStore.setTestCaseInfo(caseId)
    await handleAllTestCaseData(caseId)
  } catch (e) {
    ElMessage.error(`查询测试用例详情失败：${e}`)
  } finally {
    isLoading.value = false
  }
}

// 初始化单数据
const initTestCaseInfo = () => {
  // 初始化表单数据
  caseBaseForm.id = null;
  caseBaseForm.caseName = '';
  caseBaseForm.projectName = '';
  caseBaseForm.projectId = null;
  caseBaseForm.priority = 1;
  caseBaseForm.method = 1;
  caseBaseForm.path = '';

  Object.assign(headerKeyValue, [{key: '', value: ''}]);
  Object.assign(paramsKeyValue, [{key: '', value: ''}]);
  Object.assign(fetchKeyValue, [{key: '', value: ''}]);
  Object.assign(dependentKeyValue, [{key: '', value: ''}]);
  Object.assign(assertData, [{assert: '', path: '', value: '', types: '', msg: ''}])
}

// 构建表单数据
const buildTestCaseInfo = () => {
  const testCaseInfo = testCaseStore.testCaseInfo;
  console.log('testCaseInfo', testCaseInfo);

  caseBaseForm.id = testCaseInfo.id;
  caseBaseForm.caseName = testCaseInfo.caseName;
  caseBaseForm.projectName = testCaseInfo.projectName;
  caseBaseForm.projectId = testCaseInfo.projectId;
  caseBaseForm.priority = testCaseInfo.priority;
  caseBaseForm.method = testCaseInfo.method;
  caseBaseForm.path = testCaseInfo.path;

  selectedValue.value = testCaseInfo.precondition

  if (testCaseInfo.body) {
    Object.assign(bodyData, testCaseInfo.body)
  }
  Object.assign(headerKeyValue, toKeyValuePair(testCaseInfo.header));
  Object.assign(paramsKeyValue, toKeyValuePair(testCaseInfo.param));
  Object.assign(fetchKeyValue, toKeyValuePair(testCaseInfo.fetch));
  Object.assign(dependentKeyValue, toKeyValuePair(testCaseInfo.dependent));
  if (testCaseInfo.assertion) {
    testCaseInfo.assertion.forEach(item => {
      Object.keys(item).forEach( key => {
        const data = {
          assert: key,
          path: item[key].path,
          value: item[key].value,
          types: item[key].types,
          msg: item[key].msg
        }
        assertData.push(data)
      })
    })
  } else {
    assertData.push({assert: '', path: '', value: '', types: '', msg: ''})
  }

}

// 点击返回按钮处理
const onBack = () => {
  router.push('/case/testCase')
  testCaseStore.openTestCaseSearchCard()
}

// 远程搜索项目
const remoteMethod = async (query) => {
  console.log(query)
  if (query.length >= 4) {
    remoteSearchLoading.value = true
    try {
      let response = await projectStore.setSearchProjectList(query)
      if (response.status === 200 && !isEmpty(response.data.data)) {
        searchProjectList.value = projectStore.searchProjectList
      }
    } catch (error) {
      ElMessage.error('查询项目异常')
    } finally {
      remoteSearchLoading.value = false
    }
  }
}

// 项目搜索框失去焦点处理方法
const handleResponsibleBlur = () => {
  searchProjectList.value = []
}

const handleSelectChange = (data) => {
  caseBaseForm.projectId = data
}

// 测试用例请求数据
const testCaseRequestData = reactive( {
  precondition: [],
  case_name: '',
  priority: null,
  method: null,
  path: '',
  project: null,
  data: {
    header: {},
    param: {},
    fetch: {},
    dependent: {},
    body: {},
    assertion: []
  }
})

// 处理断言规则数据
const handleAssertData = (assertData) => {
  const assertionDataList = []
  assertData.forEach(item => {
    const assertionData = {}
    assertionData[item.assert] = {
      path: item.path,
      value: item.value,
      types: item.types,
      msg: item.msg
    }
    assertionDataList.push(assertionData)
  })
  return assertionDataList
}


// 构建测试用例请求表单
const buildTestCaseRequestData = () => {
  testCaseRequestData.precondition = selectedValue.value
  testCaseRequestData.case_name = caseBaseForm.caseName
  testCaseRequestData.project = caseBaseForm.projectId
  testCaseRequestData.path = caseBaseForm.path
  testCaseRequestData.method = caseBaseForm.method
  testCaseRequestData.priority = caseBaseForm.priority
  testCaseRequestData.data.header = toObject(headerKeyValue)
  testCaseRequestData.data.param = toObject(paramsKeyValue)
  testCaseRequestData.data.fetch = toObject(fetchKeyValue)
  testCaseRequestData.data.dependent = toObject(dependentKeyValue)
  testCaseRequestData.data.body = bodyData
  testCaseRequestData.data.assertion = handleAssertData(assertData)
}


// 新增测试用例
const handleCreateSave = async () => {
  try {
    isLoading.value = true
    await caseBaseFormRef.value.validate().catch(err => {
      const message = Object.values(err)[0]
      console.log(typeof message, message)
      if (message.length > 0 && message[0]) {
        throw message[0]
      } else
        throw '请检查用例基础数据是否正常输入'
    })
    buildTestCaseRequestData()
    const {data} =  await createTestCase(testCaseRequestData)
    if (data.code === 201) {
      ElMessage.success('新增成功')
      await router.replace({path: '/case/testCase'})
      testCaseStore.openTestCaseSearchCard()
    }
  } catch (error) {
    ElMessage.error(error)
  } finally {
    isLoading.value = false
  }
}

// 修改测试用例
const handleUpdateSave = async () => {
  try {
    isLoading.value = true
    await caseBaseFormRef.value.validate().catch(err => {
      const message = Object.values(err)[0]
      if (message.length > 0 && message[0]) {
        throw message[0]
      } else
        throw '请检查用例基础数据是否正常输入'
    })
    buildTestCaseRequestData()
    const {data} =  await updateTestCase(caseBaseForm.id, testCaseRequestData)
    if (data.code === 200) {
      ElMessage.success('修改成功')
      await router.replace({path: '/case/testCase'})
      testCaseStore.openTestCaseSearchCard()
    }
  } catch (error) {
    ElMessage.error(error)
  } finally {
    isLoading.value = false
  }
}



</script>

<template>
  <el-card class="edit-case-card">
    <el-container class="test-case-container" v-loading.fullscreen.lock="isLoading">
      <el-header class="test-case-header">
        <div aria-label="page header" class="pageHeader">
          <el-page-header @back="onBack">
            <template #extra>
              <div class="flex items-center">
                <el-button>清除</el-button>
                <el-button v-if="caseBaseForm.id" type="primary" class="ml-2" @click="handleUpdateSave">修改</el-button>
                <el-button v-if="!caseBaseForm.id" type="primary" class="ml-2" @click="handleCreateSave">保存</el-button>
              </div>
            </template>
          </el-page-header>
        </div>
      </el-header>

      <el-main>
        <div class="test-case-main">
          <el-main class="case-base-main">
            <h1>
              用例基础数据
            </h1>
            <el-form :model="caseBaseForm"
                     ref="caseBaseFormRef"
                     :rules="caseBaseFormRules"
                     class="case-base-form"
                     label-position="right"
                     label-width="auto"
                     size="default"
            >
              <el-form-item label="用例名称" prop="caseName">
                <el-input v-model="caseBaseForm.caseName" placeholder="请输入用例名称" clearable/>
              </el-form-item>
              <el-form-item label="所属项目" prop="projectName">
                <el-select
                    v-model="caseBaseForm.projectName"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请输入项目名称"
                    :remote-method="remoteMethod"
                    @blur="handleResponsibleBlur"
                    :loading="remoteSearchLoading"
                    @change="handleSelectChange"
                >
                  <el-option
                      v-for="item in searchProjectList"
                      :key="item.id"
                      :label="item.project_name"
                      :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="优先级" prop="priority">
                <el-select
                    v-model="caseBaseForm.priority"
                    placeholder="请选择优先级"
                >
                  <el-option
                      v-for="item in priorityEnum"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="请求方法" prop="method">
                <el-select
                    v-model="caseBaseForm.method"
                    placeholder="请选择请求方法"
                >
                  <el-option
                      v-for="item in methodEnum"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="路径" prop="path">
                <el-input v-model="caseBaseForm.path" placeholder="请输入路径" clearable/>
              </el-form-item>
            </el-form>
          </el-main>
          <el-main class="case-precondition-main">
            <h1>
              前置用例
            </h1>
            <el-transfer
                v-model="selectedValue"
                filterable
                filter-placeholder="请输入用例名称"
                :titles="['未选', '已选']"
                :data="allTestCase"
                :props="{key: 'id', label: 'case_name'}"
                class="case-transfer"
            >
            </el-transfer>
          </el-main>
        </div>
        <div class="test-case-footer">
          <el-tabs
              v-model="editableTabsValue"
              class="test-data-tabs"
              type="card"
          >
            <el-tab-pane label="Headers" name="headers">
              <KeyValueEditor v-model="headerKeyValue" />
            </el-tab-pane>
            <el-tab-pane label="Params" name="params">
              <KeyValueEditor v-model="paramsKeyValue"/>
            </el-tab-pane>
            <el-tab-pane label="Body" name="body">
              <JsonEditorVue class="json-editor" v-model="bodyData">
              </JsonEditorVue>
            </el-tab-pane>
            <el-tab-pane label="断言规则" name="assertion">
              <AssertEditor v-model="assertData"/>
            </el-tab-pane>
            <el-tab-pane label="取值规则" name="fetch">
              <KeyValueEditor v-model="fetchKeyValue"/>
            </el-tab-pane>
            <el-tab-pane label="依赖参数" name="dependent">
              <KeyValueEditor v-model="dependentKeyValue"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </el-card>
</template>

<style scoped>

.pageHeader {
  width: 100%;
}

.test-case-main {
  display: flex;
  justify-content: space-between;
  height: 50vh;
  padding: 0;

}

.test-case-footer {
  height: 40vh;
  border: 1px solid var(--el-border-color);
  border-top: 0;
  padding: 0;
  width: 100%;
  min-width: 1200px;
}

.test-data-tabs {
  width: 100%;
  min-width: 1200px;
}

h1 {
  font-size: 20px;
  margin: 0;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.test-case-header {
  height: 50px;
  width: 100%;
  display: flex;
  place-items: center;
  text-align: center;

}

.case-base-main {
  width: 20%;
  margin: 0;
  border: 1px solid var(--el-border-color);
  border-right: 0;
  padding: 20px 0 0 0;
  min-width: 400px;
}

.case-precondition-main {
  width: 50%;
  margin: 0;
  border: 1px solid var(--el-border-color);
  padding: 20px 0 0 0;
  min-width: 800px;
}

.case-base-form {
  max-width: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  padding-top: 60px;
}

.case-transfer {
  max-width: 100%;
  width: 100%;
  padding-top: 20px;
  text-align: center;
  --el-transfer-panel-width: 300px;
}

:deep(.el-checkbox.el-checkbox--small .el-checkbox__label) {
  font-size: 16px;
}

.el-form-item {
  width: 300px;
}

.el-divider {
  margin: 0;
}

.el-card {
  --el-card-padding: 0 20px 20px;
}

.json-editor {
  height: 33.7vh;
}
</style>
