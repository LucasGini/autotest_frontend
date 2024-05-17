<script setup>
import {reactive, defineProps, getCurrentInstance, watch} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps(['data'])

// 获取当前组件实例
const { emit } = getCurrentInstance()

console.log('props',props.data)

const tableData = reactive(props.data)

const handleAddRow = (index, row) => {
  tableData.push({key:'', value: ''})
}


const handleDeleteRow = (index, row) => {
  console.log(index)
  console.log(row)
  if (tableData.length > 1) {
    tableData.splice(index, 1)
  } else {
    ElMessage.error('最后一行不允许删除')
  }
}
// 监听 tableData 的变化

watch(tableData, (newValue) => {
  emit('update:data', newValue)  // 触发自定义事件，并传递变化后的数据给父组件
})


</script>

<template>
  <el-scrollbar>
    <el-table :data="tableData"
              style="width: 100%"
              stripe
              border
    >
      <el-table-column label="Key" width="400px">
        <template #default="scope">
          <el-input v-model="scope.row.key"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Value" width="400px">
        <template #default="scope">
          <el-input v-model="scope.row.value"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleAddRow(scope.$index, scope.row)">
            +
          </el-button>
          <el-button
              size="small"
              type="danger"
              style="flex: 1; text-align: center"
              @click="handleDeleteRow(scope.$index, scope.row)"
          >
            _
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<style scoped>

</style>