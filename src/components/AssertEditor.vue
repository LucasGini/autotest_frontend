<script setup>
import {reactive, ref, watch, getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";

// 获取父组件传的值
const props = defineProps(['data'])

const assertData = reactive(props.data)

// 获取当前组件实例
const { emit } = getCurrentInstance()

// 处理点击新增按钮事件
const handleAddRow = () => {
  assertData.push({
    assert: '',
    path: '',
    value: '',
    types: '',
    meg: ''
  })
}

// 处理点击删除按钮事件
const handleDeleteRow = (index, row) => {
  if (assertData.length > 1) {
    assertData.splice(index, 1)
  } else {
    ElMessage.error('最后一行不能删除')
  }
}

// 断言类型枚举
const assertTypeEnum = ref([
  {label: 'assertEqual', value: 'assertEqual'},
  {label: 'assertNotEqual', value: 'assertNotEqual'},
  {label: 'assertTrue', value: 'assertTrue'},
  {label: 'assertFalse', value: 'assertFalse'},
  {label: 'assertIs', value: 'assertIs'},
  {label: 'assertIsNot', value: 'assertIsNot'},
  {label: 'assertIsNone', value: 'assertIsNone'},
  {label: 'assertIsNotNone', value: 'assertIsNotNone'},
  {label: 'assertIn', value: 'assertIn'},
  {label: 'assertNotIn', value: 'assertNotIn'},
  {label: 'assertIsInstance', value: 'assertIsInstance'},
  {label: 'assertNotIsInstance', value: 'assertNotIsInstance'},
  {label: 'assertAlmostEqual', value: 'assertAlmostEqual'},
  {label: 'assertNotAlmostEqual', value: 'assertNotAlmostEqual'},
  {label: 'assertGreater', value: 'assertGreater'},
  {label: 'assertGreaterEqual', value: 'assertGreaterEqual'},
  {label: 'assertLess', value: 'assertLess'},
  {label: 'assertLessEqual', value: 'assertLessEqual'},
  {label: 'assertRegex', value: 'assertRegex'},
  {label: 'assertNotRegex', value: 'assertNotRegex'},
])

// 数据类型枚举
const dataTypeEnum = ref([
  {label: 'int', value: 'int'},
  {label: 'float', value: 'float'},
  {label: 'bool', value: 'bool'},
  {label: 'str', value: 'str'},
  {label: 'list', value: 'list'},
  {label: 'tuple', value: 'tuple'},
  {label: 'set', value: 'set'},
  {label: 'dict', value: 'dict'},
])

// 监听assertData变更
watch(assertData, (newValue) => {
  emit('update:data', newValue)  // 触发自定义事件，并传递变化后的数据给父组件
})


</script>

<template>
  <div class="assert-body">
    <el-table :data="assertData"
              style="width: 100%;"
              stripe
              border
    >
      <el-table-column label="断言类型">
        <template #default="scope">
          <el-select v-model="scope.row.assert">
            <el-option v-for="item in assertTypeEnum"
                       :label="item.label"
                       :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="返回值路径">
        <template #default="scope">
          <el-input v-model="scope.row.path">

          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="数据类型">
        <template #default="scope">
          <el-select v-model="scope.row.types">
            <el-option v-for="item in dataTypeEnum"
                       :label="item.label"
                       :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="校验值">
        <template #default="scope">
          <el-input v-model="scope.row.value">

          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="Message">
        <template #default="scope">
          <el-input v-model="scope.row.meg">

          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleAddRow(scope.$index, scope.row)">+</el-button>
          <el-button type="danger" @click="handleDeleteRow(scope.$index, scope.row)">-</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<style scoped>

</style>