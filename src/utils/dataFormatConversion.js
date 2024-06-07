import {isEmpty} from "element-plus/es/utils/index";

// 对象转键值对
export const toKeyValuePair = (obj) => {
    const output = []
    if (!isEmpty(obj)) {
        Object.keys(obj).forEach(k => {
            output.push({key: k, value: obj[k]})
        })
        return output
    }
    return [{key: '', value: ''}]
}

// 键值对转对象
export const toObject = (keyValueArray) => {
    const obj = {}
    keyValueArray.forEach(item => {
        if (item.key !== '') {
            obj[item.key] = item.value
        }
    })
    return obj
}
