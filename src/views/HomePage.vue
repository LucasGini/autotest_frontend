<script setup>
import { useTabsStore } from "@/store/syetem/tabs.js";

const tabsStore = useTabsStore()




</script>

<template>
  <el-card>
    <h1>
      这是首页
    </h1>
  </el-card>
</template>

<style scoped>
.el-card {
  height: 100vh;
}
</style>