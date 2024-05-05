<script setup>
import { useMenu } from '../store/syetem/menu.js'
import { useTabs } from "@/store/tabs.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";
import {onMounted, ref, reactive} from "vue";
import {AxiosError} from "axios";


const menuStore = useMenu()
let menuList = ref([]); // 创建本地 menuList

onMounted( async () => {
  await fetchMenuListData(); // 确保请求在组件挂载时发起
});

// 菜单变更时，实时变更
menuList.value = menuStore.menuList

// 查询loading状态
const searchLoading = ref(false)

const fetchMenuListData =  async () => {
  searchLoading.value = true
  // 异步请求测试环境列表
  try {
    return await menuStore.getMenuList();
  } catch ( error ){
    if (error instanceof AxiosError) {
      ElMessage.error('菜单请求异常')
    } else {
      ElMessage.error('系统异常')
    }
  } finally {
    searchLoading.value = false
  }
}



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

// 通过路由递归查询菜单树
const recursiveMenuSearch = (menuTree, path) => {
  console.log(menuTree)
 for (const menu of menuTree) {
    if (menu.path === path) {
      return menu  //返回匹配的菜单
    }
    if (menu.children) {
      // 递归搜索子菜单
      const found = recursiveMenuSearch(menu.children, path)
      console.log(found)
      if (found) {
        return found;  //返回匹配的菜单
      }
    }
  }
  return null  //未找到返回空
}

// 使用导航守卫重定向未知路径
router.beforeEach(async (to, from, next) => {
  const knownPaths = router.getRoutes().map(route => route.path); // 所有已知的路径
  if (!knownPaths.includes(to.path)) {
    tabsStore.updateEditableTabsValue('/')
    localStorage.removeItem('selectedTab')
    next('/');
  } else {
    menuStore.updateActivePath(to.path)
    next(); // 继续路由导航
    // 等待菜单树加载完成
    let menuTree = await fetchMenuListData();
    // 通过路由递归查询菜单树
    const menu = recursiveMenuSearch(menuTree, to.path)
    if (to.path === '/') {
      // 选中首页标签
      tabsStore.updateEditableTabsValue(to.path)
      // 初始化标签
      // tabsStore.initTabs()
      // 删除本地种保存的标签页
      localStorage.removeItem('selectedTab')
    }
    if (menu) {
      // 如果查找到,添加标签页
      tabsStore.addTabs(menu)
    }
  }
});

function handleSelect(key, keyPath) {
}
</script>

<template>
  <div class="sidebar" :style="{width: menuStore.isCollapse ? '64px': '200px'}">
    <div class="menu-header" :style="{width: menuStore.isCollapse ? '64px': '200px'}">
      <el-avatar
          class="mr-3"
          :size="40"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <p v-show="!menuStore.isCollapse" class="platform-name">
        自动化测试平台
      </p>
    </div>
    <el-scrollbar>
      <el-menu
          v-loading.fullscreen.lock="searchLoading"
          mode="vertical"
          router
          :default-active="menuStore.activePath"
          class="el-menu-vertical-demo"
          :collapse="menuStore.isCollapse"
          @select="handleSelect"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse-transition="false"
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
    </el-scrollbar>
  </div>


</template>

<style scoped>

.sidebar {
  height: 100vh;
  padding-top: 60px;
  position: relative;
}

.platform-name{
  color: white;
}
.menu-header {
  height: 60px;
  z-index: 100;
  background-color: #3a577e;
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-evenly;
  align-items: center;  /* 垂直居中 */
  position: fixed;
  top: 0;
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