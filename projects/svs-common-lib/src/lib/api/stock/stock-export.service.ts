import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { STOCK_EXPORT_URLS,STOCK_URLS} from '../url-params.const';

@Injectable()
export class StockExportService {
  constructor(private api: ApiService) {}
  /**
   * 出入库明细导出
   * @param workingDayJson
   * @param param2
   */
  exportChangeRecords(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.exportChangeRecords, param, options).subscribe(result => func(result));
  }

  /**
   * 出入库记录汇总导出
   * @param workingDayJson
   * @param param
   */
  excelInventoryDetail(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelInventoryDetail, param, options).subscribe(result => func(result));
  }

  /**
   * 档案查询导出
   * @param workingDayJson
   * @param param2
   */
  profileExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.profileExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 接种记录导出
   * @param workingDayJson
   * @param param2
   */
  vaccinateRecordExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.vaccinateRecordExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 应种统计导出
   * @param workingDayJson
   * @param param2
   */
  queryVaccExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.queryVaccExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 接种合格率导出
   * @param workingDayJson
   * @param param2
   */
  vaccineRateExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.vaccineRateExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 批量接种导出
   * @param workingDayJson
   * @param param2
   */
  batchVaccinateRecordExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.batchVaccinateRecordExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 逾期未种统计导出
   * @param workingDayJson
   * @param param2
   */
  queryOverDueExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.queryOverDueExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 疫苗库存导出
   * @param workingDayJson
   * @param param2
   */
  inventoryLevelExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.inventoryLevelExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 在册变更查询
   * @param workingDayJson
   * @param param2
   */
  excelProfilestatuschange(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelProfilestatuschange, param, options).subscribe(result => func(result));
  }

  /**
   * 预诊记录管理
   * @param workingDayJson
   * @param param2
   */
  excelPreDiagnosisRecord(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelPreDiagnosisRecord, param, options).subscribe(result => func(result));
  }

  /**
   * 短信模板管理
   * @param workingDayJson
   * @param param2
   */
  excelSmsRecord(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelSmsRecord, param, options).subscribe(result => func(result));
  }

  /**
   * 预约记录查询
   * @param workingDayJson
   * @param param2
   */
  excelReservationRecord(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelReservationRecord, param, options).subscribe(result => func(result));
  }

  /**
   * 上传失败档案查询
   * @param workingDayJson
   * @param param2
   */
  excelProfileUploadFailed(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelProfileUploadFailed, param, options).subscribe(result => func(result));
  }

  /**
   * 接种日志导出
   * @param workingDayJson
   * @param param2
   */
  inoculateLogExport(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.inoculateLogExport, param, options).subscribe(result => func(result));
  }

  /**
   * 日报Excel导出数据
   * @param workingDayJson
   * @param param2
   */
  dailyExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.dailyExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 月报Excel导出数据
   * @param workingDayJson
   * @param param2
   */
  monthlyExcel(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.monthlyExcel, param, options).subscribe(result => func(result));
  }

  /**
   * 重卡查询报表导出
   * @param workingDayJson
   * @param param2
   */
  excelDuplicatedProfile(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelDuplicatedProfile, param, options).subscribe(result => func(result));
  }
  /**
   * 固定资产导出
   * @param workingDayJson
   * @param param2
   */
  excelFixedAssets(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelFixedAssets, param, options).subscribe(result => func(result));
  }
  /**
   * 库存盘点导出
   * @param workingDayJson
   * @param param2
   */
  excelStockInventory(param, func: Function) {debugger
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_URLS.exportInExcel, param, options).subscribe(result => func(result));
  }
  /**
   * 库存盘点记录导出
   * @param workingDayJson
   * @param param2
   */
  excelStockInventoryRecord(param, func: Function) {
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_EXPORT_URLS.excelStockInventoryRecord, param, options).subscribe(result => func(result));
  }

  /**
   * 平台入库数据导出
   * @param param
   * @param func
   */
  excelStockCityOutIn(param, func: Function){
    const options = {
      responseType: 'blob'
    };
    this.api.postForDownload(STOCK_URLS.exportInExcel, param, options).subscribe(result => func(result));
  }


}
