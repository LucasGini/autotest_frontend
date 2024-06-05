<script setup>
import {useMenuStore} from '../store/syetem/menu.js'
const menuStore = useMenuStore()



</script>

<template>
  <div class="main-header">
    <div class="collapse-button" @click="menuStore.toggleCollapse()">
      <el-icon>
        <component :is="menuStore.isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>

  </div>
</template>

<style scoped>

.collapse-button {
  display: flex;  /* 使用 Flexbox */
  justify-content: center;  /* 水平居中 */
  align-items: center;  /* 垂直居中 */
  width: 40px;  /* 设置按钮宽度 */
  height: 40px;  /* 设置按钮高度 */
  cursor: pointer;  /* 鼠标样式 */
}
.main-header {
  box-sizing: border-box;
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-between;  /* 左右对齐 */
  align-items: center;  /* 垂直居中 */
  padding: 0;  /* 添加一些填充 */
  min-width: 100%;
  position: absolute;
  height: 50px;
  top: 0;
}
.pageHeader{
  display: flex;  /* 设置 Flexbox 布局 */
  justify-content: space-between;  /* 左右对齐 */
  align-items: center;  /* 垂直居中 */
  width: 100%;
}
.items-center {
  margin-right: 30px;
}

.el-page-header {
  width: 100%;
}
.el-page-header__left {
  width: 100%;
}
</style>