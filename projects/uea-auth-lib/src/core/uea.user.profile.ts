export class UserProfile {
  birthdate: Date; // '19750731160000.000Z'
  country: string; // 'CN'
  department: string; // '技术部'    =>  SVS::department
  email: string; // 'huabiao.xiao@timeondata.com'
  email_verified: boolean; // true
  employeeNumber: string;
  employee: string; // '正式职员'
  family_name: string; // ''
  formatted: string; // '蜀山区先进技术研究院11层'
  given_name: string; // ''
  inum: string; // 'd23e2671-0579-47fa-9b4f-c12a590512b1'
  iss: string; // 'https://uat.chinavacc.com.cn'
  locality: string; // '合肥'
  member_of: string[]; //  Array['inum=60B7,ou=groups,o=gluu']
  name: string; // ''
  // nonce: '4Rj9zJBMQlx1PUYQls8OZm49XTWyRJG1cAXE4UyREb8GY'
  o: string; // 'timeondata'   =>  svs2::pov
  pov: string;
  // oxOpenIDConnectVersion: 'openidconnect-1.0'
  phone_mobile_number: string; // ''
  phone_number: string; // '010-88888888'
  phone_number_verified: boolean; // true
  region: string; // '安徽'
  room_number: string; // 'A1101'
  // s_hash: '4NkJvwL3yfBCxZAdK9tbFw'
  status: string; // 'active'
  street_address: string; // '祥源城街道社区'
  sub: string; // 'gAOdAcjzCANDnnoPW1F72xQifz1FAwfNpar2CZPDSFk'
  title: string; // '部门经理'
  updated_at: Date; // 1572506120154
  user_name: string; // ''   =>  svs2::userCode
  userCode: string;
}

export const profileSchema = {
  user_name: 'user_name',
  userCode: 'user_name', // 'xiaohuabiao'   =>  svs2::userCode
  sub: 'sub', // 'gAOdAcjzCANDnnoPW1F72xQifz1FAwfNpar2CZPDSFk'
  inum: 'inum', // 'd23e2671-0579-47fa-9b4f-c12a590512b1'
  iss: 'iss', // 'https://uat.chinavacc.com.cn'

  name: 'name',
  family_name: 'family_name', // '肖'
  given_name: 'given_name', // '华飚'

  email: 'email', // 'huabiao.xiao@timeondata.com'
  email_verified: 'email_verified', // true

  phone_mobile_number: 'phone_mobile_number', // '13910607835'
  phone_number_verified: 'phone_number_verified', // true

  title: 'title', // '部门经理'
  birthdate: 'birthdate', // '19750731160000.000Z'

  employeeNumber: 'employeeNumber',
  employee: 'employee', // '正式职员'

  country: 'country', // 'CN'
  region: 'region', // '安徽'
  locality: 'locality', // '合肥'
  organization: 'o', // 'timeondata'   =>  svs2::pov
  pov: 'o',
  department: 'department', // '技术部'    =>  SVS::department
  room_number: 'room_number', // 'A1101'

  phone_number: 'phone_number', // '010-88888888'
  street_address: 'street_address', // '祥源城街道社区'
  formatted: 'formatted', // '蜀山区先进技术研究院11层'
  member_of: 'member_of', //  Array['inum=60B7,ou=groups,o=gluu']
  status: 'status', // 'active'
  updated_at: 'updated_at', // 1572506120154
};
