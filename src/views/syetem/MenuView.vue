<script setup>
import {useMenu} from "@/store/syetem/menu.js";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {isEmpty} from "element-plus/es/utils/index";
import {createMenu, deleteMenu, updateMenu} from "@/service/basic/menuService.js";

const menuStore = useMenu()

let menuList = menuStore.menuList

const defaultProps = {
  label: 'name',
  children: 'children'
}

// 菜单层级
let menuLevel = ref()
// 控制表单组件是否可用
let isFormDisabled = ref(true)
// 控制显示新增表单卡片
let showCreateFormCard = ref(false)
// 控制显示修改表单卡片
let showUpdateFormCard = ref(false)

// 是否生效枚举
let isHiddenEnum = [
  {label: '是', value: 1},
  {label: '否', value: 0}
]

// 打开新增表单卡片，关闭修改表单卡片
function openCreateFormCard() {
  showCreateFormCard.value = true
  showUpdateFormCard.value = false
}

// 打开修改表单卡片，关闭新增表单卡片
function openUpdateFormCard() {
  showCreateFormCard.value = false
  showUpdateFormCard.value = true
}
// 关闭所有表单卡片
function closeAllFormCard() {
  showCreateFormCard.value = false
  showUpdateFormCard.value = false
}

// 菜单修改表单定义
let menuUpdateFormData = reactive({
  name: '',
  path: '',
  component: '',
  icon: '',
  parent_id: '',
  order_num: '',
  is_hidden: '',
  parent_name: '',
  id: null
})

const updateRuleFormRef = ref()

// 表单验证规则
let updateMenuFormRules = ref({
  name: [
    {required: true, message: '菜单名称不能为空', trigger: 'blur'},
  ],
  path: [
    {required: true, message: '菜单路由不能为空', trigger: 'blur'},
  ],
  component: [
    {required: true, message: '组件资源不能为空', trigger: 'blur'},
  ],
  icon: [
    {required: true, message: '菜单图标不能为空', trigger: 'blur'},
  ],
  order_num: [
    {required: true, message: '菜单排序不能为空', trigger: 'blur'},
  ]

})



// 提交修改菜单表单
async function updateMenuFormSubmit() {
  try {
    // 验证表单
    await updateRuleFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    // 发送HTTP请求
    isCreateLoading.value = true
    const response = await updateMenu(menuUpdateFormData.id, menuUpdateFormData)
    if (response.status === 200 && response.data.msg === 'OK') {
      console.log('请求成功')
      openUpdateFormCard()  // 打开详情卡片
      buildDetailData(menuUpdateFormData)  // 加载详情数据
      isFormDisabled.value = true   // 表单禁止编辑
      await menuStore.getMenuList()  // 刷新菜单
    } else {
      ElMessage.error('菜单修改失败')
    }
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    isCreateLoading.value = false

  }
}

// 构建详情页数据
function buildDetailData(obj ,node=undefined) {
  menuUpdateFormData.id = obj.id
  menuUpdateFormData.name = obj.name;
  menuUpdateFormData.path = obj.path;
  menuUpdateFormData.component = obj.component;
  menuUpdateFormData.icon = obj.icon;
  menuUpdateFormData.parent_id = obj.parent_id;
  menuUpdateFormData.order_num = obj.order_num;
  menuUpdateFormData.is_hidden = obj.is_hidden;
  if ( isEmpty( obj.parent_name ) ) {
    // 如果父菜单名称不为空，则填充到menuUpdateFormData
    if (node !== undefined && !(node.parent.data.name === undefined)) {
      menuUpdateFormData.parent_name = node.parent.data.name
    } else {
      menuUpdateFormData.parent_name = ''
    }
  } else {
    menuUpdateFormData.parent_name = obj.parent_name
  }

}

// 点击菜单树事件函数
function handleNodeClick(obj, node, treeNode, ev) {

  if (!isEmpty(obj)){
    menuLevel.value = node.level
    buildDetailData(obj, node)
    isFormDisabled.value = true
    openUpdateFormCard()
  }


}


// 点击编辑按钮事件函数
function handleUpdateMenu() {
  if (menuUpdateFormData.id === '' || menuUpdateFormData.name === '') {
    ElMessage.error('请选择左侧菜单进行修改')
  }
  isFormDisabled.value = false
  openUpdateFormCard()

}

// 菜单新增表单定义
let menuCreateFormData = reactive({
  name: '',
  path: '',
  component: '',
  icon: '',
  parent_id: '',
  order_num: '',
  is_hidden: 1,
  parent_name: '',
  id: null
})

const createRuleFormRef = ref()

// 表单验证规则
let createMenuFormRules = ref({
  name: [
    {required: true, message: '菜单名称不能为空', trigger: 'blur'},
  ],
  path: [
    {required: true, message: '菜单路由不能为空', trigger: 'blur'},
  ],
  component: [
    {required: true, message: '组件资源不能为空', trigger: 'blur'},
  ],
  icon: [
    {required: true, message: '菜单图标不能为空', trigger: 'blur'},
  ],
  order_num: [
    {required: true, message: '菜单排序不能为空', trigger: 'blur'},
  ]

})

// 点击新增按钮事件函数
function handleCreateMenu(){
  // 重置menuCreateFormData的值
  Object.keys(menuCreateFormData).forEach(key => {
    if (key !== 'is_hidden'){
      menuCreateFormData[key] = null
    }
  })
  isFormDisabled.value = false
  openCreateFormCard()
}
// 点击+号按钮事件函数
function appSubmenu(data, event) {
  // 阻止事件冒泡，触发父组件的node-click事件
  event.stopPropagation()
  isFormDisabled.value = false
  openCreateFormCard()
  if (isEmpty(data)) {
    return
  }
  if (data.id !== '' && data.name !== ''){
    menuCreateFormData.parent_id = data.id
    menuCreateFormData.parent_name = data.name
  }
}

// 保存按钮loading状态
let isCreateLoading = ref(false)
// 提交创建菜单表单
async function createMenuFormSubmit() {
  try {
    // 验证表单
    await createRuleFormRef.value.validate().catch(err => {
      throw '表单校验失败'
    })
    // 发送HTTP请求
    isCreateLoading.value = true
    const response = await createMenu(menuCreateFormData)
    if (response.status === 201 && response.data.msg === 'OK') {
      openUpdateFormCard()  // 打开详情卡片
      buildDetailData(menuCreateFormData)  // 加载详情数据
      isFormDisabled.value = true   // 表单禁止编辑
      await menuStore.getMenuList()  // 刷新菜单
    } else {
      ElMessage.error('菜单新增失败');
    }
  } catch (e) {
    ElMessage.error('请求发生错误: ' + e)
  } finally {
    isCreateLoading.value = false; // 无论成功与否，确保加载状态关闭
  }
}

// 删除确认弹窗状态
const dialogVisible = ref(false)

// 确认删除处理
const handleConfirmDelete = async () => {
  dialogVisible.value = false
  let menuId = menuUpdateFormData.id
  if ( isEmpty(menuId) ) {
    ElMessage.error('请选择需要删除的菜单')
  }
  try {
    let response = await deleteMenu(menuId)
    console.log(response)
    if (response.status === 204 && response.data === '') {
      closeAllFormCard() // 关闭所有表单卡片
      isFormDisabled.value = true
      await menuStore.getMenuList()  // 刷新菜单
    } else {
      ElMessage.error('菜单删除失败')
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

</script>

<template>
  <div class="container">
    <el-card class="menu-card">
      <template #header>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="新增一级菜单"
            placement="top-start"
        >
          <el-button
              size="small"
              type="primary"
              @click="handleCreateMenu"
          >
            新增
          </el-button>
        </el-tooltip>
      </template>
      <template #default>
        <el-scrollbar>
          <el-tree
              highlight-current
              :expand-on-click-node="false"
              class="menu-tree"
              style="max-width: 600px"
              :data="menuList.value"
              :props="defaultProps"
              @node-click="handleNodeClick"
          >
            <template #default="{node, data}">
              <span class="custom-tree-node">
                <span>{{ node.label}}</span>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="新增子菜单"
                    placement="top-start"
                >
                  <a @click="appSubmenu(data, $event)" style="color: rgb(64, 158, 255);" v-show="node.level < 3"> + </a>
                </el-tooltip>
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </template>

    </el-card>

    <!-- 新增功能表单卡片  -->
    <el-card class="edit-card" v-show="showCreateFormCard">
      <template #header>
        <el-button type="primary" disabled>修改</el-button>
      </template>
      <template #default>
        <el-scrollbar>
          <el-form
              ref="createRuleFormRef"
              class="menu-form"
              :model="menuCreateFormData"
              label-width="auto"
              style="max-width: 600px"
              :rules="createMenuFormRules"
              :disabled="isFormDisabled">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuCreateFormData.name" />
            </el-form-item>
            <el-form-item label="菜单路由" prop="path">
              <el-input v-model="menuCreateFormData.path" />
            </el-form-item>
            <el-form-item label="组件资源" prop="component">
              <el-input v-model="menuCreateFormData.component" />
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="menuCreateFormData.icon" />
            </el-form-item>
            <el-form-item label="父菜单id">
              <el-input v-model="menuCreateFormData.parent_id" disabled />
            </el-form-item>
            <el-form-item label="父菜单名称">
              <el-input v-model="menuCreateFormData.parent_name" disabled />
            </el-form-item>
            <el-form-item label="排序" prop="order_num">
              <el-input v-model="menuCreateFormData.order_num" />
            </el-form-item>
            <el-form-item label="是否生效">
              <el-select v-model="menuCreateFormData.is_hidden" placeholder="请选择是否生效">
                <el-option v-for="item in isHiddenEnum" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="createMenuFormSubmit" :loading="isCreateLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </template>

    </el-card>


    <!-- 修改功能表单卡片  -->
    <el-card class="edit-card" v-show="showUpdateFormCard">
      <template #header>
        <el-button
            size="small"
            type="primary"
            @click="handleUpdateMenu"
        >
          修改</el-button>
        <el-button
            size="small"
            type="danger"
            :disabled="!isFormDisabled"
            @click="dialogVisible = true"
        >
          删除</el-button>
      </template>
      <template #default>
        <el-scrollbar>
          <el-form
              ref="updateRuleFormRef"
              class="menu-form"
              :model="menuUpdateFormData"
              label-width="auto"
              style="max-width: 600px"
              :rules="updateMenuFormRules"
              :disabled="isFormDisabled">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="menuUpdateFormData.name" />
            </el-form-item>
            <el-form-item label="菜单路由" prop="path">
              <el-input v-model="menuUpdateFormData.path" />
            </el-form-item>
            <el-form-item label="组件资源" prop="component">
              <el-input v-model="menuUpdateFormData.component" />
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="menuUpdateFormData.icon" />
            </el-form-item>
            <el-form-item label="父菜单id">
              <el-input v-model="menuUpdateFormData.parent_id" disabled/>
            </el-form-item>
            <el-form-item label="父菜单名称">
              <el-input v-model="menuUpdateFormData.parent_name" disabled />
            </el-form-item>
            <el-form-item label="排序" prop="order_num">
              <el-input v-model="menuUpdateFormData.order_num" />
            </el-form-item>
            <el-form-item label="是否生效">
              <el-select v-model="menuUpdateFormData.is_hidden" placeholder="please select your zone">
                <el-option v-for="item in isHiddenEnum" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary"
                         @click="updateMenuFormSubmit"
                         :loading="isCreateLoading"
                         v-show="!isFormDisabled"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </template>
    </el-card>

    <!--  确认弹窗  -->
    <el-dialog
        v-model="dialogVisible"
        :close-on-click-modal="false"
        title="提示"
        width="500"
    >
      <span>请确认是否删除该菜单</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmDelete">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.menu-card {
  height: 100%;
  width: 50%;
  margin-right: 5px;
}
.menu-tree {
  height: 650px;
}
.edit-card {
  height: 100%;
  width: 50%;
  margin-left: 5px;
}
.menu-form{
  height: 650px;
}
</style>