/**
 * 分页查询参数实体类
 */
export interface PageEntity {
  pageNo: number;
  pageSize: number;
  desc?: string;
  orderBy?: string;
}
