/**
 * 定义常量
 */

// 档案类型
export const PROFILE_TYPE = [
  { label: '儿童档案', value: 'child', icon: 'fas fa-baby' },
  { label: '成人档案', value: 'adult', icon: 'fas fa-user-tie' }
];
// 档案操作选项
export const CK_FILE_OPERATIONS = [
  { label: '档案新增', value: 'profile_add' },
  {label: '档案迁入', value: 'profile_import'},
  {label: '预诊记录', value: 'prognostics_record'}
];
// 打印操作选项
export const CK_PRINT_OPERATIONS = [
  // { label: '登记单', value: '' },
  // { label: '注射单', value: '' },
  // { label: '告知书', value: 'vacAgreement' },
  { label: '档案资料', value: 'printProfile' },
  { label: '打印接种记录', value: 'printVaccRecord' },
  { label: '打印入学、入托证明', value: 'careToProve' },
  { label: '儿童接种本档案信息', value: 'printChildCase' }
];
// 更多操作选项
export const MORE_OPERATIONS = [
  { label: '在册变更', value: 'registered_change' },
  { label: '个案更新', value: 'file-comparison' }
];

export const PROFILE_CHANGE_KEY = {
  AEFI: 'AEFI',
  RABIES: 'RABIES',
  ILLNESS: 'ILLNESS',
  GUARDIAN: 'GUARDIAN',
  PROFILE: 'PROFILE',
  IMMUCARD: 'IMMUCARD',
  RESERVATION: 'RESERVATION',
  REGIST_RECORD: 'REGIST_RECORD'
};

// 成人疫苗大类
export const ADULT_VACCINE_BROADHEADING = [
  { broadHeadingCode: '55', broadHeadingEngName: 'HPV' },
  { broadHeadingCode: '21', broadHeadingEngName: '流感' },
  { broadHeadingCode: '25', broadHeadingEngName: '23价肺炎' },
  { broadHeadingCode: '02', broadHeadingEngName: '乙肝' },
  { broadHeadingCode: '22', broadHeadingEngName: '水痘' },
  { broadHeadingCode: '12', broadHeadingEngName: '麻腮风' },
  { broadHeadingCode: '08', broadHeadingEngName: '破伤风' }
];
