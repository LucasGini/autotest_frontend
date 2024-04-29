<script lang="ts" setup>
import { useTabs } from '@/store/tabs';
import router from "@/router/index.js";


const tabsStore = useTabs()

// 处理新增或者删除标签的事件
function handleTabsEdit(targetName, action) {
  // 如果操作为remove
  if (action === 'remove') {
    // 删除标签页
    tabsStore.removeTabs(targetName)
    // 如果删除的是选中的标签页，如果标签页大于0，则选中第一个标签
    if (tabsStore.editableTabsValue === targetName && tabsStore.editableTabs.length > 0) {
      tabsStore.updateEditableTabsValue(tabsStore.editableTabs[0].path)
    } else if ( tabsStore.editableTabs.length === 0 ) {
      tabsStore.updateEditableTabsValue('')
    }
  }
}

// 选择标签的操作
function handleTabsClick(pane, ev) {
  console.log(pane.paneName)
  console.log(ev)
  router.push(pane.paneName)
}

//
function handleTabsChange(name) {
  console.log(name)
}

function handleTabsAdd() {
  console.log('新增标签成功')
}

</script>

<template>
  <el-tabs
      v-model="tabsStore.editableTabsValue"
      type="border-card"
      class="tabsItem"
      closable
      @edit="handleTabsEdit"
      @tab-click="handleTabsClick"
      @tab-change="handleTabsChange"
      @tab-add="handleTabsAdd"
  >
    <el-tab-pane
        v-for="item in tabsStore.editableTabs"
        :key="item.id"
        :label="item.name"
        :name="item.path"
        class="tabPane"
    >
      <router-view></router-view>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.tabsItem > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.tabsItem {
  height: 100vh;
}
</style>