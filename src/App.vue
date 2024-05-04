<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import {useMenu} from "@/store/syetem/menu.js";
import TabsPage from "@/components/TabsPage.vue";
const menuStore = useMenu();
</script>

<template>
  <el-container class="main-container">
    <el-scrollbar>
      <el-aside :style="{width: menuStore.isCollapse ? '64px' : '200px'}">
        <Sidebar/>
      </el-aside>
    </el-scrollbar>
    <el-container class="header-and-main-container">
      <el-header>
        <Header/>
      </el-header>
      <el-scrollbar>
        <el-main>
          <TabsPage></TabsPage>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<style scoped>
header {
  line-height: 1.5;
}


@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
.el-aside {
  padding: 0;
  margin: 0;
}

.header-and-main-container {
  flex: 1;
}
.main-container {
  height: 100vh;
}
.el-header {
  padding: 0;
  margin: 0;
  height: 60px;
  width: 100%;
  position: relative;
}
.el-main {
  padding: 0;
  margin: 0;
}

</style>
