<template>
  <el-card class="box-card">
    <!-- 1. 头部区域：标题和新增按钮 -->
    <template #header>
      <div class="card-header">
        <span>部门管理</span>
        <el-button type="primary" @click="handleOpenAddDialog">新增部门</el-button>
      </div>
    </template>

    <!-- 2. 数据表格区域 -->
    <el-table :data="deptList" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="createTime" label="创建时间" :formatter="formatDateTime" />
      <el-table-column prop="updateTime" label="最后操作时间" :formatter="formatDateTime" />
      
      <!-- 操作列：使用作用域插槽获取行数据 -->
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleOpenEditDialog(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除该部门吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  

  <!-- 3. 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px" @close="handleDialogClose">
    <el-form :model="deptForm" :rules="rules" ref="deptFormRef" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name" placeholder="请输入部门名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>

      <!-- 分页组件 -->
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :total="total"
      :page-sizes="[6, 12]"
      v-model:current-page="pageQuery.page"
      v-model:page-size="pageQuery.pageSize"
      @size-change="fetchDeptList"
      @current-change="fetchDeptList"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { getDeptListAPI, addDeptAPI, updateDeptAPI, deleteDeptAPI, getDeptListByPageAPI } from '@/api/dept';
import type { Dept, PageResult } from '@/api/types';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// --- 响应式数据定义 ---

// 表格数据
const deptList = ref<Dept[]>([]);
const loading = ref(false);
const total = ref(0) 
// 弹窗控制
const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = computed(() => isEdit.value ? '修改部门' : '新增部门');

// 表单数据与引用
const deptFormRef = ref<FormInstance>();
const getInitialForm = (): Partial<Dept> => ({
  id: undefined,
  name: ''
});
const deptForm = ref<Partial<Dept>>(getInitialForm());

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
});

// --- 方法定义 ---

const pageQuery = reactive({
  page: 1,
  pageSize: 6
});
/**
 * 获取部门列表
 */
const fetchDeptList = async () => {
  loading.value = true;
  try {
    // 调用API获取数据
    const response = await getDeptListByPageAPI(pageQuery); 
    const pageResult: PageResult<Dept> = response.data.data;
    deptList.value = pageResult.records;
    total.value = pageResult.total;
  } catch (error) {
    ElMessage.error('获取部门列表失败');
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchDeptList();
});

/**
 * 格式化日期时间（去掉'T'）
 */
const formatDateTime = (row: Dept, column: any, cellValue: string): string => {
  if (!cellValue) return '';
  return cellValue.replace('T', ' ');
};

/**
 * 打开新增弹窗
 */
const handleOpenAddDialog = () => {
  isEdit.value = false;
  deptForm.value = getInitialForm();
  dialogVisible.value = true;
};

/**
 * 打开编辑弹窗
 */
const handleOpenEditDialog = (row: Dept) => {
  isEdit.value = true;
  // 深拷贝数据到表单，防止影响表格中的原始数据
  deptForm.value.id = row.id;
  deptForm.value.name = row.name;
  dialogVisible.value = true;
};

/**
 * 提交表单（新增/编辑）
 */
const handleSubmit = async () => {
  if (!deptFormRef.value) return;
  
  // 校验表单
  await deptFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 根据 isEdit 状态调用不同API
        if (isEdit.value) {
          await updateDeptAPI(deptForm.value);
          ElMessage.success('更新成功');
        } else {
          await addDeptAPI({ name: deptForm.value.name! });
          ElMessage.success('新增成功');
        }
        dialogVisible.value = false;
        fetchDeptList(); // 成功后刷新列表
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

/**
 * 删除部门
 */
const handleDelete = async (id: number) => {
  try {
    await deleteDeptAPI(id);
    ElMessage.success('删除成功');
    fetchDeptList(); // 成功后刷新列表
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

/**
 * 关闭弹窗时的回调，重置表单校验状态
 */
const handleDialogClose = () => {
  deptFormRef.value?.resetFields();
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>