// src/api/apiClient.js
import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://121.41.52.142:5090', // 设置API的基础URL
  timeout: 10000000000000000000000000000000000000000000000000000000000000000000000000000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',

  }
});

// 请求拦截器
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('user-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
Axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在2xx范围内
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          console.error('Unauthorized: ', error.response.data);
          break;
        case 403:
          // 处理禁止访问错误
          console.error('Forbidden: ', error.response.data);
          break;
        case 404:
          // 处理资源未找到错误
          console.error('Not Found: ', error.response.data);
          break;
        case 500:
          // 处理服务器内部错误
          console.error('Internal Server Error: ', error.response.data);
          break;
        default:
          console.error('Error: ', error.response.data);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('No response received: ', error.request);
    } else {
      // 发生在设置请求时的错误
      console.error('Error: ', error.message);
    }
    return Promise.reject(error);
  }
);

export default Axios;