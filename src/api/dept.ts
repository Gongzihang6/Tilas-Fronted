import request from '@/utils/request'
import type { Dept } from './types'

// 获取所有部门列表
export const getDeptListAPI = (): Promise<Dept[]> => {
  return request.get('/depts')
}