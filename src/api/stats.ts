import request from '@/utils/request';

export const getGenderCountAPI = () => {
  return request({ url: '/stats/gender', method: 'get' });
};

export const getAvgSalaryByJobAPI = () => {
  return request({ url: '/stats/avgSalaryByjob', method: 'get' });
};

export const getAvgSalaryByDeptAPI = () => {
  return request({ url: '/stats/avgSalaryBydept', method: 'get' });
};