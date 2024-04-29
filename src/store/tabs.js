import {defineStore} from 'pinia';
import {reactive, ref} from "vue";

export const useTabs = defineStore('tabs', () => {

    let editableTabs = reactive([]);
    let editableTabsValue = ref('')

    function addTabs(tabs) {
        editableTabs.push(tabs)
    }

    function updateEditableTabsValue(data) {
        editableTabsValue.value = data
    }

    function removeTabs(id) {
        const index = editableTabs.findIndex(tabs => tabs.id === id);
        if (index !== -1) { // 如果找到索引
            editableTabs.splice(index, 1); // 删除索引对应的对象
        }
    }


    return {
        editableTabs,
        addTabs,
        removeTabs,
        editableTabsValue,
        updateEditableTabsValue
    }
})