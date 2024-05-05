import axios from "axios";


// 创建一个基础HTTP实例
const http = axios.create({
    baseURL: '/api',
    timeout: 3000, // 请求超时设置
});


// 设置请求拦截器
http.interceptors.request.use(
    (config) => {
        //这里添加全局请求设置，例如身份验证令牌
        // config.headers.Authorization = 'Bearer ' + getAuthToken();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 设置响应拦截器
http.interceptors.response.use(
    (response) => {
        // 在这里处理成功响应
        return response;
    },
    (error) => {
        // 在这里处理错误响应
        // 根据状态码进行错误处理
        if (error.response && error.response.status === 401) {
            // 处理身份验证错误
        }
        return Promise.reject(error)
    }
)

export default http;