import {defineStore} from 'pinia';
import {reactive, ref} from "vue";

export const useTabs = defineStore('tabs', () => {

    // 标签列表
    let editableTabs = reactive([{
        name: "首页",
        path: '/',
        id: 0,
        closable: false
    }]);

    // 选中的对象
    let editableTabsValue = ref('/')

    const isSameObject = (a, b) => {
        return a.id === b.id || a.name === b.name
    }


    // 添加标签
    function addTabs(tabs) {
        if (!tabs) {
            return
        }
        tabs.closable = tabs.id !== 0;
        // 选中的标签本地存储起来，用于刷新页面后定位到选中页签
        sessionStorage.setItem('selectedTab', JSON.stringify(tabs))
        // 定位到新增的标签
        updateEditableTabsValue(tabs.path)
        // 如果标签对象不存在editableTabs中，则新增
        if (!editableTabs.some(obj => isSameObject(obj, tabs))){
            editableTabs.push(tabs)
        }

    }


    // 更新标签选择对象
    function updateEditableTabsValue(data) {
        editableTabsValue.value = data
    }

    // 根据路由删除标签
    function removeTabs(path) {
        const index = editableTabs.findIndex(tabs => tabs.path === path);
        if (index !== -1) { // 如果找到索引
            editableTabs.splice(index, 1); // 删除索引对应的对象
        }
    }

    // 初始化菜单
    function initTabs() {
        editableTabs.splice(1, editableTabs.length)
    }


    return {
        editableTabs,
        addTabs,
        removeTabs,
        editableTabsValue,
        updateEditableTabsValue,
        initTabs
    }
})