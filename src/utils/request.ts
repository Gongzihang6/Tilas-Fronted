import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  // 基础路径，所有请求的URL都会自动拼接上这个前缀
  // 注意：这里的地址是你在vite.config.ts中配置的代理目标
  baseURL: '/api', 
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    // 比如，未来可以在这里统一添加 token
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 后端返回的数据结构是 { code, msg, data }
    const res = response.data

    // code 不为 1，表示操作失败
    if (res.code !== 1) {
      // 使用 Element Plus 的 Message 组件提示错误信息
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 返回一个被拒绝的 Promise，这样 .then 就不会执行，而是会进入 .catch
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      // code 为 1，表示操作成功，只返回 data 部分
      return res.data
    }
  },
  error => {
    // 对响应错误做点什么
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default request