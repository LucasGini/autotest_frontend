<script setup>
import {reactive, ref} from 'vue'
import { useMenu } from '../store/menu'
import { useTabs } from "@/store/tabs.js";
import router from "@/router/index.js";


let menuList = reactive([])
const menuStore = useMenu()
let isCollapse = menuStore.isCollapse

menuStore.getMenu()
menuList = menuStore.menu

const tabsStore = useTabs()
// 比较两个对象是否有相同值

// 点击菜单，新增标签页
const menuClick = (item) => {
  console.log('menuClick',item)
  // 定位到对应标签页
  router.push(item.path)
  tabsStore.updateEditableTabsValue(item.path)
  // editableTabs中存在相同的对象则不新增
  tabsStore.addTabs(item)
  localStorage.setItem('selectedTab', item)
}
const handleSelect = (key, indexPath) => {
  console.log('handleSelect: key', key)
  console.log('handleSelect: indexPath', indexPath)
}
</script>

<template>
  <el-radio-group style="margin-bottom: 60px">
  </el-radio-group>
    <el-menu
        mode="vertical"
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="menuStore.isCollapse"
        @select="handleSelect"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
    >
      <template v-for="item in menuList.value">
        <template v-if="item.children && item.children.length > 0 &&  item.is_hidden">
          <el-sub-menu :index="item.path" :key="item.id">
            <template #title>
            <component class="el-icon" :is="item.icon"></component>
            <span>{{ item.name }}</span>
            </template>
            <template v-for="child in item.children">
              <template v-if="child.children && child.children.length > 0 && child.is_hidden">
                <el-sub-menu :index="child.path" :key="child.id">
                  <template #title>
                    <component class="el-icon" :is="child.icon"></component>
                    <span>{{ child.name }}</span>
                  </template>
                  <template v-for="grandchild in child.children">
                    <template v-if="grandchild.is_hidden">
                      <el-menu-item :key="grandchild.id" :index="grandchild.path" @click="menuClick(grandchild)">
                        <component class="el-icon" :is="grandchild.icon"></component>
                        <span slot="title">{{ grandchild.name }}</span>
                      </el-menu-item>
                    </template>
                  </template>
                </el-sub-menu>
              </template>
              <template v-else-if="child.is_hidden">
                <el-menu-item :index="child.path" :key="child.id" @click="menuClick(child)">
                  <component class="el-icon" :is="child.icon"></component>
                  <span slot="title">{{ child.name }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
        <template v-else-if="item.is_hidden">
          <el-menu-item :index="item.path" :key="item.id" @click="menuClick(item)">
            <component class="el-icon" :is="item.icon"></component>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
</template>

<style scoped>
.el-menu-vertical-demo {
  /* 默认菜单宽度 */
  width: 200px;
}

.el-menu-vertical-demo.el-menu--collapse {
  /* 菜单收缩时的宽度 */
  width: 64px;
}



</style>