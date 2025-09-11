<template>
  <el-card class="box-card">
    <!-- 搜索与操作区域 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchForm.gender" placeholder="请选择" clearable style="width: 120px;">
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item lable="部门">
        <el-select v-model="searchForm.deptId" placeholder="请选择" clearable style="width: 120px;">
          <el-option
            v-for="[id,name] of deptMap"
            :value="id"
            :label="name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="searchForm.jobId" placeholder="请选择" clearable style="width: 120px;">
          <el-option
            v-for="[value, label] of JOB_MAP"
            :value="value"
            :label="label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="searchForm.entryDate"
          type="daterange"
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">清空</el-button>
      </el-form-item>
    </el-form>

    <div class="action-bar">
      <el-button type="primary" @click="handleOpenAddDialog">+ 新增员工</el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedIds.length === 0">批量删除</el-button>
    </div>
    
    <!-- 员工列表表格 -->
    <el-table :data="employeeList" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" :formatter="genderFormatter" />
      <el-table-column label="头像">
         <template #default="scope">
           <el-image 
             style="width: 50px; height: 50px; border-radius: 5px;" 
             :src="scope.row.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
             :preview-src-list="[scope.row.avatar]"
             preview-teleported
             fit="cover"
            />
         </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号"/>
      <el-table-column prop="deptId" label="所属部门" :formatter="deptFormatter" />
      <el-table-column prop="jobId" label="职位" :formatter="jobFormatter"/>
      <el-table-column prop="entryDate" label="入职日期" />
      <el-table-column prop="lastOpTime" label="最后操作时间" width="180"/>
      <!-- 操作列 -->
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleOpenEditDialog(scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      v-model:current-page="pageQuery.page"
      v-model:page-size="pageQuery.pageSize"
      @size-change="fetchEmployeeList"
      @current-change="fetchEmployeeList"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </el-card>

  <!-- 新增/编辑员工的弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleDialogClose">
    <el-form :model="employeeForm" :rules="rules" ref="employeeFormRef" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="employeeForm.username" placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employeeForm.name" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
             <el-select v-model="employeeForm.gender" placeholder="请选择性别">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employeeForm.phoneNumber" placeholder="请输入手机号"/>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="职位" prop="jobId">
             <el-select v-model="employeeForm.jobId" placeholder="请选择职位">
              <!-- 假设职位列表从API获取 -->
              <el-option
                v-for="[value, label] of JOB_MAP"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资" prop="salary">
            <el-input v-model.number="employeeForm.salary" placeholder="请输入薪资"/>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
             <el-select v-model="employeeForm.deptId" placeholder="请选择部门">
              <!-- 假设部门列表从API获取 -->
              <el-option
                v-for="[value, label] of deptMap"
                :value="value"
                :label="label"
              />

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker v-model="employeeForm.entryDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"   
        >
          <img v-if="employeeForm.avatar" :src="employeeForm.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
         <el-text size="small" type="info">仅能上传PNG, JPG, JPEG等图片，图片大小不超过2M</el-text>
      </el-form-item>
       <!-- <el-form-item label="工作经历">
        <div v-for="(exp, index) in employeeForm.workExperience" :key="index" class="work-exp-item">
          <el-date-picker v-model="exp.startTime" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" style="width: 130px; margin-right: 5px;"/>
          -
          <el-date-picker v-model="exp.endTime" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 130px; margin-left: 5px;"/>
          <el-input v-model="exp.company" placeholder="公司" style="width: 150px; margin: 0 5px;" />
          <el-input v-model="exp.job" placeholder="职位" style="width: 100px;" />
          <el-button type="danger" link @click="removeWorkExperience(index)" style="margin-left: 5px;">删除</el-button>
        </div>
        <el-button type="primary" link @click="addWorkExperience">添加工作经历</el-button>
      </el-form-item> -->
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
import { ref, onMounted, reactive, computed } from 'vue'
import { getEmployeeListByPageAPI, addEmployeeAPI, updateEmployeeAPI, deleteEmployeeAPI, getJobNameById, batchDeleteEmployeeAPI} from '@/api/employee'
import { JOB_MAP, type Dept, type Employee, type PageQuery, type PageResult, type WorkExperience } from '@/api/types' 
import { ElMessage, ElMessageBox, formatter } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getDeptListAPI } from '@/api/dept'
import { de } from 'element-plus/es/locales.mjs'

// --- 响应式数据定义 ---
const employeeList = ref<Employee[]>([]) 
const total = ref(0) 
const loading = ref(false) 
const dialogVisible = ref(false) 
const isEdit = ref(false)
const selectedIds = ref<number[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  gender: undefined,
  deptId: undefined,
  jobId: undefined,
  entryDate: [] as [string, string] | []
})

// 分页查询
const pageQuery = ref<PageQuery>({
  page: 1,
  pageSize: 10
})

// 弹窗表单
const employeeFormRef = ref<FormInstance>()
const getInitialForm = (): Employee => ({
  id: Number(),
  username: '',
  name: '',
  gender: 1,
  phoneNumber: '',
  avatar: '',
  deptId: Number(), 
  jobId: Number(), 
  salary: Number(),
  entryDate: '',
  // workExperience: []
});
const employeeForm = ref<any>(getInitialForm()) // 使用 any 避免深拷贝带来的类型问题，或定义更精确的Form类型

// 表单校验规则
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  // 更多校验规则...
})

const dialogTitle = computed(() => isEdit.value ? '修改员工' : '新增员工')

// --- 方法定义 ---
const fetchEmployeeList = async () => {
  loading.value = true
  try {
    const query: PageQuery = {
      ...pageQuery.value,
      name: searchForm.name || undefined,
      gender: searchForm.gender,
      deptId: searchForm.deptId || undefined,
      jobId: searchForm.jobId || undefined,
      entryDateBegin: searchForm.entryDate?.[0],
      entryDateEnd: searchForm.entryDate?.[1]
    }
    const pageResult: PageResult<Employee> = await getEmployeeListByPageAPI(query)
    employeeList.value = pageResult.records;
    total.value = pageResult.total;

  } catch (error) {
    ElMessage.error('获取员工列表失败')
  } finally {
    loading.value = false
  }
}

// 1. 存储从API获取的原始部门列表
const deptList = ref<Dept[]>([]);

// 2. 使用 computed 创建一个部门 ID -> 名称的 Map，以便高效查找
//    当 deptList 变化时，deptMap 会自动重新计算
const deptMap = computed(() => {
  return new Map(deptList.value.map((dept: { id?: number; name: string }) => [dept.id, dept.name]));
});

// 3. 在 onMounted 中获取部门列表
onMounted(async () => {
  try {
    deptList.value = await getDeptListAPI();
    // 同时也获取员工列表...
    fetchEmployeeList();
  } catch (error) {
    console.error("获取部门列表失败", error);
  }
});

// 4. 定义部门列的 formatter
const deptFormatter = (row: Employee): string => {
  return deptMap.value.get(row.deptId) || '未知部门';
};

const handleSearch = () => {
  pageQuery.value.page = 1 // 搜索时回到第一页
  fetchEmployeeList()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.gender = undefined
  searchForm.deptId = undefined
  searchForm.jobId = undefined
  searchForm.entryDate = []
  handleSearch()
}
// 格式化单元格显示内容的函数,如果单元格内容为1,则显示"男",否则显示"女"
const genderFormatter = (row: Employee) => {
  return row.gender === 1 ? '男' : '女'
}
const jobFormatter = (row: Employee): string => {
  // row.jobId 是从后端获取的数字，例如 3
  return getJobNameById(row.jobId); // 返回 '讲师'
};
const handleOpenAddDialog = () => {
  isEdit.value = false
  employeeForm.value = getInitialForm()
  dialogVisible.value = true
}

const handleOpenEditDialog = (row: Employee) => {
  isEdit.value = true
  // 使用深拷贝防止修改表单时影响表格数据
  employeeForm.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// 当用户点击“确认”按钮时，handleSubmit 函数被触发，执行最关键的提交逻辑。
const handleSubmit = async () => {
  if (!employeeFormRef.value) return
  await employeeFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          // 在实际项目中，职位和部门可能只需要传ID，这里根据API要求调整
          // employeeForm.value.job.name = ... 
          // employeeForm.value.dept.name = ...
          await updateEmployeeAPI(employeeForm.value)
          ElMessage.success('更新成功')
        } else {
          await addEmployeeAPI(employeeForm.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchEmployeeList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (id: number) => {
  try {
    await deleteEmployeeAPI(id)
    ElMessage.success('删除成功')
    fetchEmployeeList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSelectionChange = (selection: Employee[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleBatchDelete = async () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await batchDeleteEmployeeAPI(selectedIds.value)
      ElMessage.success('批量删除成功')
      fetchEmployeeList()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  }).catch(() => {
    // 用户点击取消
  })
}

const handleDialogClose = () => {
  employeeFormRef.value?.resetFields()
}

// 头像上传处理
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // `response` 是后端接口返回的完整 Result 对象，例如:
    // { code: 1, msg: "success", data: "/uploads/xxxxx.jpg" }
    if (response.code === 1) {
    // 1. 从响应中取出真实的、由后端返回的URL
    //    这个URL是永久有效的（只要服务器上的文件不被删除）
    employeeForm.value.avatar = response.data;
    ElMessage.success('头像上传成功');
  } else {
    ElMessage.error(response.msg || '头像上传失败');
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isJpgOrPng = ['image/jpeg', 'image/png'].includes(rawFile.type)
  if (!isJpgOrPng) {
    ElMessage.error('头像图片必须是 JPG/PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 工作经历相关
const addWorkExperience = () => {
  employeeForm.value.workExperience.push({
    startTime: '',
    endTime: '',
    company: '',
    job: ''
  })
}
const removeWorkExperience = (index: number) => {
  employeeForm.value.workExperience.splice(index, 1)
}
</script>

<style scoped>
.search-form {
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.action-bar {
  margin-bottom: 15px;
}
.work-exp-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}
</style>