<script setup>
import {useTestCaseStore} from "@/store/case/testCase.js";
import TestCaseSearchView from "@/views/case/TestCaseSearchView.vue";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const testCaseStore = useTestCaseStore()

onMounted(() => {
  let route = useRoute()
  if (route.path === '/case/testCase') {
    testCaseStore.openTestCaseSearchCard()
  }
})



</script>

<template>
  <div class="query-container" v-if="!testCaseStore.showSearchEditCard">
    <TestCaseSearchView/>
  </div>
  <div class="edit-container" v-if="testCaseStore.showSearchEditCard">
    <router-view></router-view>
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