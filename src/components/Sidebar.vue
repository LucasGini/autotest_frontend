<script setup>
import { useMenu } from '../store/menu'
import { useTabs } from "@/store/tabs.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";


const menuStore = useMenu()

menuStore.getMenu()
let menuList = menuStore.menuList

const tabsStore = useTabs()
// 选中的标签页，刷新页面不删除
tabsStore.addTabs(JSON.parse(localStorage.getItem('selectedTab')))

// 点击菜单，新增标签页
const menuClick = (item) => {
  console.log('menuClick',item)
  const knownPaths = router.getRoutes().map(route => route.path); // 所有已知的路径
  if (!knownPaths.includes(item.path)) {
    ElMessage.error('路由还未配置，跳转首页')
    localStorage.removeItem('selectedTab')
  } else {
    tabsStore.addTabs(item)
  }
}


// 使用导航守卫重定向未知路径
router.beforeEach((to, from, next) => {
  const knownPaths = router.getRoutes().map(route => route.path); // 所有已知的路径
  if (!knownPaths.includes(to.path)) {
    tabsStore.updateEditableTabsValue('/')
    next('/');
  } else {
    menuStore.updateActivePath(to.path)
    next(); // 继续路由导航
  }
});

function handleSelect(key, keyPath) {
  console.log(key)
  console.log(keyPath)
}
</script>

<template>
  <div class="menu-header">
    <el-avatar
        class="mr-3"
        :size="40"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    />
    <p v-show="!menuStore.isCollapse" class="platform-name">
      自动化测试平台
    </p>
  </div>
  <el-menu
      mode="vertical"
      router
      :default-active="menuStore.activePath"
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

.platform-name{
  color: white;
}
.menu-header {
  height: 60px;
  background-color: #3a577e;
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-evenly;
  align-items: center;  /* 垂直居中 */
}
.el-menu-vertical-demo {
  /* 默认菜单宽度 */
  width: 200px;
  border: 0;
  height: 100vh;
}

.el-menu-vertical-demo.el-menu--collapse {
  /* 菜单收缩时的宽度 */
  width: 64px;
}



</style>