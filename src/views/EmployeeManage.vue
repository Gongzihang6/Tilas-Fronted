<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>员工管理</span>
        <el-button type="primary" @click="handleOpenDialog">新增员工</el-button>
      </div>
    </template>
    
    <!-- 员工列表表格 -->
    <el-table :data="employeeList" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" :formatter="genderFormatter" />
      <el-table-column prop="jobId" label="职位ID" />
      <el-table-column prop="entryDate" label="入职日期" />
      <!-- 操作列 -->
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pageQuery.pageSize"
      v-model:current-page="pageQuery.page"
      @current-change="fetchEmployeeList"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </el-card>

  <!-- 新增/编辑员工的弹窗 -->
  <el-dialog v-model="dialogVisible" title="新增员工" width="500px">
    <el-form :model="employeeForm">
      <el-form-item label="姓名">
        <el-input v-model="employeeForm.name" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="employeeForm.jobId" />
      </el-form-item>
      <!-- ... 其他表单项 -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEmployeeListAPI, addEmployeeAPI, getEmployeeListByPageAPI } from '@/api/employee'
import type { Employee, PageQuery, PageResult, ApiResponse } from '@/api/types' 
import { ElMessage } from 'element-plus'
import type { AxiosResponse } from 'axios'

// --- 响应式数据定义 ---

const employeeList = ref<Employee[]>([]) 
const total = ref(0) 
const loading = ref(false) 
const dialogVisible = ref(false) 

const pageQuery = ref<PageQuery>({
  page: 1,
  pageSize: 10
})

const getInitialForm = (): Partial<Employee> => ({
  id: undefined,
  name: '',
  username: '',
  gender: 1,
  jobId: undefined,
  deptId: undefined,
  salary: undefined,
  entryDate: ''
})
const employeeForm = ref<Partial<Employee>>(getInitialForm())


// --- 方法定义 ---

/**
 * @description 获取员工列表数据
 */
const fetchEmployeeList = async () => {
  loading.value = true
  try {
    // 调用./api/employee.ts 中的 getEmployeeListByPageAPI 方法
    const pageResult: PageResult<Employee> = await getEmployeeListByPageAPI(pageQuery.value)
    employeeList.value = pageResult.records;
    total.value = pageResult.total;

  } catch (error) {
    ElMessage.error('获取员工列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEmployeeList()
})

const genderFormatter = (row: Employee) => {
  return row.gender === 1 ? '男' : '女'
}

const handleOpenDialog = () => {
  employeeForm.value = getInitialForm()
  dialogVisible.value = true
}

/**
 * @description 提交表单（新增/编辑）
 */
const handleSubmit = async () => {
  // 【修正点 2】在提交前进行校验
  if (!employeeForm.value.name || !employeeForm.value.username) {
    ElMessage.warning('请填写姓名和用户名')
    return
  }

  try {
    // 经过上面的 if 判断，TypeScript 知道 name 和 username 此时必定是 string 类型
    // 所以可以直接将 employeeForm.value 传递，不再报错
    await addEmployeeAPI(employeeForm.value)
    
    ElMessage.success('操作成功')
    dialogVisible.value = false
    fetchEmployeeList() // 成功后刷新列表
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

const handleEdit = (row: Employee) => {
  employeeForm.value = { ...row } 
  dialogVisible.value = true
}

const handleDelete = (id: number) => {
  console.log('删除员工', id)
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>