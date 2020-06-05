/**
 * 疫苗出入库市平台接口地址
 */
export const PlatFormUrl = {
  queryBatch: '/platform/stock/batch/queryBatch',
  queryBatchCount: '/platform/stock/batch/queryBatchCount',
  queryStock: '/platform/stock/inventory/InventoryLevels',
  queryStockCount: '/platform/stock/inventory/InventoryCount',
  queryStockBatchFromAli: '/platform/stok/VaccineInfo/queryVaccineInfo'
};

/**
 * 疫苗出入库 - 盘点接口地址
 */
export const VacStockCheckUrl = {
  stockCheck: '/platform/stok/taking/stockTaking', // 盘点库存查询
  stockCheckCount: '/platform/stok/taking/stockTakingCount', // 盘点库存统计
  stockCheckModify: '/platform/stok/taking/updateInventory', // 盘点库存数量修改
  updateStockPrice: '/platform/stok/taking/updatePrice', // 库存盘点修改价格
  addStockCheckPlan: '/platform/stock/checkInventory/checkPlan', // 新增盘点计划
  queryInventoryPlan: '/platform/stock/checkInventory/InventoryPlan', // 盘点计划查询
  queryInventoryPlanCount: '/platform/stock/checkInventory/InventoryPlanCount', // 盘点计划查询据数量
  queryPlanDetail: '/platform/stock/checkInventory/planDetail', // 盘点计划详情查询
  queryPlanDetailCount: '/platform/stock/checkInventory/planDetailCount', // 盘点计划详情查询据数量
  deleteStockPlan: '/platform/stock/check/deletePlanAndDetail', // 盘点计划删除
  queryCheckPlanRecord: '/platform/stok/taking/inventoryRecord', // 市平台查询盘点记录数据
  countCheckPlanRecord: '/platform/stok/taking/inventoryRecordCount', // 市平台查询盘点记录数据数量
  queryInAndOutReport: '/platform/stok/taking/purchaseReport', // 进销存报表查询
  countInAndOutReport: '/platform/stok/taking/purchaseReportCount', // 进销存报表统计
  queryInAndOutReportDetail: '/platform/stok/taking/purchaseReportDetail', // 进销存报表明细查询
  countInAndOutReportDetail: '/platform/stok/taking/purchaseReportDetailCount', // 进销存报表明细统计
};

/**
 * 疫苗出入库相关
 */
export const VacStockStorageUrl = {
  storage: '/platform/stock/storage/inStorage', // 疫苗入库
  outOfStock: '/platform/stock/storage/outOfStock', // 疫苗出库
  sendBack: '/platform/stock/storage/sendBack', // 疫苗退回
  scrap: '/platform/stock/storage/scrap', // 疫苗报损
  use: '/platform/stock/storage/use', // 疫苗使用
  consume: '/platform/stock/storage/consume', // 疫苗消耗
  freeze: '/platform/stock/storage/freeze', // 疫苗冻结
};

/*
* 出入库审批操作相关接口
* */
export const VacStockApprovalUrl = {
  queryVacStockApproval: '/platform/stok/operation/stokOperation', // 出入库操作共用查询
  queryVacStockApprovalCount: '/platform/stok/operation/stokOperationCount', // 出入库操作共用查询Count
  queryStockApprovalDetail: '/platform/stok/operation/stokOperationDetail', //  出入库操作共用查询详情
  queryStockApprovalAmount: '/platform/stok/operation/querySumPrice', //  出入库操作共用查询详情(查询价格Sum)
  approval: '/platform/stok/operation/approval', //  审批（修改订单状态通过/不通过）
  sureOutOfStock: '/platform/stok/operation/outOfStock', //  出库确认（确认/失败）
  sureInOfStock: '/platform/stok/operation/warehousing', //  入库确认（确认/失败）
  delOrder: '/platform/stok/operation/deleteOrder', //  删除订单
  updateOrder: '/platform/stok/operation/updateOrder', // 修改订单
};

// 市平台 - 疫苗出入库管理 - 查询统计
export const VACCINE_IN_OUT_URLS = {
  queryVacInOutDetail: '/platform/stok/queryreacord/selectVaccineoOrder', // 分疫苗出入库明细统计
  queryVacInOutDetailCount: '/platform/stok/queryreacord/selectVaccineoOrderCount', // 分疫苗出入库明细统计Count
  queryAreaInOutDetail: '/platform/stok/queryreacord/RegionVaccineoOrder', // 分地区出入库明细查询
  queryAreaVacInOutDetailCount: '/platform/stok/queryreacord/RegionVaccineoOrderCount', // 分地区出入库明细查询Count
  queryAreaVacPriceSum: '/platform/stok/queryreacord/querySumPriceDetail', // 查询分地区入库的订单的总金额和数量
  queryNearlyEffective: '/platform/stok/queryreacord/vaccineQuery', // 近效期疫苗情况查询
  queryNearlyEffectiveCount: '/platform/stok/queryreacord/vaccineQueryCount', // 近效期疫苗情况查询Count
};

/**
 * 大屏展现地址
 */
export const BIG_SCREEN_URLS = {
  queryDupProfile: '/platform/screenDisplay/profileDupRate', // 档案重卡率
  queryProfileComplete: '/platform/screenDisplay/statistics', // 档案信息完整率
  queryVaccBusinessVolume: '/platform/screenDisplay/queryTraffic', // 查询实时业务量
  queryVaccinatedRate: '/platform/screenDisplay/queryVaccRecord', // 门诊接种率
  queryVaccInventory: '/platform/screenDisplay/queryInventory', // 疫苗库存量
  queryportfolio: '/platform/screenDisplay/queryportfolio', // 统计7天或者1一个月的业务量
  povCount: './platform/screenDisplay/povCount', // 查询根据市编码统计的pov的数量

  queryVaccinateReview: '/platform/vacReview/vaccinateReview', // 查询追溯接种全流程
  queryVaccineReview: '/platform/vacReview/vaccineReview', // 追溯疫苗从厂家到接种的全流程(疫苗全流程)
  queryBroadHeadingInventory: '/platform/screenDisplay/broadHeadingInventory', // 查询每个疫苗大类的库存数量
  queryVaccineStockByType: '/platform/screenDisplay/InventoryByType', // 根据疫苗类型查询库存量
};
