<script lang="ts" setup>
import { useTabs } from '@/store/tabs';
import router from "@/router/index.js";


const tabsStore = useTabs()

// 处理新增或者删除标签的事件
function handleTabsEdit(targetName, action) {
  console.log(targetName)
  console.log(action)
  // 如果操作为remove
  if (action === 'remove') {
    // 删除标签页
    tabsStore.removeTabs(targetName)
    // 如果删除的是选中的标签页，如果标签页大于0，则选中左边的标签
    if (tabsStore.editableTabsValue === targetName && tabsStore.editableTabs.length > 0) {
      // 删除标签页后选中的标签页本地存起来，用于刷新选中标签页
      localStorage.setItem('selectedTab', JSON.stringify(tabsStore.editableTabs[tabsStore.editableTabs.length-1]))
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
  console.log(pane)
  console.log(tabsStore.editableTabs.filter(t => t.path === pane.paneName)[0])
  localStorage.setItem('selectedTab', JSON.stringify(tabsStore.editableTabs.filter(t => t.path === pane.paneName)[0]))
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
    </el-tab-pane>
  </el-tabs>
  <div class="router-view-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>

.tabsItem {
  position: fixed;
  top: 60px;
  width: 100%;
  height: 39px;
  z-index: 100;
}
.router-view-container {
  padding: 54px 15px 15px;
}
.tabsItem > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

</style>