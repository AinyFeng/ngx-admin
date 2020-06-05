/**
 * 查询档案信息
 * @param profile
 * profile 查询格式如下：
 * { condition: [{key: "name", value: "dick"，logic:"="},
 * {key:"birth_date", value:"2019-05-06", logic:">"},
 * {key:"birth_date", value:"2019-05-06", logic:"<"}],
 * groupBy: "name",
 * sortBy:"name",
 * desc:"desc", page: 1, pageSize: 10, constrainedFields: ["name", "age"] }
 * @param fun
 */

export interface Condition {
  key: string;
  value: string;
  logic: string;
}

export interface QueryEntity {
  condition: Condition[];
  groupBy?: string;
  sortBy?: string;
  desc?: string;
  page?: number;
  pageSize?: number;
  constrainedFields?: string[];
}
