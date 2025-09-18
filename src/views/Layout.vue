<template>
  <el-container class="layout-container">
    <!-- 1. 左侧侧边栏 -->
    <el-aside width="200px">
      <div class="sidebar-logo">Tlias 系统</div>
      <!-- 
        el-menu 关键配置:
        - :default-active="activeMenu": 当前激活菜单的 index。我们将其绑定到一个计算属性，实现动态高亮。
        - router: 启用 vue-router 模式。点击菜单项时，会将其 index 作为 path 进行路由跳转。
      -->
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <!-- 菜单项 -->
        <el-menu-item index="/emps">
          <el-icon><User /></el-icon>
          <span>员工管理</span>
        </el-menu-item>
        <el-menu-item index="/depts">
          <el-icon><Grid /></el-icon>
          <span>部门管理</span>
        </el-menu-item>
        <!-- 未来可以添加更多菜单项 -->
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 2. 顶部导航栏 -->
      <el-header class="layout-header">
        <div>面包屑导航 / 用户信息</div>
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </el-header>

      <!-- 3. 主内容区域 -->
      <el-main class="layout-main">
        <!-- 
          【核心】
          这是所有子路由组件的渲染出口。
          当路由匹配到 /emps 时, EmployeeManage.vue 就会在这里被渲染。
          当路由匹配到 /dept 时, DeptManage.vue 就会在这里被渲染。
        -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { User, Grid } from '@element-plus/icons-vue'; // 引入图标

// 1. 获取当前路由信息
const route = useRoute();
const router = useRouter();

// 2. 创建一个计算属性，用于动态计算当前激活的菜单项
//    useRoute() 返回的 route 对象是响应式的，当URL变化时，route.path 会自动更新
//    这个计算属性就会重新计算，从而更新 el-menu 的 :default-active 值
const activeMenu = computed(() => {
  return route.path;
});

// 3. 退出登录逻辑
const handleLogout = () => {
  // 在这里清除 Token 和用户信息 (例如调用 Pinia store 的 action)
  console.log('执行退出登录操作...');
  // 跳转到登录页
  router.push('/login');
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.sidebar-logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  background-color: #2b2f3a;
}
.el-menu-vertical {
  border-right: none;
}
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.layout-main {
  padding: 20px;
  background-color: #f0f2f5;
}
</style>