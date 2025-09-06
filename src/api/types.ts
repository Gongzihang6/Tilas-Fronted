/**
 * @file src/api/types.ts
 * @description 这个文件用于存放所有与后端 API 交互相关的 TypeScript 类型定义。
 *              将类型集中管理，有助于代码复用和维护。
 */

// ================================== 实体类定义 ==================================

/**
 * 员工实体类 (Employee)
 * 与后端 com.gzh.tilas.pojo.Employee 对应
 */
export interface Employee {
  id?: number; // ID 在新增时可能不存在，设为可选
  username: string;
  password?: string; // 密码通常在列表查询时不返回，设为可选
  name: string;
  gender: 1 | 2; // 1:男, 2:女，使用联合类型进行约束
  avatar: string;
  deptId: number;
  jobId: number;
  salary: number;
  entryDate: string; // 后端 LocalDate/LocalDateTime 返回到前端通常是字符串格式，如 '2023-10-25'
  createTime?: string; // 创建和更新时间在新增时由后端生成，设为可选
  updateTime?: string;
}

/**
 * 部门实体类 (Dept)
 * 与后端 com.gzh.tilas.pojo.Dept 对应
 */
export interface Dept {
  id?: number;
  name: string;
  createTime?: string; // 后端 LocalDateTime 返回到前端通常是字符串格式
  updateTime?: string;
}

// ================================== API 请求/响应结构定义 ==================================

/**
 * 分页查询的基础参数类型
 */
export interface PageQuery {
  page: number;
  pageSize: number;
}

/**
 * 后端分页查询接口返回的数据结构
 * 使用泛型 T 来表示列表中的具体项目类型，如 Employee 或 Dept
 */
export interface PageResult<T> {
  total: number; // 总记录数
  records: T[];  // 当前页的数据列表 (注意: 如果后端返回的是 'rows'，这里也要改为 'rows')
}


/**
 * 后端统一响应结果 (Result) 的泛型封装
 * T 代表 Result 中 data 字段的具体类型
 */
export interface ApiResponse<T = any> {
  code: number; // 响应码, 1 代表成功; 0 代表失败
  msg: string;  // 响应信息
  data: T;      // 返回的具体数据
}


// ================================== 特定接口的参数定义 (如果需要) ==================================

/**
 * 员工列表查询的扩展参数
 * 继承自分页参数，并添加了额外的筛选条件
 */
export interface EmployeeListQuery extends PageQuery {
  name?: string;     // 员工姓名 (可选)
  gender?: 1 | 2;  // 性别 (可选)
  begin?: string;    // 最早入职日期 (可选, 格式 'YYYY-MM-DD')
  end?: string;      // 最晚入职日期 (可选, 格式 'YYYY-MM-DD')
}