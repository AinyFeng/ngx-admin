/**
 * 接口访问地址 - 常量
 */

/**
 * 冷链设备管理页面访问接口
 */
export const DEVICE_URLS = {
/*  getTreeData: '/platForm/master/queryStockTreeLineData',*/
  getTreeData: '/svs/platform/master/queryStockTreeLineData',
  queryStockTreeDataByCityCode: '/svs/platform/master/queryStockTreeDataByCityCode',
  queryPlatformDeviceInfo: '/platform/coldchain/deviceInfo/queryPlatformDeviceInfo',
  queryPlatformDeviceInfoCount: '/platform/coldchain/deviceInfo/countPlatformDeviceInfo',
  insertPlatformDeviceInfo: '/platform/coldchain/deviceInfo/insertPlatformDeviceInfo',
  updatePlatformDeviceInfo: '/platform/coldchain/deviceInfo/updatePlatformDeviceInfo',
  deletePlatformDeviceInfo: '/platform/coldchain/deviceInfo/deletePlatformDeviceInfo',
};
/**
 * 监控设备管理页面访问接口
 */
export const MONOIOR_DEVICE_URLS = {
  queryPlatformMonitorInfo: '/platform/coldchain/gatewayInfo/queryGatewayInfo',
  queryPlatformMonitorInfoCount: '/platform/coldchain/gatewayInfo/countGatewayInfo',
  insertPlatformMonitorInfo: '/platform/coldchain/gatewayInfo/insertGatewayInfo',
  updatePlatformMonitorInfo: '/platform/coldchain/gatewayInfo/updateGatewayInfo',
  deletePlatformMonitorInfo: '/platform/coldchain/gatewayInfo/deleteGatewayInfo',
};
/**
 * 传感器页面访问接口
 */
export const SENSOR_DEVICE_URLS = {
  queryPlatformSensorInfo: '/platform/coldchain/sensorInfo/querySensorInfo',
  queryPlatformSensorInfoCount: '/platform/coldchain/sensorInfo/countSensorInfo',
  insertPlatformSensorInfo: '/platform/coldchain/sensorInfo/insertSensorInfo',
  updatePlatformSensorInfo: '/platform/coldchain/sensorInfo/updateSensorInfo',
  deletePlatformSensorInfo: '/platform/coldchain/sensorInfo/deleteSensorInfo',
  queryFacilityOptions: '/platform/coldchain/sensorInfo/queryFacilityName',
  queryMonitorOptions: '/platform/coldchain/sensorInfo/queryGwMac',
};

/**
 * 实时数据访问接口
 */
export const REALTIME_DATA_URLS = {
  queryRealDataChart: '/platform/coldchain/sensorHumiData/getchartsData',
  queryRealData: '/platform/coldchain/sensorHumiData/tempHumiSchedule', /*温湿度明细数据*/
  queryRealDataCount: '/platform/coldchain/sensorHumiData/tempHumiScheduleCount',
};
/**
 * 历史数据访问接口
 */
export const HISTORY_DATA_URLS = {
  queryHistoryData: '/platform/coldchain/sensorHumiData/historicalStatistics',
  queryHistoryDataCount: '/platform/coldchain/sensorHumiData/historicalStatisticsCount',
  queryTempChart: '/platform/coldchain/sensorHumiData/tempAndHumiStatistics',
  queryHumiChart: '/platform/coldchain/sensorHumiData/tempAndHumiStatistics',
  querySeneorOptions: '/platform/coldchain/sensorHumiData/statisticsNameAndCode',
};
/**
 * 维修 报废管理页面接口
 */
export const REPAIR_SCRAP_URLS = {
  queryRepairData: '/platform/coldchain/RepairData/queryRepairData',
  queryRepairDataCount: '/platform/coldchain/RepairData/countRepairData',
  insertRepairData: '/platform/coldchain/RepairData/insertRepairData',
  updateRepairData: '/platform/coldchain/RepairData/updateRepairData',
  queryScrapData: '/platform/coldchain/scrapData/queryScrapData',
  queryScrapDataCount: '/platform/coldchain/scrapData/countScrapData',
  insertScrapData: '/platform/coldchain/scrapData/insertScrapData',
  updateScrapData: '/platform/coldchain/scrapData/updateScrapData',
};
