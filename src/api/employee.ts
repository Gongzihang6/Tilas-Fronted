import request from '@/utils/request'
import { JOB_MAP, type Employee, type PageQuery, type PageResult } from './types' // 引入类型定义
import qs from 'qs'; // <--- 1. 引入 qs 库

/**
 * 根据职位ID获取职位名称
 * @param jobId 职位ID
 * @returns 职位名称，如果未找到则返回 '未知职位'
 */
export function getJobNameById(jobId: number): string {
  return JOB_MAP.get(jobId) || '未知职位';
}


/**
 * 分页查询获取员工列表
 * 这里调用request接收Axios向后端请求的响应数据并返回
 */
export const getEmployeeListByPageAPI = (params: PageQuery): Promise<PageResult<Employee>> => {
  // request 的泛型可以帮助 TypeScript 推断，但函数返回值的显式注解更重要
  return request({
    url: '/emps',
    method: 'get',
    params
  })
}

/**
 * 增加员工的接口
 */
export const addEmployeeAPI = (params: Employee): Promise<any> => { // 返回的 data 是 null，所以可以用 any 或 void
  return request({
    url: '/emps',
    method: 'post',
    data: params
  })
}

/**
 * 删除员工的接口（根据员工id）
 */
export const deleteEmployeeAPI = (id: number): Promise<any> => { // 删除员工时返回的 data 是 null，所以可以用 any 或 void
  return request({
    url: `/emps/${id}`,
    method: 'delete',
  })
}

export const batchDeleteEmployeeAPI = (ids: number[]): Promise<any> => { // 删除员工时返回的 data 是 null，所以可以用 any 或 void
  return request({
    url: '/emps',
    method: 'delete',
    params: { ids },
    paramsSerializer: params =>{
      return qs.stringify(params, {arrayFormat: 'repeat'});
    }
  })
}

/**
 * 修改员工的接口
 * request请求方法中,params表示用于GET请求的URL参数（查询字符串）
 *                    data表示用于POST请求的请求体数据
 */
export const updateEmployeeAPI = (params: Partial<Employee>): Promise<any> => { // 删除员工时返回的 data 是 null，所以可以用 any 或 void
  return request({
    url: '/emps',
    method: 'put',
    data: params
  })
}