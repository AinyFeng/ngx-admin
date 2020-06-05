/**
 * 市平台 - 入学入托接种查验相关接口
 */
export const VACCINE_EXAMINE_URLS = {
  querySchoolListByBelongPovCode: '/svs/master/school/querySchoolListByBelongPovCode', // 根据归属门诊编码查询学校
  queryGradeBaseInfo: '/svs/master/grade/queryGradeBaseInfo', // 查询班级列表接口
  querySchoolBaseInfoCount: '/svs/master/grade/querySchoolBaseInfoCount', // 查询班级总数量接口
  queryClassListBySchoolCode: '/svs/master/school/queryClassListBySchoolCode', // 根据学校查询班级
  queryStudentBaseinfoByChildCode: '/svs/master/school/queryStudentBaseinfoByChildCode', // 根据学生编码查询学生信息
};

