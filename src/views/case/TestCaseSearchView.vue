<script setup>
import {useTestCaseStore} from "@/store/case/testCase.js";
import {ref, onMounted, reactive} from "vue";
import {AxiosError} from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {isEmpty} from "element-plus/es/utils/index";
import {useProjectStore} from "@/store/case/project.js";
import {deleteTestCase} from "@/service/case/testCaseService.js";
import router from "@/router/index.js";

const testCaseStore = useTestCaseStore()

// 页面加载刷新数据
onMounted( async () => {
  await fetchTestcaseList()
  testCaseStore.openTestCaseSearchCard()
})

// 项目列表
const testCaseList = reactive([])

// 分页参数
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)

// 排序参数
const sortOrder = ref('-created_date')

// 查询时loading
const searchLoading = ref(false)

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

// 将请求方法枚举转换为map
const methodEnumMap = methodEnum.reduce((map, item) => {
  map.set(item.value, item.label)
  return map
}, new Map())

const methodFormatter = (row, column, cellValue) => {
  return methodEnumMap.get(cellValue)
}


// 查询表单
const searchForm = ref({
  caseName: null,
  project: null,
  priority: null,
  method: null,
  path: null
})

// 查询处理
const searchFormSubmit = async () => {
  await fetchTestcaseList()
}


// 获取测试用例列表数据
const fetchTestcaseList = async () => {
  try {
    const response = await testCaseStore.setTestCaseList({
      params: {
        ...searchForm.value,
        page: currentPage.value,
        page_size: pageSize.value,
        ordering: sortOrder.value ? sortOrder.value : null
      }
    })
    Object.assign(testCaseList, testCaseStore.testCaseList)
    totalItems.value = response.data.total
  } catch ( error ){
    if (error instanceof AxiosError) {
      ElMessage.error('请求异常')
    } else {
      ElMessage.error('系统异常')
    }
  }
}

// 	page-size变更处理
const handleSizeChange = async (size) => {
  pageSize.value = size;
  await fetchTestcaseList()
}

// 当前页变更处理
const handleCurrentChange = async (page) => {
  currentPage.value = page
  await fetchTestcaseList()
}

// 排序处理
const handleSortChange = async (sort) => {
  console.log(sortOrder.value)
  if (sort.order === 'descending') {
    sortOrder.value = `-${sort.prop}`
  } else
    sortOrder.value = sort.prop
  await fetchTestcaseList(); // 重新获取数据
};

// 删除测试环境功能
const handleDeleteTestCase = async (data) => {
  try {
    ElMessageBox.confirm('请确认是否删除', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
      draggable: true,
    }).then(async () => {
      const response = await deleteTestCase(data.row.id)
      console.log(response.data)
      if (response.status === 200 && response.data.msg === 'OK') {
        ElMessage.success('删除成功')
        // 重新获取数据
        await fetchTestcaseList()
      } else {
        ElMessage.error('删除失败')
      }
    })

  } catch (error) {
    ElMessage.error(error)
  }
}

// 远程搜索加载状态
const remoteSearchLoading = ref(false)


// 搜索项目列表
const searchProjectList = ref([])

// 项目搜索框失去焦点处理方法
const handleResponsibleBlur = () => {
  searchProjectList.value = []
}

const projectStore = useProjectStore()

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

// 点击新增按钮
const handleCreateButtonClick = () => {
  // 打开编辑对话框
  testCaseStore.openTestCaseEditCard()
  router.push({
    path:'/case/testCase/testEdit'
  })
}

// 双击列表数据
const handleRowDblclick = (row, column, event) => {
  if (!isEmpty(row)) {
    // 打开编辑对话框
    testCaseStore.openTestCaseEditCard()
    router.push({
      name: 'testEdit',
      query: {
        id: row.id,
      }
    })
  }
}

</script>

<template>
    <el-card class="test-case-card">
      <el-container class="test-case-container">
        <el-header class="test-case-header">
          <el-form :model="searchForm"
                   class="search-form"
                   label-position="right"
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
            <el-form-item>
              <el-button type="primary" @click="searchFormSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary"
                       @click="handleCreateButtonClick"
            >
              新增
            </el-button>
          </div>
        </el-header>
        <el-main class="test-case-main">
          <el-table :data="testCaseList"
                    highlight-current-row
                    stripe
                    border
                    v-loading.fullscreen.lock="searchLoading"
                    style="width: 100%; height: 60vh"
                    @sort-change="handleSortChange"
                    @row-dblclick="handleRowDblclick"
          >
            <el-table-column type="index" fixed="left" label="序号" align="center" header-align="left"/>
            <el-table-column fixed="left" label="操作" width="50px" align="center" header-align="left">
              <template #default="scope">
                <el-button
                    link
                    type="primary"
                    @click.prevent="handleDeleteTestCase(scope)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <el-table-column :sortable="true" prop="case_name" label="用例名称" width="120px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="project.project_name" label="所属项目" width="100px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="priority" label="优先级" width="100px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="method" label="请求方法" width="100px" :formatter="methodFormatter" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="path" label="路径" width="300px" :show-overflow-tooltip="true"/>
            <el-table-column prop="precondition" label="前置请求" width="300px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="created_date" label="创建时间" width="200px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="created_by" label="创建人" width="200px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="updated_date" label="更新时间" width="200px" :show-overflow-tooltip="true"/>
            <el-table-column :sortable="true" prop="updated_by" label="更新人" width="200px" :show-overflow-tooltip="true"/>
          </el-table>
        </el-main>

        <el-footer class="test-case-footer">
          <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="[10, 20, 50, 100, 200]"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalItems"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </el-footer>
      </el-container>
    </el-card>
</template>

<style scoped>
.query-container {
  height: 100%;
}

.edit-container {
  height: 100%;
}
.test-case-card {
  height: 100%;
  width: 100%;
}
.test-case-header {
  height: 60px;
  width: 100%;
  margin-top: 20px;
}

.search-form {
  max-width: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.el-form-item {
  margin-right: 50px;
  width: 200px;
}

.edit-form {
  max-width: 100%;
  width: 100%;
  padding-left: 100px;
  margin: 30px;
}
</style>