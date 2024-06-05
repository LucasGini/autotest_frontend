<script setup>
import {useProjectStore} from "@/store/case/project.js";
import {ref, onMounted, reactive} from "vue";
import {AxiosError} from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {createProject, deleteProject, updateProject} from "@/service/case/testProjectService.js";
import {isEmpty} from "element-plus/es/utils/index";
import {useUserStore} from "@/store/user/user.js"

const projectStore = useProjectStore();

// 页面加载刷新数据
onMounted( async () => {
  await fetchProjectList()
})

// 项目列表
const projectList = ref([]);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);

// 排序参数
const sortOrder = ref('-created_date')

// 查询时loading
const searchLoading = ref(false)

// 查询表单
const searchForm = ref({
  projectName: null,
  responsible: null
})

// 查询处理
const searchFormSubmit = async () => {
  await fetchProjectList()
}


// 获取项目列表数据
const fetchProjectList = async () => {
  try {
    const response = await projectStore.setProjectList({
      params: {
        ...searchForm.value,
        page: currentPage.value,
        page_size: pageSize.value,
        ordering: sortOrder.value ? sortOrder.value : null
      }
    })
    projectList.value = projectStore.projectList
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
  await fetchProjectList()
}

// 当前页变更处理
const handleCurrentChange = async (page) => {
  currentPage.value = page
  await fetchProjectList()
}

// 排序处理
const handleSortChange = async (sort) => {
  console.log(sortOrder.value)
  if (sort.order === 'descending') {
    sortOrder.value = `-${sort.prop}`
  } else
    sortOrder.value = sort.prop
  await fetchProjectList(); // 重新获取数据
};

// 编辑对话框显示状态
const showEditDialog = ref(false)

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

// 点击新增按钮
const handleCreateButtonClick = () => {
  // 显示新增的保存按钮
  isCreateOrUpdateMode.value = true
  // 打开编辑对话框
  showEditDialog.value = true
  // 重置editForm的值
  Object.keys(projectEditForm).forEach(key => {
    projectEditForm[key] = ''
  })
}

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
      await fetchProjectList()
    } else {
      ElMessage.error('新增失败')
    }
  } catch (error) {
    ElMessage.error(error)
  }
}

// 点击修改按钮
const handleUpdateButtonClick = (data) => {
  if (!isEmpty(data)) {
    // 显示修改的保存按钮
    console.log(data.row)
    isCreateOrUpdateMode.value = false
    // 打开编辑对话框
    showEditDialog.value = true
    projectEditForm.project_name = data.row.project_name
    projectEditForm.responsible = data.row.responsible
    projectEditForm.remark = data.row.remark
    projectEditForm.id = data.row.id
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
      await fetchProjectList()
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error(error)
  }
}

// 删除测试环境功能
const handleDeleteProject = async (data) => {
  try {
    ElMessageBox.confirm('请确认是否删除', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
      draggable: true,
    }).then(async () => {
      const response = await deleteProject(data.row.id)
      if (response.status === 204 && response.data === '') {
        ElMessage.success('删除成功')
        // 重新获取数据
        await fetchProjectList()
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

const userStore = useUserStore()

// 用户列表
const userList = ref([])

// 用户搜索框失去焦点处理方法
const handleResponsibleBlur = () => {
  userList.value = []
}

// 远程搜索用户
const remoteMethod = async (query) => {
  if (query) {
    remoteSearchLoading.value = true
    try {
      let response = await userStore.setUserList(query)
      if (response.status === 200 && !isEmpty(response.data.data)){
        userList.value = userStore.userList
      }
    } catch (error) {
      ElMessage.error('查询用户异常')
    } finally {
      remoteSearchLoading.value = false
    }
  }
}


</script>

<template>
  <div class="container">
    <el-card class="test-project-card">
      <el-container class="test-project-container">
        <el-header class="test-project-header">
          <el-form :model="searchForm"
                   class="search-form"
                   label-position="right"
          >
            <el-form-item label="项目名称">
              <el-input v-model="searchForm.projectName" placeholder="请输入环境名称"/>
            </el-form-item>
            <el-form-item label="负责人" prop="responsible">
              <el-select
                  v-model="searchForm.responsible"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入id或用户名"
                  :remote-method="remoteMethod"
                  @blur="handleResponsibleBlur"
                  :loading="remoteSearchLoading"
              >
                <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                />
              </el-select>
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
        <el-main class="test-project-main">
          <el-table :data="projectList"
                    highlight-current-row
                    stripe
                    border
                    v-loading="searchLoading"
                    style="width: 100%; height: 60vh"
                    @sort-change="handleSortChange"
          >
            <el-table-column fixed="left"
                             type="index"
                             label="序号"
                             header-align="left"
                             align="center"
            />
            <el-table-column fixed="left"
                             label="操作"
                             width="120px"
                             align="center"
                             header-align="left"
            >
              <template #default="scope">
                <el-button
                    link
                    type="primary"
                    @click.prevent="handleUpdateButtonClick(scope)"
                >
                  修改
                </el-button>
                <el-button
                    link
                    type="primary"
                    @click.prevent="handleDeleteProject(scope)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            <el-table-column :sortable="true"
                             prop="project_name"
                             label="项目名称"
                             width="120px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column :sortable="true"
                             prop="responsible"
                             label="责任人"
                             width="100px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column prop="remark"
                             label="备注" width="400px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column :sortable="true"
                             prop="created_date"
                             label="创建时间"
                             width="200px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column :sortable="true"
                             prop="created_by"
                             label="创建人"
                             width="200px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column :sortable="true"
                             prop="updated_date"
                             label="更新时间"
                             width="200px"
                             :show-overflow-tooltip="true"
            />
            <el-table-column :sortable="true"
                             prop="updated_by"
                             label="更新人"
                             width="200px"
                             :show-overflow-tooltip="true"
            />
          </el-table>
        </el-main>

        <el-footer class="test-project-footer">
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

    <!--  项目新增及编辑对话框  -->
    <el-dialog v-model="showEditDialog"
               class="test-env-edit-dialog"
               width="600px"
               center
    >

      <el-form :model="projectEditForm"
               ref="projectEditFormRef"
               :rules="projectEditFormRules"
               class="edit-form"
               label-width="auto"
      >
        <el-form-item label="项目名称" style="width: 300px;" prop="project_name">
          <el-input v-model="projectEditForm.project_name" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="负责人" style="width: 300px;" prop="responsible">
          <el-select
              v-model="projectEditForm.responsible"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入id或用户名"
              :remote-method="remoteMethod"
              @blur="handleResponsibleBlur"
              :loading="remoteSearchLoading"
              style="width: 300px"
          >
            <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" style="width: 300px;" prop="remark">
          <el-input type="textarea" v-model="projectEditForm.remark" placeholder="请输入备注"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div>
          <el-button @click="showEditDialog = false" size="default">取消</el-button>
          <el-button type="primary"
                     @click="createFormSubmit"
                     v-show="isCreateOrUpdateMode"
          >
            保存
          </el-button>
          <el-button type="primary"
                     @click="updateFormSubmit"
                     v-show="!isCreateOrUpdateMode"
          >
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<style scoped>
.container {
  height: 100%;
}
.test-project-card {
  height: 100%;
  width: 100%;
}
.test-project-header {
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