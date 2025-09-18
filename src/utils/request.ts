import router from '@/router';
import { useUserStore } from '@/stores/user';
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  // 基础路径，所有请求的URL都会自动拼接上这个前缀
  // 注意：这里的地址是你在vite.config.ts中配置的代理目标
  baseURL: '/api',    // 注意：这里 baseURL 后面不要加 /，这里指代http://localhost:8080
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        const userStore = useUserStore();
        if (userStore.token) {
            // 为请求头添加Authorization字段
            config.headers['Authorization'] = `Bearer ${userStore.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// --- 响应拦截器 (核心修改) ---
request.interceptors.response.use(
  /**
   * 如果你想获取http信息，如响应头或状态
   * 请返回 response => response
  */
  response => {
    // 【核心】直接返回完整的 response 对象
    // 不要做任何全局的成功/失败判断和弹窗
    // 将这些逻辑交给具体的业务页面去处理
    return response;
  },
  error => {
    console.error('请求发生错误: ', error); // for debug

    // 对响应错误做点什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围
      switch (error.response.status) {
        case 401:
          // Token失效的处理
          localStorage.removeItem('token');
          router.push('/login');
          ElMessage.error('认证失败或登录已过期，请重新登录');
          break;
        case 403:
          ElMessage.error('您没有权限访问此资源');
          break;
        case 404:
          ElMessage.error('请求的资源未找到');
          break;
        default:
          ElMessage.error(error.response.data.msg || '服务器内部错误');
      }
    } else {
      // 一些请求在发送时就会出错，比如网络问题
      ElMessage.error('网络错误，请检查您的网络连接');
    }
    
    return Promise.reject(error);
  }
);
export default request