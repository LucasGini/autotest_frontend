<script setup>
import {useTestCase} from "@/store/case/testCase.js";
import {reactive, ref, watchEffect} from "vue";
import {createProject, updateProject} from "@/service/case/testProjectService.js";
import {ElMessage} from "element-plus";
import {useProject} from "@/store/case/project.js";
import {isEmpty} from "element-plus/es/utils/index";
import JsonEditorVue from "json-editor-vue3";
import KeyValueEditor from "@/components/KeyValueEditor.vue";
import AssertEditor from "@/components/AssertEditor.vue";

// 测试用例状态管理工具
const testCaseStore = useTestCase()

//测试项目状态管理工具
const projectStore = useProject()

// 测试用例详情
const testCaseInfo =  reactive(testCaseStore.testCaseInfo)

// 对象转键值对
const toKeyValuePair = (obj) => {
  const output = []
  if (!isEmpty(obj)) {
    Object.keys(obj).forEach(k => {
      output.push({key: k, value: obj[k]})
    })
    return output
  }
  return [{key: '', value: ''}]
}

// 键值对转对象
const toObject = (keyValueArray) => {
  const obj = {}
  keyValueArray.forEach(item => {
    if (item.key !== '') {
      obj[item.key] = item.value
    }
  })
  return obj
}

// 点击返回按钮处理
const onBack = () => {
  testCaseStore.openTestCaseSearchCard()
}


// 远程搜索加载状态
const remoteSearchLoading = ref(false)

// 搜索项目列表
const searchProjectList = ref([])

// 远程搜索项目
const remoteMethod = async (query) => {
  console.log(query)
  if (query.length >= 4) {
    remoteSearchLoading.value = true
    try {
      let response = await projectStore.setSearchProjectList(query)
      if (response.status === 200 && !isEmpty(response.data.data)){
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

// 用例基础数据表单
const caseBaseForm = reactive(testCaseInfo)


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

// 标签页默认选中
const editableTabsValue = ref('headers')

// 初始化 headerKeyValue
const headerKeyValue = ref(toKeyValuePair(testCaseInfo.header))


// params键值对
const paramsKeyValue = ref(toKeyValuePair(testCaseInfo.param))

// 处理子组件数据变更事件
const handleHeaderKeyValueUpdate = (updateData) => {
  headerKeyValue.value = updateData
  testCaseInfo.header = toObject(updateData)
  console.log(headerKeyValue)
}

// 处理子组件数据变更事件
const handleParamsKeyValueUpdate = (updateData) => {
  paramsKeyValue.value = updateData
  testCaseInfo.param = toObject(updateData)
  console.log(headerKeyValue)
}

// 断言规则数据
const assertData =  ref([{
  assert: '',
  path: '',
  value: '',
  types: '',
  meg: ''
}])

// 处理子组件数据变更事件
const handleAssertDataUpdate = (updateData) => {
  assertData.value = updateData
  console.log(assertData)
}

// 取值规则键值对
const fetchKeyValue = ref(toKeyValuePair(testCaseInfo.fetch))

// 处理子组件数据变更事件
const handleFetchKeyValueUpdate = (updateData) => {
  paramsKeyValue.value = updateData
  testCaseInfo.fetch = toObject(updateData)
  console.log(headerKeyValue)
}

// 依赖参数键值对
const dependentKeyValue = ref([{
  key: '',
  value: ''
}])

// 处理子组件数据变更事件
const handleDependentKeyValueUpdate = (updateData) => {
  dependentKeyValue.value = updateData
  console.log(dependentKeyValue)
}

const handleSave = () => {
  console.log(testCaseStore.testCaseInfo)
  console.log(testCaseInfo)
  console.log(headerKeyValue)
}

const handleSelectChange = () => {
  console.log('选择变更')
}

</script>

<template>
  <el-card class="edit-case-card">
    <el-container class="test-case-container">
      <el-header class="test-case-header">
        <div aria-label="page header" class="pageHeader">
          <el-page-header @back="onBack">
            <template #extra>
              <div class="flex items-center">
                <el-button>清除</el-button>
                <el-button type="primary" class="ml-2" @click="handleSave">保存</el-button>
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
                     class="case-base-form"
                     label-position="right"
                     label-width="auto"
                     size="default"
            >
              <el-form-item label="用例名称">
                <el-input v-model="caseBaseForm.caseName" placeholder="请输入用例名称" clearable/>
              </el-form-item>
              <el-form-item label="所属项目" prop="responsible">
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
                    clearable
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
                    clearable
                    placeholder="请选择请求方法"
                >
                  <el-option
                      v-for="item in methodEnum"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="路径">
                <el-input v-model="caseBaseForm.path" placeholder="请输入路径" clearable/>
              </el-form-item>
            </el-form>
          </el-main>
          <el-main class="case-precondition-main">
            <h1>
              前置用例
            </h1>
            <el-transfer
                v-model="value"
                filterable
                :filter-method="filterMethod"
                filter-placeholder="State Abbreviations"
                :data="data"
                class="case-transfer"
            />
          </el-main>
        </div>
        <div class="test-case-footer">
          <el-tabs
              v-model="editableTabsValue"
              class="test-data-tabs"
              @tab-click="handleClick"
              type="card"
          >
            <el-tab-pane label="Headers" name="headers">
              <KeyValueEditor :data="headerKeyValue" @update:data="handleHeaderKeyValueUpdate"></KeyValueEditor>
            </el-tab-pane>
            <el-tab-pane label="Params" name="params">
              <KeyValueEditor :data="paramsKeyValue" @update:data="handleParamsKeyValueUpdate" />
            </el-tab-pane>
            <el-tab-pane label="Body" name="body">
              <JsonEditorVue class="json-editor" language="zh">

              </JsonEditorVue>
            </el-tab-pane>
            <el-tab-pane label="断言规则" name="assertion">
              <AssertEditor :data="assertData" @update:data="handleAssertDataUpdate"/>
            </el-tab-pane>
            <el-tab-pane label="取值规则" name="fetch">
              <KeyValueEditor :data="fetchKeyValue" @update:data="handleFetchKeyValueUpdate" />
            </el-tab-pane>
            <el-tab-pane label="依赖参数" name="dependent">
              <KeyValueEditor :data="dependentKeyValue" @update:data="handleDependentKeyValueUpdate" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </el-card>
</template>

<style scoped>
.edit-case-card {}
.test-case-container {
}
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
  margin:0;
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
  --el-checkbox-font-size: 20px;
  --el-checkbox-input-height: 20px;
  --el-checkbox-input-width:20px
}

:deep(.el-checkbox.el-checkbox--small .el-checkbox__label) {
  font-size: 20px;
}

.el-form-item {
  width: 300px;
}
.el-divider {
  margin: 0;
}
.el-card {
  --el-card-padding: 0 20px 20px ;
}
.json-editor {
  height: 33.7vh;
}


</style>