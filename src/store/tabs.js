import {defineStore} from 'pinia';
import {reactive, ref} from "vue";

export const useTabs = defineStore('tabs', () => {

    let editableTabs = reactive([{
        name: "首页",
        path: '/',
        id: 0,
        closable: false
    }]);
    let editableTabsValue = ref('/')

    const isSameObject = (a, b) => {
        return a.id === b.id && a.name === b.name
    }

    function addTabs(tabs) {
        if (tabs.id === 0) {
            tabs.closable = false
        } else {
            tabs.closable = true
        }
        if (!editableTabs.some(obj => isSameObject(obj, tabs))){
            editableTabs.push(tabs)
        }

    }

    function updateEditableTabsValue(data) {
        editableTabsValue.value = data
    }

    function removeTabs(path) {
        const index = editableTabs.findIndex(tabs => tabs.path === path);
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