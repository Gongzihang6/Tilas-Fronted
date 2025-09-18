// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 路由规则 1：主布局 ---
    {
      path: '/',
      component: () => import('@/views/Layout.vue'),
      redirect: '/emps', // 默认重定向到员工管理
      children: [
        {
          path: '/emps',
          name: 'employee',
          component: () => import('@/views/EmployeeManage.vue')
        },
        {
          path: '/depts',
          name: 'department',
          component: () => import('@/views/DeptManage.vue')
        }
        // ... 其他需要登录才能访问的页面，都放在这里
      ]
    },
    // --- 路由规则 2：登录页 (与主布局平级) ---
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue') // 假设您的登录页在这个路径
    }
  ]
})

export default router