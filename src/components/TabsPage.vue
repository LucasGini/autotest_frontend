<script lang="ts" setup>
import { useTabsStore } from '@/store/syetem/tabs';
import router from "@/router/index.js";


const tabsStore = useTabsStore()

// 处理新增或者删除标签的事件
function handleTabsEdit(targetName, action) {
  // 如果操作为remove
  if (action === 'remove') {
    // 删除标签页
    tabsStore.removeTabs(targetName)
    // 如果删除的是选中的标签页，如果标签页大于0，则选中左边的标签
    if (tabsStore.editableTabsValue === targetName && tabsStore.editableTabs.length > 0) {
      // 删除标签页后选中的标签页本地存起来，用于刷新选中标签页
      sessionStorage.setItem('selectedTab', JSON.stringify(tabsStore.editableTabs[tabsStore.editableTabs.length-1]))
      let path = tabsStore.editableTabs[tabsStore.editableTabs.length-1].path
      tabsStore.updateEditableTabsValue(path)
      router.push(path)
    } else if ( tabsStore.editableTabs.length === 0 ) {
      tabsStore.updateEditableTabsValue('/')
    }
  }
}

// 选择标签的操作
function handleTabsClick(pane) {
  sessionStorage.setItem('selectedTab', JSON.stringify(tabsStore.editableTabs.filter(t => t.path === pane.paneName)[0]))
  router.push(pane.paneName)
}


</script>

<template>
  <el-tabs
      v-model="tabsStore.editableTabsValue"
      type="border-card"
      class="tabsItem"
      @edit="handleTabsEdit"
      @tab-click="handleTabsClick"
  >
    <el-tab-pane
        v-for="item in tabsStore.editableTabs"
        :key="item.id"
        :label="item.name"
        :name="item.path"
        class="tabPane"
        :closable="item.closable"
    >
      <div class="tab-content">

      </div>
    </el-tab-pane>
  </el-tabs>
  <div class="router-view-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>

.tabsItem {
  position: fixed;
  top: 50px;
  width: 100%;
  height: 0;
  z-index: 100;
}
.router-view-container {
  padding: 44px 15px 15px;
}

:deep.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

:deep.el-tabs--top.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  height: 30px;
}



</style>