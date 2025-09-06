import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/employee' // 默认重定向到员工管理页
    },
    {
      path: '/employee',
      name: 'Employee',
      component: () => import('@/views/EmployeeManage.vue') // 懒加载方式引入组件
    }
    // ... 未来可以添加部门管理的路由
  ]
})

export default router