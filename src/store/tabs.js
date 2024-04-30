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
        if (!tabs) {
            return
        }
        tabs.closable = tabs.id !== 0;
        // 选中的标签本地存储起来，用于刷新页面后定位到选中页签
        localStorage.setItem('selectedTab', JSON.stringify(tabs))
        // 定位到新增的标签
        updateEditableTabsValue(tabs.path)
        // 如果标签对象不存在editableTabs中，则新增
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