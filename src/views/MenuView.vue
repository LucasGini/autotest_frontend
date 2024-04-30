<script setup>
import {useTabs} from "@/store/tabs.js";

const tabsStore = useTabs()
import { onBeforeRouteUpdate } from 'vue-router';

onBeforeRouteUpdate((to, from, next) => {
  console.log('Route is updating from', from.path, 'to', to.path);
  // 您可以在这里执行其他操作
  next(); // 继续路由更新
});


</script>

<template>
  <div class="container">
    <el-card>
      <h1>这个是菜单</h1>
    </el-card>
  </div>
</template>

<style scoped>

</style>