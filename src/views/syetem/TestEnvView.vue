<script setup>
import {useTestEnv} from "@/store/syetem/testEnv.js";
import {onMounted, ref, reactive} from "vue";
import {isEmpty} from "element-plus/es/utils/index";
import {ElMessage, ElMessageBox} from "element-plus";
import {AxiosError} from "axios";
import {createTestEnv, deleteTestEnv, updateTestEnv} from "@/service/basic/testEnvService.js";


let testEnvStore = useTestEnv();
let testEnvList = ref([]);

// 分页参数
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);

// 搜索和排序参数
const sortOrder = ref('-created_date');

// 查询时loading
const searchLoading = ref(false)

// 请求数据
const fetchTestEnvData =  async () => {
  searchLoading.value = true
  // 异步请求测试环境列表
  try {
    const response = await testEnvStore.setAllTestEnv(
        {params : {
            ...searchForm.value,
            page: currentPage.value,
            page_size: pageSize.value,
            ordering: !isEmpty(sortOrder.value) ? sortOrder.value : null,
          }}
    );
    totalItems.value = response.data.total
    testEnvList.value = testEnvStore.testEnvList
  } catch ( error ){
    if (error instanceof AxiosError) {
      ElMessage.error('请求异常')
    } else {
      ElMessage.error('系统异常')
    }
  } finally {
    searchLoading.value = false

  }
}

// 	page-size变更处理
const handleSizeChange = async (size) => {
  pageSize.value = size;
  await fetchTestEnvData()
}

// 当前页变更处理
const handleCurrentChange = async (page) => {
  currentPage.value = page
  await fetchTestEnvData()
}

// 排序处理
const handleSortChange = async (sort) => {
  console.log(sortOrder.value)
  if (sort.order === 'descending') {
    sortOrder.value = `-${sort.prop}`
  } else
    sortOrder.value = sort.prop
  await fetchTestEnvData(); // 重新获取数据
};

// 查询表单
const searchForm = ref( {
  envName: null,
  hosts: null,
  agreement: null,
  port: null,
})

// 查询处理
const searchFormSubmit = async () => {
  await fetchTestEnvData()
}


const agreementEnum = [
  {label: 'http', value: 0},
  {label: 'https', value: 1}
]

// 将agreementEnum转换为map， value为key， label 为值
const agreementMap = agreementEnum.reduce((map, item) => {
  map.set(item.value, item.label)
  return map
}, new Map())

// agreement字段格式化器
const agreementFormatter = (row, column, cellValue) => {
  return agreementMap.get(cellValue)
};

// 编辑对话框显示状态
const showEditDialog = ref(false)

const editForm = reactive( {
  env_name: '',
  hosts: '',
  agreement: null,
  port: '',
  remark: ''
})

const editFormRef = ref()

// 表单验证规则
let  editFormRules = ref({
  env_name: [
    {required: true, message: '环境名称不能为空', trigger: 'blur'},
  ],
  hosts: [
    {required: true, message: '域名或ip不能为空', trigger: 'blur'},
  ],
  agreement: [
    {required: true, message: '协议不能为空', trigger: 'blur'},
  ],
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
  Object.keys(editForm).forEach(key => {
      editForm[key] = ''
  })
}

// 新增测试环境数据
const createFormSubmit = async () => {
  try {
    // 验证表单
    await editFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await createTestEnv(editForm)
    if (response.status === 201 && response.data.msg === 'OK') {
      ElMessage.success('新增成功')
      showEditDialog.value = false
      // 重新获取数据
      await fetchTestEnvData()
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
    editForm.env_name = data.row.env_name
    editForm.agreement = data.row.agreement
    editForm.port = data.row.port
    editForm.remark = data.row.remark
    editForm.hosts = data.row.hosts
    editForm.id = data.row.id
  }
}

// 修改测试环境数据
const updateFormSubmit = async () => {
  try {
    // 验证表单
    await editFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await updateTestEnv(editForm.id, editForm)
    if (response.status === 200 && response.data.msg === 'OK') {
      ElMessage.success('修改成功')
      showEditDialog.value = false
      // 重新获取数据
      await fetchTestEnvData()
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error(error)
  }
}

// 删除测试环境功能
const handleDeleteTestEnv = async (data) => {
  try {
    ElMessageBox.confirm('请确认是否删除', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
      draggable: true,
    }).then(async () => {
      const response = await deleteTestEnv(data.row.id)
      if (response.status === 204 && response.data === '') {
        ElMessage.success('删除成功')
        // 重新获取数据
        await fetchTestEnvData()
      } else {
        ElMessage.error('删除失败')
      }
    })

  } catch (error) {
    ElMessage.error(error)
  }
}


onMounted(async () => {
  await fetchTestEnvData()
})

</script>

<template>
  <dev class="container">
    <el-card class="test-env-card">
        <el-container class="test-env-container">
          <el-header class="test-env-header">
            <el-form :model="searchForm"
                     class="search-form"
                     label-position="right"
            >
              <el-form-item label="环境名称">
                <el-input v-model="searchForm.envName" placeholder="请输入环境名称"/>
              </el-form-item>
              <el-form-item label="协议">
                <el-select v-model="searchForm.agreement" placeholder="请选择协议" clearable>
                  <el-option v-for="item in agreementEnum" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="端口号">
                <el-input v-model="searchForm.port" placeholder="请输入端口号"/>
              </el-form-item>
              <el-form-item label="域名或ip">
                <el-input v-model="searchForm.hosts" placeholder="请输入域名或ip"/>
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
          <el-main class="test-env-main">
            <el-table :data="testEnvList"
                      highlight-current-row
                      stripe
                      border
                      v-loading="searchLoading"
                      style="width: 100%; height: 60vh"
                      @sort-change="handleSortChange"
            >
              <el-table-column fixed="left" label="序号" type="index"/>
              <el-table-column fixed="left" label="操作" width="120px">
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
                      @click.prevent="handleDeleteTestEnv(scope)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :sortable="true" prop="env_name" label="环境名称" width="120px"/>
              <el-table-column :sortable="true" prop="agreement" :formatter="agreementFormatter" label="协议" width="100px"/>
              <el-table-column :sortable="true" prop="hosts" label="域名或ip" width="200px"/>
              <el-table-column :sortable="true" prop="port" label="端口" width="100px"/>
              <el-table-column prop="remark" label="备注" width="200px"/>
              <el-table-column :sortable="true" prop="created_date" label="创建时间" width="200px"/>
              <el-table-column :sortable="true" prop="created_by" label="创建人" width="200px"/>
              <el-table-column :sortable="true" prop="updated_date" label="更新时间" width="200px"/>
              <el-table-column :sortable="true" prop="updated_by" label="更新人" width="200px"/>

            </el-table>
          </el-main>
          <el-footer class="test-env-footer">
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

    <!--  环境新增及编辑对话框  -->
    <el-dialog v-model="showEditDialog"
               class="test-env-edit-dialog"
               width="600px"
               center
    >

        <el-form :model="editForm"
                 ref="editFormRef"
                 :rules="editFormRules"
                 class="edit-form"
                 label-width="auto"
        >
          <el-form-item label="环境名称" style="width: 300px;" prop="env_name">
            <el-input v-model="editForm.env_name" placeholder="请输入环境名称"/>
          </el-form-item>
          <el-form-item label="协议" style="width: 300px;" prop="agreement">
            <el-select v-model="editForm.agreement" placeholder="请选择协议" clearable>
              <el-option v-for="item in agreementEnum" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="域名或ip" style="width: 300px;" prop="hosts">
            <el-input v-model="editForm.hosts" placeholder="请输入域名或ip"/>
          </el-form-item>
          <el-form-item label="端口号" style="width: 300px;" prop="port">
            <el-input v-model="editForm.port" placeholder="请输入端口号"/>
          </el-form-item>
          <el-form-item label="备注" style="width: 300px;" prop="remark">
            <el-input type="textarea" v-model="editForm.remark" placeholder="请输入备注"/>
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
  </dev>

</template>

<style scoped>
.container {
  height: 100%;
}
.test-env-card {
  height: 100%;
  width: 100%;
}
.test-env-header {
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