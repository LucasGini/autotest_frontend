<script setup>
import {useTestCase} from "@/store/case/testCase.js";
import {reactive, ref} from "vue";
import {createProject, updateProject} from "@/service/case/testProjectService.js";
import {ElMessage} from "element-plus";
import {useProject} from "@/store/case/project.js";
import {isEmpty} from "element-plus/es/utils/index";

const testCaseStore = useTestCase()

// 新增或修改的表单
const projectEditForm = reactive({
  id: '',
  project_name: '',
  responsible: null,
  remark: ''
})

const projectEditFormRef = ref()

// 表单验证规则
let  projectEditFormRules = ref({
  project_name: [
    {required: true, message: '项目名称不能为空', trigger: 'blur'},
  ],
  responsible: [
    {required: true, message: '负责人不能为空', trigger: 'blur'},
  ]
})

// 控制新增保存按钮和修改保存按钮显示
// true显示新增的保存按钮， false 显示编辑的保存按钮
const isCreateOrUpdateMode = ref(true)



// 新增测试环境数据
const createFormSubmit = async () => {
  try {
    // 验证表单
    await projectEditFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await createProject(projectEditForm)
    if (response.status === 201 && response.data.msg === 'OK') {
      ElMessage.success('新增成功')
      showEditDialog.value = false
      // 重新获取数据
      await fetchTestcaseList()
    } else {
      ElMessage.error('新增失败')
    }
  } catch (error) {
    ElMessage.error(error)
  }
}


// 修改测试环境数据
const updateFormSubmit = async () => {
  try {
    // 验证表单
    await projectEditFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await updateProject(projectEditForm.id, projectEditForm)
    if (response.status === 200 && response.data.msg === 'OK') {
      ElMessage.success('修改成功')
      showEditDialog.value = false
      // 重新获取数据
      await fetchTestcaseList()
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error(error)
  }
}

// 点击返回按钮处理
const onBack = () => {
  testCaseStore.openTestCaseSearchCard()
}

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})



const generateData = () => {
  const data = []
  const states = [
    'California',
    'Illinois',
    'Maryland',
    'Texas',
    'Florida',
    'Colorado',
    'Connecticut ',
  ]
  const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT']
  states.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      initial: initials[index],
    })
  })
  return data
}

const data = ref(generateData())
const value = ref([])

const filterMethod = (query, item) => {
  return item.initial.toLowerCase().includes(query.toLowerCase())
}


const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}

// 搜索项目列表
const searchProjectList = ref([])

// 项目搜索框失去焦点处理方法
const handleResponsibleBlur = () => {
  searchProjectList.value = []
}

const projectStore = useProject()

// 远程搜索加载状态
const remoteSearchLoading = ref(false)

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

// 查询表单
const searchForm = ref({
  caseName: '',
  project: '',
  priority: null,
  method: null,
  path: ''
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
                <el-button type="primary" class="ml-2">保存</el-button>
              </div>
            </template>
          </el-page-header>
        </div>
      </el-header>
      <el-main class="test-case-main">
        <el-main class="case-base-main">
          <h1>
            用例基础数据
          </h1>
          <el-form :model="searchForm"
                   class="case-base-form"
                   label-position="right"
                   label-width="auto"
                   size="default"
          >
            <el-form-item label="用例名称">
              <el-input v-model="searchForm.caseName" placeholder="请输入用例名称" clearable/>
            </el-form-item>
            <el-form-item label="所属项目" prop="responsible">
              <el-select
                  v-model="searchForm.project"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入项目名称"
                  :remote-method="remoteMethod"
                  @blur="handleResponsibleBlur"
                  :loading="remoteSearchLoading"
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
                  v-model="searchForm.priority"
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
                  v-model="searchForm.method"
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
              <el-input v-model="searchForm.path" placeholder="请输入路径" clearable/>
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
      </el-main>
      <el-footer class="test-case-footer">
        <el-tabs
            v-model="activeName"
            class="test-data-tabs"
            @tab-click="handleClick"
            type="card"
        >
          <el-tab-pane label="Headers" name="headers">

          </el-tab-pane>
          <el-tab-pane label="Params" name="params">

          </el-tab-pane>
          <el-tab-pane label="Body" name="body">

          </el-tab-pane>
          <el-tab-pane label="断言规则" name="assertion">

          </el-tab-pane>
          <el-tab-pane label="取值逻辑" name="fetch">

          </el-tab-pane>
          <el-tab-pane label="依赖参数" name="dependent">

          </el-tab-pane>
        </el-tabs>
      </el-footer>
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
}
.test-data-tabs {
  width: 100%;
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
  width: 50%;
  margin: 0;
  border: 1px solid var(--el-border-color);
  border-right: 0;
  padding: 20px 0 0 0;
}

.case-precondition-main{
  width: 50%;
  margin: 0;
  border: 1px solid var(--el-border-color);
  padding: 20px 0 0 0;
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
  min-width: 700px;
  width: 100%;
  padding-top: 20px;
  text-align: center;
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


</style>