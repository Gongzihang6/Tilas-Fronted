import request from '@/utils/request'
import type { Employee, PageQuery, PageResult } from './types' // 引入类型定义

/**
 * 分页查询获取员工列表
 * 这里调用request接受Axios向后端请求的响应数据
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
export const addEmployeeAPI = (data: Partial<Employee>): Promise<any> => { // 返回的 data 是 null，所以可以用 any 或 void
  return request({
    url: '/emps',
    method: 'post',
    data
  })
}

// ... 其他接口，如 delete, update