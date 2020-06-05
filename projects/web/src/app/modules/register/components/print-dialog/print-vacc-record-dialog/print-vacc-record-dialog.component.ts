import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import {
  INOCULATION_TYPE, PAGE_SIZE, ProfileDataService, LodopPrintService,
  VaccRecordTransformService, DateUtils,
  ApiAdminDailyManagementService
} from '@tod/svs-common-lib';
import { ConfigService } from '@ngx-config/core';
import {UserService} from '../../../../../../../../uea-auth-lib/src/core/user.service';

@Component({
  selector: 'uea-print-vacc-record-dialog',
  templateUrl: './print-vacc-record-dialog.component.html',
  styleUrls: ['./print-vacc-record-dialog.component.scss']
})
export class PrintVaccRecordDialogComponent implements OnInit {
  // 打印接种记录需要的数据
  vaccinateRecordData = {
    historyRecordData: [], // 此受种人的所有接种记录数据
    vaccCertificateType: INOCULATION_TYPE, // 接种本的类型
    pageTitles: PAGE_SIZE, // 接种本上的页码
    vaccRecordData: [], // 第一步选择传递到下一步的数据
    prePage: true, // 是否显示上一步
    showNextStep: false, // 是否显示下一步
    allTitle: [], // 当前所选模板的所有页码
    currentTab: '' // 当前的tab
  };
  // 额外设置的内容
  settings = {
    startLine: 1,
    marginTop: 0,
    marginLeft: 0
  };
  // 医生是否打印
  doctorNames = [{ label: '不打印', value: 0 }, { label: '打印', value: 1 }];
  doctorName = 1;
  // 选择打印模板对应的数据
  recordModeData: any;
  // 打印模板背景
  ahModeImg: any;
  // 打印当前模板的页码
  currentPage: any;
  // 最终选择打印的数据
  printRecord: any[] = [];
  // 打印机加载错误
  error: boolean;
  // 医生签字图片
  doctorSign: any;
  // 选择打印的背景图片
  images: any = {};
  // 默认的证件类型选择
  chooseType = 'ahNation';

  // 受种人信息
  profile: any;

  userInfo: any;
  loading = false;

  constructor(
    private ref: NbDialogRef<PrintVaccRecordDialogComponent>,
    private profileDataSvc: ProfileDataService,
    public lodopPrintSvc: LodopPrintService,
    private msg: NzMessageService,
    private transformSvc: VaccRecordTransformService,
    private configSvc: ConfigService,
    private adminSvc: ApiAdminDailyManagementService,
    private userSvc: UserService
  ) {
    // 获取接种记录数据(在登记台中的查询接种记录存储到service里的,只查看接种记录是否有效vaccinate_status_code  0 -有效, 10 -无效)
    /* this.profileDataSvc.getVaccinatedRecords().subscribe(vaccinatedRecords => {
       if (vaccinatedRecords) {
         console.log('service中的接种记录', vaccinatedRecords);
         let historyRecord = [];
         vaccinatedRecords.forEach(record => {
           if (record['vaccinateStatusCode'] === '0') {
             historyRecord.push(record);
           }
         });
         this.vaccinateRecordData.historyRecordData = historyRecord;
         console.log('获取接种记录数据', this.vaccinateRecordData.historyRecordData);
       }
     });*/
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.profileDataSvc.getProfileData().subscribe(profile => {
      if (profile) {
        this.profile = profile;
      }
    });
    // 加载打印机
    this.lodopPrintSvc.getLodopStatus().subscribe(status => {
      this.error = status;
    });
    this.recordModeData = this.configSvc.getSettings('vaccinateRecordTemplate');
    this.ahModeImg = this.configSvc.getSettings('images');
  }

  ngOnInit(): void {
    // 获取接种记录
    this.getVacRecordInfo();
  }

  // 获取受种人的接种记录(只查询在册的接种记录和接种完成的)日常管理中默认查询的就是接种完成的记录
  getVacRecordInfo() {
    if (!this.profile) return;
    if (this.loading) return;
    const query = {
      managePovCode: this.userInfo.pov,
      profileCode: this.profile.profileCode,
      vaccinateStatusCode: '0', // 在册状态(也就是有效期)
      pageEntity: {
        page: 1,
        pageSize: 200,
        sortBy: ['vaccinateTime,desc']
      }
    };
    // console.log('接种记录参数', query);
    this.vaccinateRecordData.historyRecordData = [];
    this.loading = true;
    this.adminSvc.queryVacRecord(query, resp => {
      this.loading = false;
      console.log('接种记录====', resp);
      if (resp && resp.code === 0 && resp.hasOwnProperty('data') && resp.data.length !== 0) {
        this.vaccinateRecordData.historyRecordData = resp.data;
        this.vaccinateRecordData.historyRecordData.forEach(item => {
          item['vaccineBroadHeadingCode'] = item.vaccineSubclassCode.substr(0, 2);
        });
        console.log('调接口获取打印接种记录====', this.vaccinateRecordData.historyRecordData);
      } else {
        this.msg.warning('暂时未查询到相关数据');
        return;
      }
    });
  }

  // 选择打印的模板
  savePrintModel(model: string) {
    // console.log('选择的模板', model);
    let recordData = this.recordModeData[model];
    this.nextStepRecord(recordData);
    Object.assign(this.images, this.ahModeImg[model]);
  }

  // 显示下一步按钮
  showStep(event) {
    this.vaccinateRecordData.showNextStep = event;
  }

  // 下一步
  nextStep() {
    // 设置医生
    this.settings['doctorName'] = this.doctorName;
    // 当前所选模板的所有页码
    this.vaccinateRecordData.allTitle = [
      ...this.vaccinateRecordData.pageTitles[this.chooseType]
    ];
    console.log('当前所选模板的所有页码', this.vaccinateRecordData.allTitle);
    let recordData = this.recordModeData[this.chooseType];
    console.log('位于模板中的数据', recordData);
    this.nextStepRecord(recordData);
    Object.assign(this.images, this.ahModeImg[this.chooseType]);
    this.vaccinateRecordData.prePage = false;
    this.msg.info('打印设置保存成功');
  }

  // 下一步筛选的数据
  nextStepRecord(data: any) {
    this.vaccinateRecordData.vaccRecordData = [];
    let blankPage = []; // 空白页的数据
    let tempRecord = [];
    let recordsArr = []; // 存放上一页中选中的数据
    let historyRecordData = JSON.parse(
      JSON.stringify(this.vaccinateRecordData.historyRecordData)
    );
    let order = 50;
    for (let j = 0; j < historyRecordData.length; j++) {
      const item = historyRecordData[j];
      if (item.checked) {
        let notEqualArr = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            recordsArr.push(...data[key]);
            // 得到接种本上存在的数据
            for (let i = 0; i < data[key].length; i++) {
              if (
                data[key][i].vaccineSubclassCodeArr.indexOf(
                  item.vaccineSubclassCode
                ) > -1 &&
                data[key][i].vaccinateInjectNumber ===
                item.vaccinateInjectNumber
              ) {
                item['sort'] = data[key][i].sort;
                tempRecord.push({ id: key, data: item });
              }
            }
          }
        }
        // 判断接种本上面没有的数据,但接种记录上面有的数据
        for (let k = 0; k < recordsArr.length; k++) {
          if (recordsArr[k].vaccineSubclassCodeArr.indexOf(item.vaccineSubclassCode) < 0) {
            notEqualArr.push(item);
          }
          // 接种本上面有的数据,但是剂次不相同,这个时候就要打印在空白页(接种本上的剂次不同,但包含相同的小类)
          if (recordsArr[k].vaccineSubclassCodeArr.indexOf(item.vaccineSubclassCode) > -1 && recordsArr[k].vaccinateInjectNumber !== item.vaccinateInjectNumber) {
            notEqualArr.push(item);
          }
        }
        if (notEqualArr.length === recordsArr.length) {
          item['sort'] = order++;
          blankPage.push({ id: 'empty', data: item });
        }
      }
    }
    if (tempRecord.length) {
      this.vaccinateRecordData.vaccRecordData = this.transFormData(tempRecord);
    }
    if (blankPage.length) {
      this.vaccinateRecordData.vaccRecordData = [
        ...this.transFormData(tempRecord),
        ...this.transFormData(blankPage)
      ];
    }
    console.log('下一步的数据', this.vaccinateRecordData.vaccRecordData);
  }

  // 合并相同id的对象方法{id:"page1",data:{}]
  transFormData(dataArr: any) {
    let orgUserList = [];
    let arrData = JSON.parse(JSON.stringify(dataArr)); // 数据深拷贝
    arrData.forEach((item, index) => {
      if (!item.del) {
        let obj = {
          id: item.id,
          data: [item.data],
          index: item.id !== 'empty' ? Number(item.id.substr(4, item.id.length)) : 100 // 排序,空白页默认数值为100
        };
        // 设置个参数记录数据是否已经添加
        item.del = true;
        for (let i = index + 1; i < arrData.length; i++) {
          if (arrData[i].id === item.id) {
            obj.data.push(arrData[i].data);
            arrData[i].del = true; // 数据添加后设置为true
          }
        }
        orgUserList.push(obj); // 把处理好的对象添加到新数组
      }
    });
    // 升序排列
    orgUserList = orgUserList.sort((a, b) => a['index'] - b['index']);
    return orgUserList;
  }

  // 上一步
  preStep() {
    this.vaccinateRecordData.prePage = true;
    this.vaccinateRecordData.showNextStep = this.vaccinateRecordData.historyRecordData.some(
      item => item.checked === true
    );
    this.doctorName = 1;
    this.settings['doctorName'] = 1;
    this.settings['startLine'] = 1;
    this.settings['marginTop'] = 0;
    this.settings['marginLeft'] = 0;
  }

  // 获取最终打印的参数
  getPrintRecord(ev) {
    this.printRecord = [];
    this.currentPage = '';
    this.printRecord = ev.printRecord;
    this.currentPage = ev.currentPage;
  }

  // 保存设置
  saveSetting() {
    this.settings['doctorName'] = this.doctorName;
    this.msg.info('打印设置保存成功');
  }

  // 打印
  print(preview: boolean) {
    if (!this.printRecord.length) {
      this.msg.warning('请选择需要打印的记录');
      return;
    } else {
      let printData = [];
      for (let i = 0; i < this.printRecord.length; i++) {
        // 单条接种记录
        const singleRecord = { ...this.printRecord[i] };
        // 将需要打印的数据进行处理接种记录里面的code转换为名称
        singleRecord.vaccinateTime = DateUtils.formatToDate(
          this.printRecord[i].vaccinateTime
        );
        // 有效期日期的转换
        if (singleRecord.loseEfficacyDate) {
          singleRecord.loseEfficacyDate = DateUtils.formatToDate(this.printRecord[i].loseEfficacyDate);
        }
        this.transformSvc
          .transformPovName(this.printRecord[i].actualVaccinatePovCode)
          .subscribe(resp => {
            if (resp) {
              singleRecord.actualVaccinatePovCode = resp;
            }
          });
        singleRecord.vaccineManufactureCode = this.transformSvc.transformManufacture(
          this.printRecord[i].vaccineManufactureCode
        );
        singleRecord['part'] = VaccRecordTransformService.transformPart(
          this.printRecord[i].vaccinatePart
        );
        if (this.printRecord[i].hasOwnProperty('vaccineBroadHeadingCode')) {
          singleRecord[
            'vaccineBroadHeadingName'
          ] = this.transformSvc.transformVaccinateName(
            this.printRecord[i].vaccineBroadHeadingCode
          );
        }
        printData.push(singleRecord);
      }
      console.log(this.settings);
      console.log('打印的数据', printData);
      this.lodopPrintSvc.setPrintVaccRecord(
        this.chooseType,
        this.currentPage,
        printData,
        this.images,
        this.settings
      );
      this.lodopPrintSvc.printRecord(preview);
    }
  }

  /**
   * 关闭提醒
   */
  closeAlert() {
    if (this.error) {
      this.error = false;
    }
  }

  onClose() {
    this.vaccinateRecordData.historyRecordData.forEach(
      item => (item.checked = false)
    );
    this.ref.close();
  }
}
