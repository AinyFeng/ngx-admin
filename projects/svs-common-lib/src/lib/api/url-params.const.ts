/**
 * 接口访问地址 - 常量
 */

/**
 * 国家报表统计 接口访问地址
 */
export const REPORT_URLS = {
  getReportNameList: 'http://localhost:2222',
  getReportNationSixOne: '/svs/rptNationSixOne/query', // 查询国家报表6-1
  insertReportNationSixOne: '/svs/rptNationSixOne/insert', // 统计国家报表6-1
  getReportNationSixOneSum: '/svs/rptNationSixOne/querySum', // 查询国家报表汇总6-1
  getReportNationSixTwo: '/svs/rptNationSixTwo/query', // 查询国家报表6-2
  insertReportNationSixTwo: '/svs/rptNationSixTwo/insertBatch', // 统计国家报表6-2(批量插入)
  getReportNationSixTwoSum: '/svs/rptNationSixTwo/querySum', // 查询国家报表汇总6-2
  queryReportSubRecord: '/svs/rptuploadrecord/query', // 查询报表上报记录
  updateSingleReportSubRecord: '/svs/rptuploadrecord/update',
  insertReportSubRecord: '/svs/rptuploadrecord/insert',
  deleteReportSubRecord: '/svs/rptuploadrecord/delete',

  querySixOneReport: '/svs/uploadrptnation/upsixone', // 6-1报表上报记录
  querySixTowReport: '/svs/uploadrptnation/upsixtwo', // 6-2报表上报记录

  querySixOneExport: '/svs/rptNationSixOne/export', // 6-1报表导出
  querySixTwoExport: '/svs/rptNationSixTwo/export', // 6-2报表导出
  querySixOneExportSum: '/svs/rptNationSixOne/exportSum', // 6-1汇总导出
  querySixTwoVacType: '/svs/rptNationSixTwo/reportVaccineType', // 国家报表6-2中的疫苗类型

  queryShCaseDetail: '/svs/rptNationSixOne/shCaseDetail', // 应种个案详情
  queryShCaseDetailCount: '/svs/rptNationSixOne/shCaseDetailCount', // 应种个案详情Count
  queryReCaseDetail: '/svs/rptNationSixOne/reCaseDetail', // 实种个案详情
  queryReCaseDetailCount: '/svs/rptNationSixOne/reCaseDetailCount', // 实种个案详情Count
  queryShAndNotCaseDetail: '/svs/rptNationSixOne/shAndNotCaseDetail', // 应种未种个案详情
  queryShAndNotCaseDetailCount: '/svs/rptNationSixOne/shAndNotCaseDetailCount', // 应种未种个案详情Count

};

export const PLATFORM_MASTER = {
  queryPlatformOffice: '/svs/platform/master/queryPlatformOfficeInfoByOrganizationCode'
};


/**
 * 登记台管理 接口访问地址
 */

// 档案捷接口请求地址
export const PROFILE_URLS = {
  saveProfile: '/svs/profile/insert',
  saveProfileByEntity: '/svs/profile/insertProfile',
  queryProfile: '/svs/profile/query',
  countProfile: '/svs/profile/count',
  updateAdultProfile: '/svs/profile/update',
  updateChildProfile: '/svs/profile/updateChild',
  queryProfileByGuardianIdCardNo: '/svs/profile/queryProfileByGuardianIdCardNo',
  updateImmunityVacCard: '/svs/profile/updateImmunityVacCard',
  queryProfileByImmunityVacCard: '/svs/profile/queryProfileByImmunityVacCard',
  deleteProfile: '/svs/profile/delete', // 档案删除

  decodeEnCode: '/svs/utils/decodeImmunityCard', // 解密免疫卡号

  caseImmigrationQueryByBaseInfo: '/svs/case/immigration/baseInfoQuery',
  caseImmigrationQueryByCardNumber: '/svs/case/immigration/cardNumberQuery',
  caseImmigrationCommit: '/svs/case/immigration/commit',
  caseImmunityUpdate: '/svs/case/immigration/update',
  caseInProvincePlatformQueryByChildInfo: '/svs/case/provincePlatform/baseInfoQuery',
  caseInProvincePlatformQueryByImmunityCard: '/svs/case/provincePlatform/immunityCardQuery',
  caseInProvincePlatformCommit: '/svs/case/provincePlatform/commit',
  caseInCityPlatformQuery: '/svs/case/cityPlatform/query',
  caseInCityPlatformCommit: '/svs/case/cityPlatform/commit',

  aefiFileUpload: '/svs/aefi/uploadFile',
  aefiFileDelete: '/svs/aefi/deleteFile',
  aefiFileDownload: '/svs/aefi/downloadFile',
  aefiQueryVaccRecord: '/svs/aefi/queryVaccRecord',
  aefiQueryVacRecordByParams: '/svs/vacc/vr/queryVaccinateRecordSingle',
  aefiSaveRecord: '/svs/aefi/insert',
  aefiQueryByProfileCode: '/svs/aefi/query',
  aefiDeleteByAefiCode: '/svs/aefi/delete',
  aefiUpdateRecord: '/svs/aefi/update',
  medicalRecordSave: '/svs/mhr/insert',
  medicalRecordQuery: '/svs/mhr/query',
  medicalRecordDelete: '/svs/mhr/delete',
  medicalRecordUpdate: '/svs/mhr/update',
  biteRecordInsert: '/svs/rbr/insert',
  biteRecordQuery: '/svs/rbr/query',
  biteRecordUpdate: '/svs/rbr/update',
  biteRecordDelete: '/svs/rbr/delete',
  getStrategy: '/svs/vst/getStrategy',
  insertProfileStatusChange: '/svs/profilestatuschange/insert',
  queryProfileStatusChange: '/svs/profilestatuschange/query',
  countProfileStatusChange: '/svs/profilestatuschange/count',
  queryImmuCardList: '/svs/ivca/query',
  countImmuCardList: '/svs/ivca/count',
  saveImmuCardList: '/svs/ivca/insert',
  deleteImmuCardRecord: '/svs/ivca/delete',
  saveAndUpdateImmuCardRecord: '/svs/ivca/saveAndUpdate',
  activateImmuCard: '/svs/ivca/activateImmuCard',
  childSelfProfile: 'http://www.chinavacc.cn/wpwx/api/childTemp/', // 儿童自助建档编号获取接口
  adultSelfProfile: 'http://www.chinavacc.cn/wpwx/api/hepbTemp/', // 成人自助建档编号获取接口
  querySignature: '/svs/signature/query', // 查询签字信息
  querySignatureBatch: '/svs/signature/queryBatch', // 查询多个签字信息
  insertSignature: '/svs/signature/insert', // 插入一条签字数据
  insertSignatureBatch: '/svs/signature/insertBatch', // 批量插入签字信息
  updateSignature: '/svs/signature/update', // 更新签字内容
  updateSignatureBatch: '/svs/signature/updateBatch', // 批量更新签字内容
  deleteSignature: '/svs/signature/delete', // 删除签字信息

  getChildProfileCode: '/svs/profileCodeIncrement/getProfileCode', // 获取儿童档案编码

  savePavrVaccineRecord: '/svs/pavr/save', // 存储成人疫苗登记记录
  updatePavrVaccineRecord: '/svs/pavr/update', // 更新成人疫苗登记记录
  queryPavrVaccineRecord: '/svs/pavr/query', // 根据查询条件查询符合的成人疫苗信息
  deletePavrVaccineRecord: '/svs/pavr/delete' // 删除成人疫苗登记记录
};


/**
 * 日常管理 接口访问地址
 */

export const REPORT_URLS_ADMIN = {
  getReportNameList: 'http://localhost:2222',
  searchReservation: '/svs/reservationRecord/query', // 日常管理中预约记录
  countReservation: '/svs/reservationRecord/count' // 日常管理中预约记录条数查询
};

/**
 * 日常管理 接口访问地址（administration）
 */

export const ADMINISTRATION_URLS_ADMIN = {
  archivesQuery: '/svs/profile/administration/queryProfile', // 日常管理中档案查询
  countProfile: '/svs/profile/administration/countProfile', // 日常管理中档案查询条数
  profileDuplicatedRecord: '/svs/profile/queryDuplicatedRecord', // 日常管理中查询重卡记录
  profileDuplicatedRecordCount: '/svs/profile/profileDuplicatedRecordCount', // 日常管理中查询重卡记录的条数（用于分页）
  queryAdminVaccinateRecord: '/svs/vacc/vr/queryAdminVaccinateRecord', // 日常管理中接种记录
  queryAdminVaccinateRecordCount: '/svs/vacc/vr/queryAdminVaccinateRecordCount', // 日常管理中接种记录条数
  queryVaccineStock: 'svs/st/stockLevel/inventoryLevel', // 日常管理中疫苗库存查询
  queryVaccineStockCount: 'svs/st/stockLevel/inventoryLevelCount', // 日常管理中疫苗库存查询count
  queryProfileUploadFailedRecord: '/svs/pufr/query', // 日常管理中查询上传失败的记录
  queryProfileUploadFailedRecordCount: '/svs/pufr/count', // 日常管理中查询上传失败的记录数

  queryPovPriceManage: '/svs/sysPovVaccPriceApi/query', // 门诊疫苗自定义调价
  queryPovPriceManageCount: '/svs/sysPovVaccPriceApi/queryCount', // 门诊疫苗自定义调价Count
  updatePovPriceManage: '/svs/sysPovVaccPriceApi/update', // 修改门诊疫苗自定义调价
  insertPovPriceManage: '/svs/sysPovVaccPriceApi/insert', // 单个插入门诊疫苗自定义调价
  insertBatchPovPriceManage: '/svs/sysPovVaccPriceApi/insertBatch', // 批量插入门诊疫苗自定义调价
  deletePovPriceManage: '/svs/sysPovVaccPriceApi/delete', // 删除门诊疫苗自定义调价

  querySmsTemplateDic: '/svs/system/sysSmsTempDict/querySmsTempDict', // 获取短信模板字典

  queryOverDue: '/svs/dailymanage/overdue', // 查询逾期为种
  queryOverDueCount: '/svs/dailymanage/overduecount', // 查询逾期为种Count

  queryVaccShouldInject: '/svs/dailymanage/vaccshould', // 查询应种统计
  queryVaccShouldCount: '/svs/dailymanage/vaccshouldcount', // 查询应种统计Count

  queryVaccInoculation: '/svs/dailymanage/vaccinerate', // 查询接种考核率
  queryVaccInoculationCount: '/svs/dailymanage/vaccinerateCount', // 查询接种考核率Count

  sendVaccShoudSms: '/svs/dailymanage/sendVaccShoudSms', // 应种统计发送短信
  sendOverDueSms: '/svs/dailymanage/sendOverdueSms',  // 逾期统计发送短信


};

/**
 * 接种台  接口访问地址
 *
 */
export const VACCINATE_URLS = {
  queryVaccinateRecordSingle: '/svs/vacc/vr/queryVaccinateRecordSingle',
  queryVaccinateRecordSingleCount: '/svs/vacc/vr/queryVaccinateRecordSingleCount', // 接种记录信息单表查询
  queryVaccinateRecordSingleWithVirtual: '/svs/vacc/vr/queryVaccinateRecordSingleWithVirtual',
  queryVaccinateRecord: '/svs/vacc/vr/queryVaccinateRecord',
  queryVaccinateRecordCount: '/svs/vacc/vr/queryVaccinateRecordCount',
  queryCurrentVaccinateRecord: '/svs/vacc/vr/queryCurrentVaccinateRecord',
  queryCurrentVaccinateRecordCount: '/svs/vacc/vr/queryCurrentVaccinateRecordCount',
  addVaccinateRecord: '/svs/vacc/vr/addVaccinateRecord',
  updateVaccinateRecord: '/svs/vacc/vr/updateVaccinateRecord',
  deleteVaccinateRecord: '/svs/vacc/vr/deleteVaccinateRecord',
  queryVaccineDoseInfo: '/svs/vacc/vr/queryVaccineDoseInfo',
  queryVaccineDoseInfoCount: '/svs/vacc/vr/queryVaccineDoseInfoCount',
  addVaccinateOperateRecord: '/svs/vacc/vor/insertOperationRecord',
  addVaccRecordElcSupervision: '/svs/vacc/vr/addVaccRecordElcSupervision',
  addVaccRecordElcSupervisionBatch: '/svs/vacc/vr/addVaccRecordElcSupervisionBatch',
  addVaccRecordBatch: '/svs/vacc/vr/additionalVaccinateRecord', // 批量或者单剂补录接口
  vaccinateFinish: '/svs/vacc/vr/vaccinateFinish',
  initVaccinateRecord: '/svs/vacc/vr/initVaccinateRecord',
  vaccinateLogConsumes: '/svs/st/inoculate/queryVacc', // 接种日志 - 查询疫苗统计消耗
  vaccinateLogDosage: '/svs/st/inoculate/queryDose', // 接种日志 - 查询接种剂次
  vaccinateLogDetails: '/svs/st/inoculate/queryDetails', // 接种日志 - 查询疫苗接种明细
  vaccinateLogDetailsCount: '/svs/st/inoculate/queryDetailsCount', // 接种日志-接种明细查询Count
  vaccinateLogCount: '/svs/st/inoculate/count', // 接种日志 - 查询接种日志的统计人数
  vaccinateSignatureSave: '/svs/vacc/signature/save', // 接种签字文件保存
  jPushCallNum: '/svs/app/jPush/push/callnum', // 极光推送
  queryVaccinatedProfileByPeriodTime: '/svs/vacc/vr/queryVaccinatedProfileByPeriodTime', // 查询某个时间段内的受种人档案信息

  queryVacRecordSignatureInfo: '/svs/vacc/signature/queryVacRecordSignatureImage', // 通过登记流水号去查询接种记录签字信息
  queryEleCode: '/svs/vacc/vrelc/queryElectronic', // 查询垫子监管码
};

/**
 * 数衍平台  接口访问地址
 *
 */
export const GOOAGOO_URLS = {
  pushData: '/gag-ap-vaccine/rest/vaccine/recvThirdPartyRealVaccinationInfo',
  querySignature: '/gag-ap-vaccine/rest/vaccine/getVaccinateByOrderIdAndDeviceId',
};

/**
 * 产科接种台队列接口
 *
 */
export const REG_OBSTETRICS_URLS = {
  query: '/svs/register/roq/query',
  update: '/svs/register/roq/update',
};

/**
 * 主数据  接口访问地址
 */
export const MASTER_URLS = {
  queryVaccineProduct: '/svs/master/vp/queryVaccineProduct',
  queryVaccineProductCount: '/svs/master/vp/queryVaccineProductCount',
  addVaccineProduct: '/svs/master/vp/addVaccineProduct',
  updateVaccineProduct: '/svs/master/vp/updateVaccineProduct',
  deleteVaccineProduct: '/svs/master/vp/deleteVaccineProduct',
  queryDictionary: '/svs/master/dict/queryDictionary',
  addDictionary: '/svs/master/dict/addDictionary',
  updateDictionary: '/svs/master/dict/updateDictionary',
  deleteDictionary: '/svs/master/dict/deleteDictionary',
  queryNationBaseInfo: '/svs/master/nbi/queryNationBaseInfo',
  queryNationBaseInfoCount: '/svs/master/nbi/queryNationBaseInfoCount',
  queryNationBaseInfoByGet: '/svs/master/nbi/queryNationBaseInfoByGet',
  addNationBaseInfo: '/svs/master/nbi/addNationBaseInfo',
  updateNationBaseInfo: '/svs/master/nbi/updateNationBaseInfo',
  deleteNationBaseInfo: '/svs/master/nbi/deleteNationBaseInfo',
  queryBatchInfo: '/svs/master/batch/queryBatchInfo',
  queryBatchInfoCount: '/svs/master/batch/queryBatchInfoCount',
  queryBatchByGet: '/svs/master/batch/queryBatchByGet',
  addBatchInfo: '/svs/master/batch/addBatchInfo',
  updateBatchInfo: '/svs/master/batch/updateBatchInfo',
  deleteBatchInfo: '/svs/master/batch/deleteBatchInfo',
  queryDepartmentInfo: '/svs/master/dept/queryDepartmentInfo',
  queryDepartmentInfoCount: '/svs/master/dept/queryDepartmentInfoCount',
  queryDepartmentByGet: '/svs/master/dept/queryDepartmentByGet',
  addDepartmentInfo: '/svs/master/dept/addDepartmentInfo',
  updateDepartmentInfo: '/svs/master/dept/updateDepartmentInfo',
  deleteDepartmentInfo: '/svs/master/dept/deleteDepartmentInfo',
  queryHospitalBaseInfo: '/svs/master/hosp/queryHospitalBaseInfo',
  queryHospitalBaseInfoCount: '/svs/master/hosp/queryHospitalBaseInfoCount',
  queryHospitalBaseByGet: '/svs/master/hosp/queryHospitalBaseByGet',
  addHospitalBaseInfo: '/svs/master/hosp/addHospitalBaseInfo',
  updateHospitalBaseInfo: '/svs/master/hosp/updateHospitalBaseInfo',
  deleteHospitalBaseInfo: '/svs/master/hosp/deleteHospitalBaseInfo',
  queryManufacturerBaseInfo: '/svs/master/manufacturer/queryManufacturerBaseInfo',
  queryManufacturerBaseInfoCount: '/svs/master/manufacturer/queryManufacturerBaseInfoCount',
  queryManufacturerBaseByGet: '/svs/master/manufacturer/queryManufacturerBaseByGet',
  addManufacturerBaseInfo: '/svs/master/manufacturer/addManufacturerBaseInfo',
  updateManufacturerBaseInfo: '/svs/master/manufacturer/updateManufacturerBaseInfo',
  deleteManufacturerBaseInfo: '/svs/master/manufacturer/deleteManufacturerBaseInfo',
  queryPovInfo: '/svs/master/pov/queryPovInfo',
  queryPovInfoCount: '/svs/master/pov/queryPovInfoCount',
  queryPovByGet: '/svs/master/pov/queryPovByGet',
  addPovInfo: '/svs/master/pov/addPovInfo',
  updatePovInfo: '/svs/master/pov/updatePovInfo',
  deletePovInfo: '/svs/master/pov/deletePovInfo',
  queryPovStaff: '/svs/master/povStaff/queryPovStaff',
  queryPovStaffCount: '/svs/master/povStaff/queryPovStaffCount',
  queryPovStaffByGet: '/svs/master/povStaff/queryPovStaffByGet',
  addPovStaff: '/svs/master/povStaff/addPovStaff',
  updatePovStaff: '/svs/master/povStaff/updatePovStaff',
  deletePovStaff: '/svs/master/povStaff/deletePovStaff',

  queryPovStaffSign: '/svs/sysSignatureImages/query', // 查询医护人员签字信息
  insertPovStaffSign: '/svs/sysSignatureImages/insert', // 查询医护人员签字信息
  updatePovStaffSign: '/svs/sysSignatureImages/update', // 修改医护人员签字信息

  querySchoolBaseInfo: '/svs/master/school/querySchoolBaseInfo',
  querySchoolBaseInfoCount: '/svs/master/school/querySchoolBaseInfoCount',
  querySchoolBaseInfoByGet: '/svs/master/school/querySchoolBaseInfoByGet',
  addSchoolBaseInfo: '/svs/master/school/addSchoolBaseInfo',
  updateSchoolBaseInfo: '/svs/master/school/updateSchoolBaseInfo',
  deleteSchoolBaseInfo: '/svs/master/school/deleteSchoolBaseInfo',
  queryVaccineBroadHeading: '/svs/master/broadHeading/queryVaccineBroadHeading',
  queryVaccineBroadHeadingCount: '/svs/master/broadHeading/queryVaccineBroadHeadingCount',
  queryVaccineBroadHeadingByGet: '/svs/master/broadHeading/queryVaccineBroadHeadingByGet',
  addVaccineBroadHeading: '/svs/master/broadHeading/addVaccineBroadHeading',
  updateVaccineBroadHeading: '/svs/master/broadHeading/updateVaccineBroadHeading',
  deleteVaccineBroadHeading: '/svs/master/broadHeading/deleteVaccineBroadHeading',
  queryVaccineSubclass: '/svs/master/subclass/queryVaccineSubclass',
  queryVaccineSubclassCount: '/svs/master/subclass/queryVaccineSubclassCount',
  queryVaccineSubclassByGet: '/svs/master/subclass/queryVaccineSubclassByGet',
  addVaccineSubclass: '/svs/master/subclass/addVaccineSubclass',
  updateVaccineSubclass: '/svs/master/subclass/updateVaccineSubclass',
  deleteVaccineSubclass: '/svs/master/subclass/deleteVaccineSubclass',
  queryAdministrativeDivision: '/svs/master/ad/queryAdministrativeDivision',
  queryAdministrativeDivisionCount: '/svs/master/ad/queryAdministrativeDivisionCount',
  queryAdministrativeDivisionByGet: '/svs/master/ad/queryAdministrativeDivisionByGet',
  addAdministrativeDivision: '/svs/master/ad/addAdministrativeDivision',
  updateAdministrativeDivision: '/svs/master/ad/updateAdministrativeDivision',
  deleteAdministrativeDivision: '/svs/master/ad/deleteAdministrativeDivision',
  queryAdministrativeDivisionTreeData: '/svs/master/ad/queryAdministrativeDivisionTreeData',
  queryAdministrativeDivisionTreeLineData: '/svs/master/ad/queryAdministrativeDivisionTreeLineData',
  queryVaccineAgreementModel: '/svs/master/vam/queryVaccineAgreementModel',
  queryVaccineAgreementModelCount: '/svs/master/vam/queryVaccineAgreementModelCount',
  queryVaccineAgreementModelByRegister: '/svs/master/vam/queryVaccineAgreementModelByRegister',
  queryVaccineAgreementModelByGet: '/svs/master/vam/queryVaccineAgreementModelByGet',
  addVaccineAgreementModel: '/svs/master/vam/addVaccineAgreementModel',
  updateVaccineAgreementModel: '/svs/master/vam/updateVaccineAgreementModel',
  deleteVaccineAgreementModel: '/svs/master/vam/deleteVaccineAgreementModel',
  deleteVaccineAgreementPdf: '/svs/master/vam/deleteVaccineAgreementPDFBySubclassCode',
  downloadVaccineAgreementPdf: '/svs/master/vam/downloadVaccineAgreementPDFBySubclassCode', // 下载告知书pdf文件
  queryColdStorageFacilityInfo: '/svs/master/csf/queryColdStorageFacilityInfo',
  queryColdStorageFacilityInfoCount: '/svs/master/csf/queryColdStorageFacilityInfoCount',
  queryColdStorageFacilityByGet: '/svs/master/csf/queryColdStorageFacilityByGet',
  addColdStorageFacilityInfo: '/svs/master/csf/addColdStorageFacilityInfo',
  updateColdStorageFacilityInfo: '/svs/master/csf/updateColdStorageFacilityInfo',
  deleteColdStorageFacilityInfo: '/svs/master/csf/deleteColdStorageFacilityInfo',
  deleteColdChainRelationWithDepartment: '/svs/master/coldEquipment/deleteColdChainRelationWithDepartment',
  queryEleSupervisionInfo: '/svs/master/esa/queryEleSupervisionInfo',
  queryEleSupervisionByGet: '/svs/master/esa/queryEleSupervisionByGet',
  queryEleSupervisionInfoCount: '/svs/master/esa/queryEleSupervisionInfoCount',
  addEleSupervisionInfo: '/svs/master/esa/addEleSupervisionInfo',
  updateEleSupervisionInfo: '/svs/master/esa/updateEleSupervisionInfo',
  deleteEleSupervisionInfo: '/svs/master/esa/deleteEleSupervisionInfo',
  checkEleCode: '/svs/master/esa/checkEleCode',
  queryCommunityBaseInfo: '/svs/master/communityBaseInfo/queryCommunity',
  queryCommunityBaseInfoCount: '/svs/master/communityBaseInfo/queryCommunityCount',
  updateCommunityBaseInfo: '/svs/master/communityBaseInfo/updatecommunityBaseInfo',
  deleteCommunityBaseInfo: '/svs/master/communityBaseInfo/deletecommunityBaseInfo',
  queryAefiCodeAll: '/svs/master/aefibase/queryAll'
};

/**
 * 系统管理 接口访问地址
 */

export const SYSTEM_URLS = {
  searchWorkingDay: '/svs/sysWorkingDay/query',
  countWorkingDay: '/svs/sysWorkingDay/count',
  workingDaySetUseAble: '/svs/sysWorkingDay/setUseAble',
  insertWorkingDay: '/svs/sysWorkingDay/insert',

  countHoliday: '/svs/sysHoliday/count',
  searchHoliday: '/svs/sysHoliday/query',
  countHolidaySetUseAble: '/svs/sysHoliday/setUseAble',
  insertHoliday: '/svs/sysHoliday/insert',

  searchWorkingTime: '/svs/sysWorkingTime/query',
  countWorkingTime: '/svs/sysWorkingTime/count',
  queryWorkingTimeByDate: '/svs/sysWorkingTime/getWorkingTimeByDate',
  insertWorkingTime: '/svs/sysWorkingTime/insert',

  searchUser: '/svs/sysUser/query',
  countUser: '/svs/sysUser/count',
  insertUser: '/svs/sysUser/insert',
  updateUser: '/svs/sysUser/modify',
  deleteUser: '/svs/sysUser/delete',

  queryAdminVaccinateRecord: '/svs/vacc/vr/queryAdminVaccinateRecord',
  queryAdminVaccinateRecordCount: '/svs/vacc/vr/queryAdminVaccinateRecordCount',

  searchDict: '/svs/sysConfDict/query',
  countDict: '/svs/sysConfDict/count',
  insertDict: '/svs/sysConfDict/insert',
  updateDict: '/svs/sysConfDict/modify',
  deleteDict: '/svs/sysConfDict/delete',

  searchConf: '/svs/sysConf/query',
  countConf: '/svs/sysConf/count',
  insertAndModifyConf: '/svs/sysConf/insertAndModify',
  getConf: '/svs/sysConf/getConf',

  querySysAnnouncement: '/svs/sysAnnouncement/query', // 查询系统公告
  querySysAnnouncementCount: '/svs/sysAnnouncement/queryCount', // 查询系统公告count

  queryMessageTemp: '/svs/system/sysSmsTemplate/queryTemplate', // 查询短信模板
  queryMessageTempCount: '/svs/system/sysSmsTemplate/queryTemplateCount', // 查询短信模板Count
  insertMessageTemp: '/svs/system/sysSmsTemplate/insertTemplate',  // 添加本地短信模板
  deleteMessageTemp: '/svs/system/sysSmsTemplate/deleteTemplate', // 删除本地短信模板
  updateMessageTemp: '/svs/system/sysSmsTemplate/updateTemplate', // 修改本地短信模板

  queryMessageRecordInfo: '/svs/system/sysSmsRecord/querySmsRecord', // 查询短信记录
  queryMessageRecordCount: '/svs/system/sysSmsRecord/smsRecordCount', // 查询短信记录count

  querySmsBilling: '/svs/system/sysSmsRecord/smsBilling', // 查询短信计费数据
  querySmsBillingCount: '/svs/system/sysSmsRecord/smsBillingCount', // 查询短信计费count

  queryRegPreModel: '/svs/register/regPreDiagnosisModel/queryRegPreDiagnosisModel', // 预诊模板内容
  queryRegPreModelAndCount: '/svs/register/regPreDiagnosisModel/count', // 预诊模板内容
  insertRegPreModel: '/svs/register/regPreDiagnosisModel/insertRegPreDiagnosisModel', // 插入一条预诊模板内容
  updateRegPreModel: '/svs/register/regPreDiagnosisModel/updateRegPreDiagnosisModel', // 更新一条预诊模板内容
  deleteRegPreModel: '/svs/register/regPreDiagnosisModel/deleteRegPreDiagnosisModel', // 删除一条预诊模板内容

  queryRegPreRecord: '/svs/register/regPreDiagnosisRecordApi/query', // 查询预诊记录
  regPreDiagnosisRecordInsert: '/svs/register/regPreDiagnosisRecordApi/insert', // 插入预诊记录信息

  queryRegPreRecordInfo: '/svs/register/regPreDiagnosisRecordApi/queryPreDiagnosisRecord', // 查询预诊记录信息 - 日常管理 - 预诊记录信息
  queryRegPreRecordInfoCount: '/svs/register/regPreDiagnosisRecordApi/queryPreDiagnosisRecordCount', // 查询预诊记录信息Count

  queryRegPreRecordDetail: '/svs/register/regPreDiagnosisRecordApi/queryPreDiagnosisDetail', // 查看预诊记录明细
  queryRegPreRecordDetailCount: '/svs/register/regPreDiagnosisRecordApi/queryPreDiagnosisDetailCount', // 查看预诊记录明细Count


};

/**
 * 自助取号  接口访问地址
 *
 */

export const WAIT_SELF = {
  selfMachine: '/svs/selfMachine/call',
  profileSearch: '/svs/profile/query'
};

/**
 *  排号队列 接口
 *
 */
export const REG_QUEUE = {
  retrieve: '/svs/queue/retrieve',
  waitCount: '/svs/regQueue/waitCount',
  regCall: '/svs/regQueue/regCall',
  regCallAgain: '/svs/regQueue/regCallAgain',
  passRegQueue: '/svs/regQueue/passRegQueue',
  query: '/svs/regQueue/query',
  regQueueStatusChangeRecord: '/svs/regQueueStatusChangeRecord/query',
  changeStatus: '/svs/regQueue/changeStatus',
  removeRegisterQueueData: '/svs/regQueue/removeQueue', // 从登记台队列中删除排队信息
  resetPassedQueueData: '/svs/regQueue/resetPassedQueueData', // 将已叫号数据重新放入待叫号队列中
  vaccinateQueue: '/svs/regQueue/vaccinateQueue', // 查询接种台可接种队列
  vaccinateCall: '/svs/regQueue/vaccinateCall', // 查询接种台可接种队列
};

/**
 * 排号队列 接口访问地址 新
 */
export const QUEUE = {
  retrieve: '/svs/queue/retrieve', // 自助机取号
  repeatCallQueueCode: '/svs/queue/repeatCallQueueCode', // 推送至iot设备重复叫号
  callQueueCode: '/svs/queue/callQueueCode', // 登记台直接叫号
  callNextQueueCode: '/svs/queue/callNextQueueCode', // 登记台叫下一号
  initQueueCode: '/svs/queue/init', // 初始化队列数据
  addToPayQueueOrVaccinateQueue: '/svs/queue/addToPayQueueOrVaccinateQueue', // 登记台登记完成推送至收银台或接种台
  addToVaccinationFromPayQueue: '/svs/queue/addToVaccinationFromPayQueue', // 收银台缴费完成推送至接种台
  addToVaccinationOnlyFromPayQueue: '/svs/queue/addToVaccinationOnlyFromPayQueue', // 收银台缴费完成推送至接种台
  cancelPayOrder: '/svs/queue/cancelPayOrder', // 收银台取消订单
  vaccineCallNextNumber: '/svs/queue/vaccination/callNextNumber', // 接种台叫下一号
  vaccineCallNumber: '/svs/queue/vaccination/callNumber', // 接种台直接叫号
  vaccinePassNumber: '/svs/queue/vaccination/passNumber', // 接种台过号号
  vaccinateFinished: '/svs/queue/vaccination/finished', // 接种台接种完成
  vaccinateUnqualified: '/svs/queue/vaccination/unqualified', // 接种台备注不能接种的
  queryProfileBeforeRetrieve: '/svs/queue/queryProfileBeforeRetrieve',
  updateQueueItemInfoOnRegister: '/svs/queue/updateQueueItemInfoOnRegister', // 更新登记台已叫号队列中的排号信息，将档案信息与空排号信息进行关联
  deleteQueueItem: '/svs/queue/deleteQueueItem', // 更新登记台已叫号队列中的排号信息，将档案信息与空排号信息进行关联
};

/**
 * 库存接口
 */
export const STOCK_URLS = {
  stockAllot: '/svs/st/query/stock/allot',  // 查询平级调拨的出入库记录
  queryNeedIn: '/svs/st/storage/query', // 查询需要入库的信息
  queryNeedInCount: '/svs/st/storage/queryCount', // 查询需要入库的信息count
  exportInExcel: '/svs/st/storage/excel',//导出平台入库数据
  confirmVaccineStorage: '/svs/st/storage/confirm', // 疫苗确认入库（平台入库）
  refused: '/svs/st/storage/refused', // 疫苗入库拒收（平台入库）
  cityInDetails: '/svs/st/storage/queryDetail', // 市平台入库疫苗详情查询
  cityInDetailsCount: '/svs/st/storage/queryDetailCount', // 市平台入库疫苗详情查询count
  refreshCityPlatformOrder: '/svs/st/storage/refresh', // 刷新市平台订单
  sendBack: '/svs/st/query/stock/sendBack',  // 查询市平台调拨的出入库记录
  stockedBack: '/svs/st/inAndOut/platformBack',
  stockOther: '/svs/st/query/stock/other',  // 查询其它出入库记录
  stockMass: '/svs/st/query/stock/mass',  // 查询批量接种出库
  stockMassOut: '/svs/st/inAndOut/massOut', // 新增批量接种出库
  stockBreakage: '/svs/st/query/stock/breakage',  // 查询报损库存
  stockDam: '/svs/st/query/stock/dam',  // 查询合议修订记录
  discussModify: '/svs/st/inAndOut/dam', // 合议出入库操作
  breakage: '/svs/st/inAndOut/breakage', // 报损出库
  allotInPov: '/svs/st/inAndOut/allot', // 门诊内调拨操作
  vaccinate: '/svs/st/inAndOut/vaccinate', // 接种出库
  other: '/svs/st/inAndOut/other', // 其他入库操作
  selfStorageIn: '/svs/st/selfStorage/storage', // 自采入库操作
  massOut: '/svs/st/inAndOut/massOut', // 批量接种出库
  massReturn: '/svs/st/inAndOut/massReturn',  // 批量接种退回（入库）
  inventory: '/svs/st/query/stock/inventory', // 查询库存余量
  inventoryCount: '/svs/st/query/stock/inventoryCount', // 查询库存余量count
  daily: '/svs/st/rpt/g/daily',  // 库存盘点汇总
  inventoryRecord: '/svs/st/rpt/reprotDaily',  // 获取库存盘点记录
  updateInventoryRecord: 'svs/st/rpt/upReprotDaily', // 修改库存盘点记录
  queryBatchVaccinateRecord: '/svs/vacc/bvr/queryBatchVaccinateRecord',  // 查询批量接种记录
  queryBatchVaccinateRecordCount: '/svs/vacc/bvr/queryBatchVaccinateRecordCount',  // 查询批量接种记录
  insertBatchInject: '/svs/vacc/bvr/insert', // 插入单条批量接种信息
  queryPresell: '/svs/st/query/stockPresell/presell', // 预售预警
  queryPresellCount: '/svs/st/query/stockPresell/presellCount', // 预售预警
  queryEleSupervisionInfo: '/svs/master/esa/queryEleSupervisionInfo', // 电子码监管理 查询电子监管码记录
  queryEleSupervisionInfoCount: '/svs/master/esa/queryEleSupervisionInfoCount', // 查询电子监管码数据Count
  queryBatch: '/svs/master/batch/queryBatchInfo', // 批号查询
  queryBatchInfoCount: '/svs/master/batch/queryBatchInfoCount', // 批号查询count
  queryVaccUseDetail: '/svs/st/query/stock/vacUseSelect', // 疫苗使用详情
  queryVaccUseDetailCount: '/svs/st/query/stock/vacUseSelectCount', // 疫苗使用详情count
  vacUsedDetails: '/svs/st/query/stock/vacUsedDetails', // 疫苗使用详情--进一步的使用详情
  queryInAndOutDetail: '/svs/st/query/stock/changeRecord/query', // 查询出入库明细记录
  queryInAndOutDetailCount: '/svs/st/query/stock/changeRecord/count', // 查询出入库明细记录count
  queryInAndOutCollect: '/svs/st/InventoryDetails/query', // 查询出入库明细汇总记录
  queryInAndOutCollectCount: '/svs/st/InventoryDetails/count', // 查询出入库明细汇总记录count
  queryColdChain: '/svs/master/coldEquipment/query', // 查询冷链设备信息
  queryColdChainCount: '/svs/master/coldEquipment/count', // 查询冷链设备信息count
  modifyFacility: '/svs/master/coldEquipment/update', // 编辑冷链设备
  getVaccProduct: '/svs/master/vp/query', // 获取疫苗产品下拉选
  getProdBatchOptions: '/svs/master/batch/query', // 获取产品的批号
  getFacilityOptions: '/svs/master/csf/query', // 获取冰箱设备（部门）
  queryBack: '/svs/st/query/stock/queryBack', // 获取已入库信息（用于市平台退回）
  queryBackCount: '/svs/st/query/stock/queryBackCount', // 获取已入库信息count
  queryVaccineInventory: '/svs/st/storage/queryVaccineInventory', // 查询可登记疫苗信息
  queryMemo: '/svs/st/query/stock/changeRecord/queryMemo', //  查询出入库七种类型 memo

};

/**
 * 库存模块导出接口API
 */
export const STOCK_EXPORT_URLS = {
  exportChangeRecords: '/svs/st/query/stock/changeRecord/excelChangeRecord',  // 库存--出入库明细导出
  excelInventoryDetail: '/svs/st/InventoryDetails/excelInventoryDetail',  // 出入库记录汇总导出
  profileExcel: '/svs/profile/profileExcel',  // 档案查询导出
  vaccinateRecordExcel: '/svs/vacc/vr/vaccinateRecordExcel',  // 接种记录导出
  queryVaccExcel: '/svs/dailymanage/queryVaccExcel',  // 应种统计导出
  vaccineRateExcel: '/svs/dailymanage/vaccineRateExcel',  // 接种合格率导出
  batchVaccinateRecordExcel: '/svs/vacc/bvr/batchVaccinateRecordExcel',  // 批量接种导出
  queryOverDueExcel: '/svs/dailymanage/queryOverDueExcel',  // 逾期未种统计导出
  inventoryLevelExcel: '/svs/st/stockLevel/inventoryLevelExcel',  // 疫苗库存导出
  excelProfilestatuschange: '/svs/profilestatuschange/excelProfilestatuschange',  // 在册变更查询
  excelPreDiagnosisRecord: '/svs/register/regPreDiagnosisRecordApi/excelPreDiagnosisRecord',  // 预诊记录管理
  excelSmsRecord: '/svs/system/sysSmsRecord/excelSmsRecord',  // 短信模板管理
  excelReservationRecord: '/svs/reservationRecord/excelReservationRecord',  // 预约记录查询
  inoculateLogExport: '/svs/st/inoculate/inoculateLogExport',  // 接种日志导出
  excelProfileUploadFailed: '/svs/pufr/excelProfileUploadFailed',  // 上传失败档案查询
  dailyExcel: '/svs/st/rpt/dailyExcel',  // 日报Excel导出数据
  monthlyExcel: '/svs/st/rpt/monthlyExcel',  // 月报Excel导出数据
  excelDuplicatedProfile: '/svs/profile/excelDuplicatedProfile',  // 重卡查询报表导出
  excelFixedAssets: '/svs/master/fixedAssets/excelFixedAssets',  // 固定资产导出
  excelStockInventory: '/svs/st/rpt/dailyExcel', // 导出库存盘点
  excelStockInventoryRecord: '/svs/st/rpt/reprotDailyExcel', // 导出库存盘点记录
};

/**
 * 收费管理接口
 */
export const CHARGE_URLS = {
  invoice: '/svs/pay/rpt/invoice',  // 发票统计
  invoiceAndCount: '/svs/pay/rpt/invoiceCount',  // 发票统计Count
  invoiceTotal: '/svs/pay/rpt/count',  // 发票统计总数
  payType: '/svs/pay/rpt/onlinePay',  // 网上支付统计
  orderManager: '/svs/pay/rpt/billRecord',  // 对账管理
  reportManager: '/svs/pay/rpt/dayDetails',  // 报表明细
  reportManagerAndCount: '/svs/pay/rpt/dayDetailsCount',  // 报表明细Count
};

/**
 * 微信公众号接口
 */
export const WX_URLS = {
  queryDictionary: '/svs/master/dict/queryDictionary', // 查询字典表数据信息
  queryAdministrativeData: '/svs/master/ad/queryAdministrativeDivisionTreeData',  // 查询行政区划数据树形结构数据
  queryNationBaseInfo: '/svs/master/nbi/queryNationBaseInfo',  // 查询民族表数据
  queryHospitalBaseInfo: '/svs/master/hosp/queryHospitalBaseInfo',  // 查询医院信息
  sendSms: '/svs/iot/AppSendSmsApi/sendSms',  // 发送短信验证码
  // aa : '/svs/profile/query',  // 查询受种人档案信息

  addProfile: '/svs/iot/selfProfile/addSelfProfile',  // 添加自助建档信息
  queryProfile: '/svs/iot/selfProfile/querySelfProfile',  // 查询自助建档信息
  deleteProfile: '/svs/iot/selfProfile/deleteSelfProfile',  // 删除建档信息
  querySelfProfileCount: '/svs/iot/selfProfile/querySelfProfileCount',  // 查询自助建档信息Count
  addAdultProfile: '/svs/iot/selfProfile/addSelfProfileAdult',  // 添加成人自助建档信息

  queryAppointRecord: '/svs/reservationRecord/queryRecordByUserAccount',  // 根据用户账户查询预约的记录
  saveSignatureInfo: '/svs/reservationRecordDetail/saveReservationSignature',  // 存储预约签字信息
  changeAppoint: '/svs/reservationConfirm/confirm',  // 预约改期  移动端预约改期使用此端口进行预约改期
  getNextWorkingDay: '/svs/sysWorkingDay/getNextWorkingDay',  // 根据预约时间获取一周可预约时间
  getWorkingTimeByDate: '/svs/sysWorkingTime/getWorkingTimeByDate',  // 根据日期查询可预约时段

  queryAgreementModel: '/svs/master/vam/queryVaccineAgreementModelByRegister',  // 登记台根据小类编码查询告知书模板信息


  // 接种反馈列表-----自观模块
  queryVaccinateRecord: '/svs/vacc/vr/queryAdminVaccinateRecord',  // 日常管理接种记录查询
  queryAttendList: '/svs/iot/AppUserBindingProfile/query',  // 查询我的关注列表
  insertAttend: '/svs/iot/AppFocusBindingApi/insert',  // 插入关注绑定数据
  addSelfObserveRecord: '/svs/sob/sor/addSelfObserveRecord',  // 添加接种反馈
  querySelfObserveRecordCount: '/svs/sob/sor/querySelfObserveRecordCount',  // 查询自观记录Count
  querySelfObserveRecordContent: '/svs/sob/sor/querySelfObserveRecordContent',  // 查询自观记录相关信息
  uploadFile: '/svs/sob/sodr/uploadFile',  // 上传自观相关的图片信息
  serveFiles: '/resourceHandler',  // 上传自观相关的图片信息


  // reportManager: '',  //
  // reportManager: '',  //
};

/**
 * 预约相关访问地址
 */
export const RESERVATION_URLS = {
  queryReservationRecord: '/svs/reservationRecord/query',
  countReservationRecord: '/svs/reservationRecord/count',
  saveReservationRecord: '/svs/reservationRecord/insert',
  countByWorkingTime: '/svs/reservationRecord/countByWorkingTime',
  queryReservationRecordDetail: '/svs/reservationRecordDetail/queryWithReservation',
  cancelReservation: '/svs/reservationRecordDetail/cancel',
  queryReservationRecordWithDetail: '/svs/reservationRecord/queryReservationWithReservationDetail',
  countReservationRecordWithDetail: '/svs/reservationRecord/countReservationWithReservationDetail',
  deleteReservationByCode: '/svs/reservationRecord/deleteReservationByCode',
  deleteReservationDetailByCode: '/svs/reservationRecord/deleteReservationDetailByCode'
};

export const REGIST_RECORD_URLS = {
  saveRegistRecord: '/svs/regRecord/insert',
  saveRegistRecordBatch: '/svs/regRecord/insertBatch',
  queryRegistRecord: '/svs/regRecord/query',
  cancelRegRecord: '/svs/regRecord/cancelRegRecord',
  updateRegistRecord: '/svs/regRecord/update',
  saveRegistRecordAndSignature: '/svs/regRecord/insertRegCordAndSignature', // 存储登记信息和签字信息
  countRegistRecord: '/svs/regRecord/count', // 统计登记记录的数量
  updateRecordOrderStatusByOrderSerial: '/svs/regRecord/updateRecordOrderStatusByOrderSerial',
  cancelRecordOrderStatusByOrderSerial: '/svs/regRecord/cancelRecordOrderStatusByOrderSerial'
};

/**
 * 缴费相关访问地址
 */
export const PAYMENT_URLS = {
  generateOrder: '/svs/pay/generate',
  payOrder: '/svs/pay/complete',
  cancelOrder: '/svs/pay/cancel',
  queryListByGlobalSerial: '/svs/pay/query/g',
  queryByOrderSerial: '/svs/pay/query/o',
  queryByCondition: '/svs/pay/queryByCondition',
  countByCondition: '/svs/pay/countByCondition',
  issueInvoice: '/svs/pay/invoice/issueInvoice', // 获取发票打印信息
  updateInvoiceStatus: '/svs/pay/invoice/updateOrderInvoiceStatus', // 更新发票状态 - 开具发票
  updateInvoiceBy: '/svs/pay/invoice/invoiceby', // 新增开票人
  invoiceInvalid: '/svs/pay/invoice/invalid', // 发票作废
  payOrderList: '/svs/pay/completeList', // 批量缴费订单
  cancelOrderList: '/svs/pay/cancel/orderList', // 批量取消订单
  cancelOrderByOrderSerialListAndGeneFree: '/svs/pay/cancelAndGen', // 收银台取消订单，同时生成新的免费的订单
  payOrderAlipay: '/svs/pay/mobile/AlipayTrade', // 收银台 - 选择移动支付(支付宝支付)缴费订单,只能选择单个的订单缴费
  queryPayOrderAlipay: '/svs/pay/mobile/AlipayTradeQuery', // 收银台 - 查询校验付款结果是否成功付款

  changeOrderStatus: '/svs/pay/updateOrderStatus', // 改变订单状态

};

/**
 * 留观相关接口
 */
export const OBSERVE_URLS = {
  addObserveRecord: '/svs/obs/or/addObserveRecord',
  updateObserveRecord: '/svs/obs/or/updateObserveRecord',
  deleteObserveRecord: '/svs/obs/or/deleteObserveRecord',
  queryObserveRecord: '/svs/obs/or/queryObserveRecord',
  queryObserveRecordCount: '/svs/obs/or/queryObserveRecordCount',
};

/**
 * 外接设备相关接口
 */
export const IOT_URLS = {
  addSelfProfile: '/svs/iot/selfProfile/addSelfProfile',
  updateSelfProfile: '/svs/iot/selfProfile/updateSelfProfile',
  updateSelfProfileCheckStatus: '/svs/iot/selfProfile/updateSelfProfileCheckStatus',
  deleteSelfProfile: '/svs/iot/selfProfile/deleteSelfProfile',
  querySelfProfile: '/svs/iot/selfProfile/querySelfProfile',
  querySelfProfileCount: '/svs/iot/selfProfile/querySelfProfileCount',

  querySelfRabiesRecord: '/svs/iot/srbr/querySelfRabiesBittenRecord', // app犬伤记录
  updateSelfRabiesRecord: '/svs/iot/srbr/updateSelfRabiesBittenRecord', // app犬伤记录

  queryIotFacilityQueue: '/svs/iot/facilityQueue/queryIotFacilityQueue',
  queryIotFacilityQueueCount: '/svs/iot/facilityQueue/queryIotFacilityQueueCount',
  addIotFacilityQueue: '/svs/iot/facilityQueue/addIotFacilityQueue', // 关联叫号屏
  addIotFacilityQueueBatch: '/svs/iot/facilityQueue/addIotFacilityQueueBatch', // 批量关联叫号屏
  updateIotFacilityQueue: '/svs/iot/facilityQueue/updateIotFacilityQueue', // 更新iot设备
  deleteIotFacilityQueue: '/svs/iot/facilityQueue/deleteIotFacilityQueue', // 删除iot设备
  deleteIotFacilityQueueBatch: '/svs/iot/facilityQueue/deleteIotFacilityQueueBatch', // 批量删除iot设备

  queryScreenIotInfo: '/svs/master/fixedAssets/query', // 查询叫号屏设备

};

export const DEPARTMENT_CONFIG = {
  getVaccineListByDept: '/svs/master/departmentVaccineConfigApi/getVaccineListByDept', //
  insertDepartVacConfig: '/svs/master/departmentVaccineConfigApi/insert', // 插入部门疫苗配置信息
  insertBatchDepartVacConfig: '/svs/master/departmentVaccineConfigApi/insertBatch', // 批量插入部门疫苗配置信息
  deleteBatchDepartVacConfig: '/svs/master/departmentVaccineConfigApi/deleteDepartment' // 删除某部门下面配置的疫苗

};
/**
 * 设备类型管理
 */
export const DEVICE_TYPE_URLS = {
  queryDeviceType: '/svs/master/DeviceType/query', // 查询设备类型
  queryDeviceTypeOptions: '/svs/master/DeviceType/queryCodeAndName',
  queryDeviceTypeCount: '/svs/master/DeviceType/queryDeviceTypeCount', // 查询设备类型count
  insertDeviceType: '/svs/master/DeviceType/insert', // 新增设备类型
  editDeviceType: '/svs/master/DeviceType/update', // 新增设备类型
  deleteDeviceType: '/svs/master/DeviceType/delete', // 删除设备类型

};
/**
 * 固定置产管理
 */
export const FIXED_ASSETS_URLS = {
  queryFixedAssets: '/svs/master/fixedAssets/query', // 查询固定资产
  queryFixedAssetsCount: '/svs/master/fixedAssets/queryCount', // 查询固定资产count
  insert: '/svs/master/fixedAssets/insert', // 新增固定资产
  edit: '/svs/master/fixedAssets/update', // 新增固定资产
  delete: '/svs/master/fixedAssets/delete', // 删除固定资产

};

/**
 * 接种策略相关访问地址
 */
export const VACCINATE_STRATEGY_URLS = {
  queryRecommendedVaccine: '/svs/vst/getRecommend',
  queryPersonalizeConf: '/svs/vst/personalizeConf/queryList', // 查询不接种疫苗列表
  insertPersonalizeConf: '/svs/vst/personalizeConf/insert', // 插入单条疫苗不接种信息
  queryRecommendInAppointment: '/svs/vst/getRecommend/queryAppointment', // 查询预约接种策略疫苗列表
  queryPovBatch: '/svs/system/PovBatchRelation/queryPovBatchStatus', // 门诊疫苗配置批次
  queryPovBatchCount: '/svs/system/PovBatchRelation/queryPovBatchStatusCount', // 门诊疫苗配置批次Count
  updatePovBatch: '/svs/system/PovBatchRelation/update', // 修改单个门诊批次状态信息
  flushVaccineModel: '/svs/vst/vaccinee_model/flush', // 刷新单个受种人的接种策略模型
  queryDiseaseCategory: '/svs/vst/disease/queryDiseaseCategory', // 查询疾病大类编码

  queryInjectInfo: '/svs/vst/getSchedule', // 打印注射单信息
};

export const PLATFORM_PLAN_URLS = {
  planConfigQuery: '/platform/plan/config/query',
  planConfigInsert: '/platform/plan/config/insert',
  planConfigUpdate: '/platform/plan/config/update',
  planConfigDelete: '/platform/plan/config/delete',
  planConfigCount: '/platform/plan/config/count',
  planYearQuery: '/platform/plan/year/query',
  planYearCount: '/platform/plan/year/count',
  planYearCheck: '/platform/plan/year/check',
  planYearSave: '/platform/plan/year/save',
  planYearUpdate: '/platform/plan/year/update',
  planYearDelete: '/platform/plan/year/delete',
  planYearDetailQuery: '/platform/plan/year/detail/query',
  planYearDetailGet: '/platform/plan/year/detail/get',
  planYearDetailGetWithConfig: '/platform/plan/year/detail/get/config',
  planYearDetailDelete: '/platform/plan/year/detail/delete',
};

// 市平台 - 出入库信息查询
export const VACCINE_IN_OUT_INFO_URLS = {
  queryVacInOutInfo: '/platform/stok/information/queryStockReacord', // 出入库信息查询
  queryVacInOutInfoCount: '/platform/stok/information/queryStockReacordCount', // 出入库信息查询Count
  deleteOrder: '/platform/stok/operation/deleteOrder', // 删除订单
  queryVacInOutInfoDetail: '/platform/stok/operation/stokOperationDetail', // 出入库操作共用查询详情
  querySumPrice: '/platform/stok/operation/querySumPrice', // 出入库操作共用查询详情价格金额
  outOfStock: '/platform/stok/operation/outOfStock', // 出库确认（确认/失败）
  warehousing: '/platform/stok/operation/warehousing', // 入库确认（确认/失败/退回）
  isPay: '/platform/stok/operation/isPay', // 确认付款
};

// 市平台 - AEFI相关接口
export const VACCINE_AEFI_MANAGE_URLS = {
  queryAEFIReportList: '/svs/aefiReport/queryAEFIReportList', // AEFI个案报告查询列表接口
  queryAEFIReportCount: '/svs/aefiReport/queryAEFIReportCount', // AEFI个案报告查询Count
  insert: '/svs/aefiReport/insert', // AEFI个案报告新增接口
  update: '/svs/aefiReport/update', // AEFI个案报告修改接口
  delete: '/svs/aefiReport/delete/', // AEFI个案报告删除接口
};
