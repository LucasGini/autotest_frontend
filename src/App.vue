<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import {useMenu} from "@/store/menu.js";
const menuStore = useMenu();
</script>

<template>
  <el-container>
    <el-aside :style="{width: menuStore.isCollapse ? '64px' : '200px'}">
      <Sidebar/>
    </el-aside>
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
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
.el-header {
  padding: 0;
}
.el-main {
  padding: 0;
}
</style>
