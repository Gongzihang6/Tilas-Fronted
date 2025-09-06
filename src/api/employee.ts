import request from '@/utils/request'
import type { Employee, PageQuery } from './types' // 引入类型定义

/**
 * 获取员工列表
 */
export const getEmployeeListAPI = (params: PageQuery) => {
  return request({
    url: '/emps',
    method: 'get',
    params
  })
}

/**
 * 新增员工
 */
export const addEmployeeAPI = (data: Employee) => {
  return request<Employee>({ // 指定返回类型
    url: '/emps',
    method: 'post',
    data
  })
}

// ... 其他接口，如 delete, update