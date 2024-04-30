<script setup>
import {useMenu} from '../store/menu.js'
import {useTabs} from "@/store/tabs.js";
import router from "@/router/index.js";
const menuStore = useMenu()
const tabsStore = useTabs()


const onBack = () => {
  tabsStore.updateEditableTabsValue('/')
  router.push('/')
  localStorage.removeItem('selectedTab')
}

</script>

<template>
  <div class="menu-header">
    <div class="collapse-button" @click="menuStore.toggleCollapse()">
      <el-icon>
        <component :is="menuStore.isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div aria-label="A complete example of page header" class="pageHeader">
      <el-page-header @back="onBack">
        <template #extra>
          <div class="flex items-center">
            <el-button>Print</el-button>
            <el-button type="primary" class="ml-2">Edit</el-button>
          </div>
        </template>
      </el-page-header>
    </div>

  </div>
</template>

<style scoped>

.collapse-button {
  display: flex;  /* 使用 Flexbox */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
  width: 40px;  /* 设置按钮宽度 */
  height: 40px;  /* 设置按钮高度 */
  cursor: pointer;  /* 鼠标样式 */
}
.menu-header {
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-between;  /* 左右对齐 */
  align-items: center;  /* 垂直居中 */
  padding: 10px;  /* 添加一些填充 */
  width: 100%;
}
.pageHeader{
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-between;  /* 左右对齐 */
  align-items: center;  /* 垂直居中 */
  padding: 10px;  /* 添加一些填充 */
  width: 100%;
}
.items-center {
  margin-right: 10px;
}
.el-page-header {
  width: 100%;
}
.el-page-header__left {
  width: 100%;
}
</style>