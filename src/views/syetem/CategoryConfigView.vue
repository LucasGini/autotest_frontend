<script setup>
import {ref, onMounted, reactive} from "vue";
import {createCategoryConfig, deleteCategoryConfig, updateCategoryConfig} from "@/service/basic/categoryConfigService.js";
import {useCategoryConfig} from "@/store/syetem/categoryConfig.js";
import {ElMessage, ElMessageBox} from "element-plus";
import {createProject, deleteProject} from "@/service/case/testProjectService.js";

const categoryConfigStore = useCategoryConfig()
// 类型配置树
const categoryConfigTree = ref([])
// 选择器列表
const categoryConfigSelector = ref([])
// loading状态
const isLoading = ref(false)

// 加载组件前执行
onMounted(async () => {
  await initPage()
})

// 初始化页面
const initPage = async () => {
  await fetchCategoryConfigTree()
  await fetchCategoryConfigSelector()
}

// 类型组
const categoryConfigGroup = ref('testAccount')

// 查询类型配置树方法
const fetchCategoryConfigTree = async () => {
  try {
    isLoading.value = true
    await categoryConfigStore.setCategoryConfigTree({
      params: {
        categoryGroup: categoryConfigGroup.value
      }
    })
    categoryConfigTree.value = categoryConfigStore.categoryConfigTree
  } catch (e) {
    ElMessage.error(`查询类型配置树失败：${e}`)
  } finally {
    isLoading.value = false
  }
}

// 查询选择器列表方法
const fetchCategoryConfigSelector = async () => {
  try {
    isLoading.value = true
    await categoryConfigStore.setCategoryConfigList({
      params: {
        categoryParentId: 0
      }
    })
    categoryConfigSelector.value = categoryConfigStore.categoryConfigList
  } catch (e) {
    ElMessage.error(`查询类型配置选择器列表失败：${e}`)
  } finally {
    isLoading.value = false
  }
}

// 选择器值发生变更时触发事件
const handleSelectChange = () => {
  console.log('触发选择器值发生变更时触发事件')
  fetchCategoryConfigTree()
}

// 控制对话框显示
const dialogFormVisible = ref(false)

// 表单label长度
const formLabelWidth = ref('120px')

// 控制新增或修改的保存按钮显示: false 修改， true 新增
const isCreateOrUpdateSaveButton = ref(false)

// 控制是否只读
const isReadonly = ref(true)

// 节点级别
const nodeLevel = ref(0)

// 初始表单
const initCategoryConfigForm = reactive({
    id: null,
    category_group: '',
    category_name: '',
    category_code: '',
    category_description: '',
    category_parent_id: 0,
    sort_number: 0,
    readonly: false,
})

// 新增修改表单
const categoryConfigForm = reactive({...initCategoryConfigForm})

// 校验规则
const ruler = ref({
  category_group: [{required: true, message: '类型组不能为空', trigger: 'blur'}],
  category_name: [{required: true, message: '类型名称不能为空', trigger: 'blur'}]
})

// 校验结果
const categoryConfigRef = ref('')

// 打开新增窗口
const openCreateDialog = () => {
  categoryConfigRef.value = ''
  isCreateOrUpdateSaveButton.value = true
  dialogFormVisible.value = true
  isReadonly.value = false
}

// 打开修改窗口
const openUpdateDialog = () => {
  categoryConfigRef.value = ''
  isCreateOrUpdateSaveButton.value = false
  dialogFormVisible.value = true
  isReadonly.value = false
}

// 关闭窗口
const closeDialog = () => {
  isReadonly.value = true
  dialogFormVisible.value = false
}

// 获取节点级别
const getNodeLevel = (node) => {
  nodeLevel.value = node.level
}

// 处理点击新增按钮事件
const handleClickAppend = (node, data, event) => {
  // 重置categoryConfigForm的值
  console.log(data)
  getNodeLevel(node)
  categoryConfigForm.id = null
  categoryConfigForm.category_name = ''
  categoryConfigForm.category_code = ''
  categoryConfigForm.category_description = ''
  categoryConfigForm.sort_number = 0
  categoryConfigForm.readonly = false
  categoryConfigForm.category_parent_id = data.id
  categoryConfigForm.category_group = data.category_group
  // 打开新增窗口
  console.log(categoryConfigForm)
  openCreateDialog()
  // 阻止事件冒泡，触发父组件的node-click事件
  event.stopPropagation()
}

// 新增保存
const handleCreateSave = async () => {
  try {
    isLoading.value = true
    // 验证表单
    await categoryConfigRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await createCategoryConfig(categoryConfigForm)
    if (response.status === 201 && response.data.msg === 'OK') {
      ElMessage.success('新增成功')
      // 重新获取数据
      await initPage()
      closeDialog()
    } else {
      ElMessage.error('新增失败')
    }
  }catch (error) {
    ElMessage.error(error)
  } finally {
    isLoading.value = false
  }

}

// 处理点击修改按钮事件
const handleClickUpdate = (node, data, event) => {
  getNodeLevel(node)
  Object.keys(categoryConfigForm).forEach(key => {
    categoryConfigForm[key] = data[key]
  })
  openUpdateDialog()
  // 阻止事件冒泡，触发父组件的node-click事件
  event.stopPropagation()
}

// 修改保存
const handleUpdateSave = async () => {
  try {
    // 验证表单
    isLoading.value = true
    await categoryConfigRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    const response = await updateCategoryConfig(categoryConfigForm.id, categoryConfigForm)
    if (response.status === 200 && response.data.msg === 'OK') {
      ElMessage.success('修改成功')
      // 重新获取数据
      await initPage()
      closeDialog()
    } else {
      ElMessage.error('修改失败')
    }
  }catch (error) {
    ElMessage.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleClickDelete = async (node, data, event) => {
  try {
    ElMessageBox.confirm('请确认是否删除', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      center: true,
      draggable: true,
    }).then(async () => {
      isLoading.value = true
      getNodeLevel(node)
      const response = await deleteCategoryConfig(data.id)
      if (response.status === 204 && response.data === '') {
        ElMessage.success('删除成功')
        // 重新获取数据
        await initPage()
      } else {
        ElMessage.error('删除失败')
      }
    })
  } catch (error) {
    ElMessage.error(error)
  } finally {
    isLoading.value = false
  }
  // 阻止事件冒泡，触发父组件的node-click事件
  event.stopPropagation()
}

const handleNodeClick = (data, node, nodeValue) => {
  isReadonly.value = true
  dialogFormVisible.value = true
  Object.keys(categoryConfigForm).forEach(key => {
    categoryConfigForm[key] = data[key]
  })
}

// 处理点击新增父菜单事件
const handleCreateParent = () => {
  Object.keys(categoryConfigForm).forEach(key => {
    categoryConfigForm[key] = initCategoryConfigForm[key]
  })
  nodeLevel.value = 0
  openCreateDialog()
}


</script>

<template>
  <el-card class="category-config-tree-container" v-loading.fullscreen.lock="isLoading">
    <template #header>
      <div class="selector-and-button">
        <div class="select-container">
          <el-select v-model="categoryConfigGroup"
                     placeholder="选择配置类型"
                     @change="handleSelectChange"
          >
            <el-option v-for="item in categoryConfigSelector"
                       :key="item.id"
                       :label="item.category_group"
                       :value="item.category_group"
            >
            </el-option>
          </el-select>
        </div>
        <div class="add-parent-button">
          <el-tooltip placement="top" content="点击新增父组件">
            <el-button type="primary"
                       @click="handleCreateParent"
            >
              新增父菜单
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </template>
    <template #default>
      <div class="tree-container">
        <el-tree :data="categoryConfigTree"
                 default-expand-all
                 node-key="id"
                 style="max-width: 1000px"
                 :props="{label: 'category_name'}"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick"
        >
          <template #default="{node, data}">
          <span class="tree-node">
            <span>{{ node.label}}</span>
            <span>
              <a @click="handleClickAppend(node, data, $event)"> 新增 </a>
              <a @click="handleClickUpdate(node, data, $event)"> 修改 </a>
              <a @click="handleClickDelete(node, data, $event)"> 删除 </a>
            </span>
          </span>
          </template>
        </el-tree>
      </div>
    </template>
  </el-card>
  <el-dialog v-model="dialogFormVisible"
             :title="isReadonly ? '查看' : isCreateOrUpdateSaveButton ? '新增' : '修改'"
             width="500"
             class="dialog-container"
  >
    <el-form :model="categoryConfigForm"
             class="dialog-form"
             :rules="ruler"
             ref="categoryConfigRef"
    >
      <el-form-item label="类型组" :label-width="formLabelWidth" prop="category_group">
        <el-input v-model="categoryConfigForm.category_group"
                  :disabled="nodeLevel !==0"
                  style="width: 250px"/>
      </el-form-item>
      <el-form-item label="类型名称" :label-width="formLabelWidth" prop="category_name">
        <el-input v-model="categoryConfigForm.category_name"
                  :disabled="isReadonly"
                  style="width: 250px"/>
      </el-form-item>
      <el-form-item label="CODE" :label-width="formLabelWidth">
        <el-input v-model="categoryConfigForm.category_code"
                  :disabled="!isCreateOrUpdateSaveButton || isReadonly"
                  style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="categoryConfigForm.sort_number"
                  :disabled="isReadonly"
                  style="width: 250px"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="categoryConfigForm.category_description"
                  type="textarea"
                  rows="10"
                  style="width: 250px"
                  :disabled="isReadonly"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" v-show="!isReadonly">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"
                   v-show="isCreateOrUpdateSaveButton"
                   @click="handleCreateSave"
        >
          保存
        </el-button>
        <el-button type="primary"
                   v-show="!isCreateOrUpdateSaveButton"
                   @click="handleUpdateSave"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.category-config-tree-container {
  height: 80vh;
}
.tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-size: 14px;
  padding-right: 8px;
}
a {
  margin-left:8px;
  color: rgb(64, 158, 255)
}
.selector-and-button {
  width: 1000px;
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.select-container {
  width: 200px;
}
.add-parent-button {
  margin-right: 8px;
}

</style>