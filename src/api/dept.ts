import request from '@/utils/request'
import type { Dept, PageQuery } from './types'
import { ElMessage } from 'element-plus';


// 获取所有部门列表
export const getDeptListAPI = ()=> {
  return request.get('/depts')
}

// 获取分页查询部门列表
export const getDeptListByPageAPI = (params: PageQuery) => {
  return request.get('/depts', { params })
}


/**
 * 新增部门
 * @param data - 包含部门名称的对象, e.g., { name: '市场部' }
 */
export const addDeptAPI = (data: Dept): Promise<void> => {
  return request({
    url: '/depts',
    method: 'post',
    data
  });
};

/**
 * 更新部门信息
 * @param data - 完整的部门对象, e.g., { id: 1, name: '新的市场部', ... }
 */
export const updateDeptAPI = (data: Partial<Dept>): Promise<void> => {
  return request({
    url: '/depts',
    method: 'put',
    data
  });
};

/**
 * 根据ID删除部门
 * @param id - 部门ID
 */
export const deleteDeptAPI = (id: number): Promise<void> => {
  return request({
    url: `/depts/${id}`,
    method: 'delete'
  });
};