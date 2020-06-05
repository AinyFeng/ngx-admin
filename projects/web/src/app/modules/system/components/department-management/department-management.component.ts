import {FormGroup, FormBuilder} from '@angular/forms';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '@tod/uea-auth-lib';
import {
  DicDataService,
  DepartmentInfoService,
  DepartmentInitService,
  IotInitService,
  IotFacilityQueue
} from '@tod/svs-common-lib';
import {NbDialogService} from '@nebular/theme';
import {AddDepartmentComponent} from '../dialog/add-department/add-department.component';
import {ConfirmDialogComponent} from '../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import {NzMessageService} from 'ng-zorro-antd';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';

@Component({
  selector: 'uea-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['../system.common.scss'],
  providers: [IotFacilityQueue]
})
export class DepartmentManagementComponent implements OnInit, OnDestroy {
  private subscription: Subscription[] = [];
  @ViewChild('dialog', {static: true})
  dialog;

  @ViewChild('dialogIot', {static: true})
  dialogIot;

  form: FormGroup;
  povData: any = [];
  povDataList: any = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // 当前用户登录信息
  userInfo: any;

  // 全部的部门
  departmentAll: any = [];
  // iot设备
  iotFacilities: any = [];

  /*
  * 所有的部门数据
  * */
  private allDepartmentData$ = new BehaviorSubject<any>([]);

  /*
  * iot中的与部门表相关联的设备
  * */
  private iotFacilityData$ = new BehaviorSubject<any>([]);
  // 组合的数据
  departmentData: any = [];

  // 选择的固定资产
  selectedIot: any;
  // 固定资产
  screenOptions = [];
  // 传递的数据
  updateIotInfoData: any;

  // 叫号设备类型
  facilityTypes: any;

  // 修改的iot设备
  checkOptionsOne: any;

  // 判断是新增叫号屏还是修改叫号屏
  add: boolean;


  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private departSvc: DepartmentInfoService,
    private dialogSvc: NbDialogService,
    private msg: NzMessageService,
    private departmentInitSvc: DepartmentInitService,
    private iotInitSvc: IotInitService,
    private iotFacilitySvc: IotFacilityQueue,
    private dicSvc: DicDataService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => (this.userInfo = user));
    const sub = combineLatest([this.allDepartmentData$, this.iotFacilityData$]).subscribe(([povData, iotData]) => {
      // console.log('当前部门department', povData);
      console.log('关联的iot设备', iotData);
      this.departmentData = [];
      this.departmentData = povData;
      for (let i = 0; i < this.departmentData.length; i++) {
        const department = this.departmentData[i].departmentCode;
        this.departmentData[i]['iotInfo'] = [];
        this.departmentData[i]['iotName'] = '';
        iotData.forEach(item => {
          if (item.departmentCode === department) {
            /*for (const key in item) {
              if (item.hasOwnProperty(key)) {
                if (key === 'id') {
                  this.departmentData[i]['iotId'] = item.id;
                } else {
                  this.departmentData[i][key] = item[key];
                }
              }
            }*/
            // 一个部门对应多个叫号屏(将叫号屏都加入到部门里面)
            this.departmentData[i]['iotInfo'].push(item);
            // 将叫号屏的名字都取出来
            if (this.departmentData[i]['iotName']) {
              this.departmentData[i]['iotName'] = this.departmentData[i]['iotName'] + ',' + item.facilityName;
            } else {
              this.departmentData[i]['iotName'] = item.facilityName;
            }

          }
        });
      }
      console.log('部门数据', this.departmentData);
    });
    this.subscription.push(sub);
    this.queryScreenInfo();
  }

  ngOnInit() {
    // 叫号设备类型
    this.facilityTypes = this.dicSvc.getDicDataByKey('facilityType');
    this.form = this.fb.group({
      povCode: [null],
      name: [null]
    });
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  // 固定资产中所有的叫号屏设备
  queryScreenInfo() {
    let params = {
      povCode: this.userInfo.pov,
      fixedAssetsType: '2'
    };
    this.screenOptions = [];
    console.log(params);
    this.iotFacilitySvc.queryScreenIotInfo(params, resp => {
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.screenOptions = resp.data;
      console.log('固定资产', this.screenOptions);
    });
  }

  // 查询科室数据
  search() {
    if (this.loading) return;
    // 获取iot数据
    this.queryIotFacilityInfo();
    const query = {
      belongPovCode: this.userInfo.pov,
      departmentCode: this.form.get('povCode').value,
      departmentName: this.form.get('name').value,
    };
    this.dataReset();
    this.loading = true;
    // console.log('canshu ', query);
    this.departSvc.queryDepartmentInfo(query, resp => {
      // console.log('resp', resp);
      this.loading = false;
      if (resp.code !== 0 || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.povData = resp.data;
      this.allDepartmentData$.next(this.povData);
      this.departmentInitSvc.setDepartmentData(this.povData);
    });
  }

  dataReset() {
    this.povData = [];
    this.departmentData = [];
  }

  // 查询关联的iot设备信息
  queryIotFacilityInfo() {
    const conditions = {
      povCode: this.userInfo.pov,
      facilityStatus: ['0'],
      pageEntity: {
        page: 1,
        pageSize: 50
      }
    };
    this.iotFacilities = [];
    this.iotFacilitySvc.queryIotFacilityQueue(conditions, res => {
      if (res.code !== 0 || !res.hasOwnProperty('data') || res.data.length === 0) {
        return;
      }
      this.iotFacilities = res.data;
      console.log('iot', this.iotFacilities);
      this.iotFacilityData$.next(this.iotFacilities);
    });

  }

  // 新增科室
  addDepartment() {
    this.dialogSvc.open(AddDepartmentComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        userInfo: this.userInfo,
      }
    }).onClose.subscribe(resp => {
      if (resp) {
        this.search();
      }
    });
  }

  reset() {
    this.form.reset();
    this.loading = false;
  }

  // 修改部门数据
  changeInfo(data: any) {
    this.dialogSvc.open(AddDepartmentComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        userInfo: this.userInfo,
        departmentData: this.departmentAll,
        updateData: data,
      }
    }).onClose.subscribe(resp => {
      console.log('关闭', resp);
      if (resp) {
        this.search();
      }
    });

  }

  // 删除部门数据
  deleteInfo(data: any) {
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此条科室数据?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.departSvc.deleteDepartmentInfo(data.id, resp => {
          if (resp.code === 0) {
            this.msg.info('删除成功');
            this.search();
          }
        });
        if (data.iotInfo.length) {
          let ids = [];
          data.iotInfo.forEach(item => {
            ids.push(item.id);
          });
          this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
            if (resp.code === 0) {
              this.msg.info('关联删除成功');
              this.iotFacilities = [];
              this.search();
            }
          });
        }
      }
    });
  }

  // 关联叫号屏
  /*relevanceIot(data: any) {
    this.updateIotInfoData = '';
    this.updateIotInfoData = data;
    this.dialogSvc.open(this.dialog, {
      context: '请选择叫号屏设备！',
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }*/

  // 修改叫号屏
  /*changeIotInfo(data: any) {
    this.updateIotInfoData = '';
    this.updateIotInfoData = data.iotInfo;
    this.checkOptionsOne = [];
    this.updateIotInfoData.forEach(item => {
      this.checkOptionsOne.push({label: item.facilityName, value: item.facilitySerialNumber, checked: true});
    });
    this.dialogSvc.open(this.dialogIot, {
      context: '请修改叫号屏设备！',
      closeOnBackdropClick: false,
      closeOnEsc: false
    });

  }*/

  // 管理叫号屏设备
  manageIot(data: any) {
    this.updateIotInfoData = '';
    // 修改叫号屏设备
    if (data.iotInfo.length) {
      this.updateIotInfoData = data.iotInfo;
      this.checkOptionsOne = [];
      this.add = false;
      console.log('当前设备', data.iotInfo);
      // facilityTopic
      // 固定资产数据
      console.log('固定资产', this.screenOptions);
      // fixedAssetsCode
      if (this.screenOptions.length) {
        // 筛选出是否数据异常(固定资产中的叫号屏删除了,但是关联的叫号设备没有删除)
        // 异常数据
        let abnormalData = [];
        for (let i = 0; i < this.updateIotInfoData.length; i++) {
          let belong = false;
          for (let j = 0; j < this.screenOptions.length; j++) {
            const item = this.screenOptions[j];
            if (item.fixedAssetsCode === this.updateIotInfoData[i].facilityTopic) {
              belong = true;
              break;
            }
          }
          if (!belong) {
            abnormalData.push(this.updateIotInfoData[i]);
          }
        }
        console.log('异常数据', abnormalData);
        // 数据异常存在
        if (abnormalData.length) {
          this.dialogSvc.open(ConfirmDialogComponent, {
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: false,
            context: {
              title: '叫号屏数据异常',
              content: '是否确认删除此条关联的叫号屏设备?'
            }
          }).onClose.subscribe(confirm => {
            if (confirm) {
              let ids = [];
              abnormalData.forEach(item => {
                ids.push(item.id);
              });
              this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
                if (resp && resp.code === 0) {
                  this.msg.info('叫号屏设备关联删除成功');
                  this.iotFacilities = [];
                  this.search();
                }
              });
            }
          });
        } else {
          this.checkOptionsOne = [];
          this.screenOptions.forEach(item => {
            this.checkOptionsOne.push({label: item.fixedAssetsName, value: item.fixedAssetsCode, checked: false});
          });
          if (this.checkOptionsOne.length) {
            for (const key in this.checkOptionsOne) {
              if (this.checkOptionsOne.hasOwnProperty(key)) {
                this.updateIotInfoData.forEach(item => {
                  if (item.facilityTopic === this.checkOptionsOne[key].value) {
                    this.checkOptionsOne[key].checked = true;
                  }
                });
              }
            }
          }
          this.dialogSvc.open(this.dialogIot, {
            context: '管理叫号屏设备！',
            closeOnBackdropClick: false,
            closeOnEsc: false
          });
        }
      } else {
        // 固定资产中的叫号屏全部被删除, 而关联的叫号屏依旧存在.此时数据异常,提示是否删除此关联的叫号屏数据.
        this.dialogSvc.open(ConfirmDialogComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
            title: '叫号屏数据异常',
            content: '是否确认删除此条科室关联的叫号屏设备?'
          }
        }).onClose.subscribe(confirm => {
          if (confirm) {
            let ids = [];
            data.iotInfo.forEach(item => {
              ids.push(item.id);
            });
            this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
              if (resp && resp.code === 0) {
                this.msg.info('叫号屏设备关联删除成功');
                this.iotFacilities = [];
                this.search();
              }
            });
          }
        });
      }
    } else {
      // 新增叫号屏设备
      this.add = true;
      this.updateIotInfoData = data;
      if (!this.screenOptions) {
        this.msg.warning('暂时没有叫号屏设备, 请前往固定资产新增叫号屏设备');
        return;
      }
      this.checkOptionsOne = [];
      this.screenOptions.forEach(item => {
        this.checkOptionsOne.push({label: item.fixedAssetsName, value: item.fixedAssetsCode, checked: false});
      });
      this.dialogSvc.open(this.dialogIot, {
        context: '管理叫号屏设备！',
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
    }

  }

  // 删除叫号屏
  /*deleteIotInfo(data: any) {
    console.log(data.iotId);
    this.dialogSvc.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        title: '确认删除',
        content: '是否确认删除此关联的叫号屏?'
      }
    }).onClose.subscribe(confirm => {
      if (confirm) {
        this.iotFacilitySvc.deleteIotFacilityQueue(data.iotId, resp => {
          console.log(resp);
          if (resp.code === 0) {
            this.msg.info('删除成功');
            this.iotFacilities = [];
            this.search();
          }
        });
      }
    });
  }*/

  // 保存选择固定资产
  saveVaccineConfig(ref) {
    if (!this.selectedIot) return;
    let conditions = [];
    let params = {
      povCode: this.userInfo.pov,
      departmentCode: this.updateIotInfoData.departmentCode,
      createUser: this.userInfo.userCode,
      facilityType: this.updateIotInfoData.type,
      facilityStatus: '0',
    };
    if (this.updateIotInfoData.type === '6') {
      params['facilityType'] = '2';
    }
    if (this.screenOptions.length) {
      this.screenOptions.forEach(item => {
        this.selectedIot.forEach(el => {
          let query = JSON.parse(JSON.stringify(params));
          if (el === item.fixedAssetsCode) {
            // query['facilityTopic'] = item.facilityTopic;
            // query['facilityTopic'] = item.facilitySerialCode;
            query['facilitySerialNumber'] = item.facilitySerialCode;
            query['facilityName'] = item.fixedAssetsName;
            query['facilityTopic'] = item.fixedAssetsCode;
            conditions.push(query);
          }
        });
      });
    }
    // 新增
    /*if (!this.updateIotInfoData.iotId) {
      this.iotFacilitySvc.addIotFacilityQueueBatch(conditions, res => {
        console.log('结果', res);
        if (res.code === 0) {
          this.msg.warning('关联成功');
          this.search();
        } else {
          this.msg.warning('关联失败');
        }
      });
    } else {
      // 修改
      params['id'] = this.updateIotInfoData.iotId;
      console.log('修改参数', params);
      this.iotFacilitySvc.updateIotFacilityQueue(params, res => {
        console.log(res);
        if (res.code === 0) {
          this.msg.warning('修改叫号屏成功');
          this.search();
        } else {
          this.msg.warning('修改失败');
        }
      });
    }*/
    console.log('参数', conditions);
    this.iotFacilitySvc.addIotFacilityQueueBatch(conditions, res => {
      console.log('结果', res);
      if (res.code === 0) {
        this.msg.warning('关联成功');
        this.iotFacilities = [];
        this.search();
      } else {
        this.msg.warning('关联失败');
      }
    });
    ref.close();
    this.selectedIot = [];
  }

  // 修改关联的iot
  /* saveIot(ref) {
     const deleteIot = this.checkOptionsOne.filter(item => !item.checked);
     console.log(deleteIot);
     let ids = [];
     this.updateIotInfoData.forEach(item => {
       if (deleteIot.length) {
         deleteIot.forEach(el => {
           if (el.value === item.facilitySerialNumber) {
             ids.push(item.id);
           }
         });
       }
     });
     if (ids.length) {
       console.log(ids);
       this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
         if (resp.code === 0) {
           this.msg.info('关联删除成功');
           this.iotFacilities = [];
           this.search();
         } else {
           this.msg.warning('关联删除失败');
         }
       });
     }
     ref.close();
   }*/

  // 管理叫号屏设备
  saveIot(ref) {
    if (this.loading) return;
    const addIot = this.checkOptionsOne.filter(item => item.checked);
    console.log('过滤的是选中的', addIot);
    console.log(this.add);
    console.log('updateIotInfoData', this.updateIotInfoData);
    // 新增叫号屏
    if (this.add) {
      if (!addIot.length) return;
      let conditions = [];
      let params = {
        povCode: this.userInfo.pov,
        departmentCode: this.updateIotInfoData.departmentCode,
        createUser: this.userInfo.userCode,
        facilityType: this.updateIotInfoData.type,
        facilityStatus: '0',
      };
      if (this.updateIotInfoData.type === '6') {
        params['facilityType'] = '2';
      }
      this.screenOptions.forEach(item => {
        addIot.forEach(el => {
          let query = JSON.parse(JSON.stringify(params));
          if (el.value === item.fixedAssetsCode) {
            query['facilitySerialNumber'] = item.facilitySerialCode;
            query['facilityName'] = item.fixedAssetsName;
            query['facilityTopic'] = item.fixedAssetsCode;
            conditions.push(query);
          }
        });
      });
      console.log('参数', conditions);
      this.loading = true;
      this.iotFacilitySvc.addIotFacilityQueueBatch(conditions, res => {
        console.log('结果', res);
        this.loading = false;
        if (res.code === 0) {
          this.msg.warning('关联成功');
          this.iotFacilities = [];
          this.search();
        } else {
          this.msg.warning('关联失败');
        }
      });
      ref.close();
    } else {
      // 修改叫号屏
      // 先判断是否新增,然后再判断是否修改了
      // 没有勾选中的, 则整个关联的叫号屏全部删除(this.updateIotInfoData);
      if (!addIot.length) {
        let ids = [];
        this.updateIotInfoData.forEach(item => {
          ids.push(item.id);
        });
        if (ids.length) {
          console.log(ids);
          this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
            if (resp.code === 0) {
              this.msg.info('关联删除成功');
              this.iotFacilities = [];
              this.search();
            } else {
              this.msg.warning('关联删除失败');
            }
          });
        }
        ref.close();
      } else {
        // 选择删除的叫号屏
        let deleteIot = [];
        for (let i = 0; i < this.updateIotInfoData.length; i++) {
          let belong = false;
          for (let j = 0; j < addIot.length; j++) {
            const item = addIot[j];
            if (item.value === this.updateIotInfoData[i].facilityTopic) {
              belong = true;
              break;
            }
          }
          if (!belong) {
            deleteIot.push(this.updateIotInfoData[i]);
          }
        }
        // 新增的叫号屏
        let changeIot = [];
        for (let m = 0; m < addIot.length; m++) {
          let noBelong = false;
          for (let n = 0; n < this.updateIotInfoData.length; n++) {
            const item = this.updateIotInfoData[n];
            if (item.facilityTopic === addIot[m].value) {
              noBelong = true;
              break;
            }
          }
          if (!noBelong) {
            changeIot.push(addIot[m]);
          }
        }
        console.log('新增的叫号屏', changeIot);
        // 删除
        if (deleteIot.length) {
          let ids = [];
          deleteIot.forEach(item => {
            ids.push(item.id);
          });
          if (ids.length) {
            console.log(ids);
            this.loading = true;
            this.iotFacilitySvc.deleteIotFacilityQueueBatch(ids, resp => {
              this.loading = false;
              if (resp.code === 0) {
                this.msg.info('关联删除成功');
                this.iotFacilities = [];
                this.search();
              } else {
                this.msg.warning('关联删除失败');
              }
            });
          }
        }
        // 新增
        if (changeIot.length) {
          let conditions = [];
          let params = {
            povCode: this.userInfo.pov,
            departmentCode: this.updateIotInfoData[0].departmentCode,
            createUser: this.userInfo.userCode,
            facilityType: this.updateIotInfoData[0].facilityType,
            facilityStatus: '0',
          };
          // console.log('params', params);
          this.screenOptions.forEach(item => {
            changeIot.forEach(el => {
              let query = JSON.parse(JSON.stringify(params));
              if (el.value === item.fixedAssetsCode) {
                query['facilitySerialNumber'] = item.facilitySerialCode;
                query['facilityName'] = item.fixedAssetsName;
                query['facilityTopic'] = item.fixedAssetsCode;
                conditions.push(query);
              }
            });
          });
          console.log('参数', conditions);
          this.loading = true;
          this.iotFacilitySvc.addIotFacilityQueueBatch(conditions, res => {
            console.log('结果', res);
            this.loading = false;
            if (res.code === 0) {
              this.msg.warning('关联成功');
              this.iotFacilities = [];
              this.search();
            } else {
              this.msg.warning('关联失败');
            }
          });
        }
      }
    }
    ref.close();
  }
}
