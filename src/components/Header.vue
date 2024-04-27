<script setup>
import {ref} from "vue";
import {useMenu} from '../store/menu.js'
const menuStore = useMenu()

</script>

<template>
  <div class="menu-header">
    <div class="collapse-button" @click="menuStore.toggleCollapse()">
      <el-icon>
        <component :is="menuStore.isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>

</style>