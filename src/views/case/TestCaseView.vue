<script setup>
import {useTestCase} from "@/store/case/testCase.js";
import TestCaseSearchView from "@/views/case/TestCaseSearchView.vue";
import TestCaseEditView from "@/views/case/TestCaseEditView.vue";
import {onMounted} from "vue";

const testCaseStore = useTestCase()

onMounted(() => {
  testCaseStore.openTestCaseSearchCard()
})



</script>

<template>
  <div class="query-container" v-show="!testCaseStore.showSearchEditCard">
    <TestCaseSearchView/>
  </div>
  <div class="edit-container" v-show="testCaseStore.showSearchEditCard">
    <TestCaseEditView/>
  </div>

</template>

<style scoped>
.query-container {
  height: 100%;
}

.edit-container {
  height: 100%;
}

</style>