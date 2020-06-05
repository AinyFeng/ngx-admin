import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import {NbDialogService} from '@nebular/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {DeviceTypeEditComponent} from '../dialog/device-type-edit/device-type-edit.component';
import {DevicetypeService } from '@tod/svs-common-lib';




@Component({
  selector: 'uea-device-type-manage',
  templateUrl: './device-type-manage.component.html',
  styleUrls: ['../admin.common.scss'],
  providers: [DevicetypeService]
})
export class DeviceTypeManageComponent implements OnInit {
  listOfData = [];
  searchTypeForm: FormGroup;
  loading = false;
  userInfo: any;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // 需要删除的数据
  deviceTypeInfo: any;
  constructor(
    private user: UserService,
    private fb: FormBuilder,
    private deviceService: DevicetypeService,
    private dialogService: NbDialogService,
    private msg: NzMessageService
  ) {
    this.user.getUserInfoByType().subscribe(resp => {
      this.userInfo = resp;
      console.log('用户信息====', this.userInfo, resp);
    });
  }

  ngOnInit() {
    this.searchTypeForm = this.fb.group({
      typeNumber: [null],
      brand: [null], // 品牌
      model: [null] // 类型
    });
    this.searchData();
  }
  // 查询
  searchData(page = 1) {
    this.pageIndex = page;
    this.loading = true;
    const params = {
      typeNumber: this.searchTypeForm.value.typeNumber,
      brand: this.searchTypeForm.value.brand,
      model: this.searchTypeForm.value.model,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    console.log('参数', params);
    this.deviceService.getDeviceType(params, resp => {
      console.log('resp===', resp);
      this.loading = false;
      let searchDataList = resp[0];
      let searchDataCount = resp[1];
      // 解析表格数据
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
      // 解析count数据
      if (searchDataCount && searchDataCount.code === 0) {
        this.total = searchDataCount.data[0].count;
      } else {
        this.total = 0;
      }
    });
  }
  // 重置
  reset() {
    this.searchTypeForm.reset();
    this.loading = false;
  }
  // 弹出确认框
  openDeleteDialog(template, data) {
    this.deviceTypeInfo = data;
    console.log('需要删除的数据====',  this.deviceTypeInfo);
    this.dialogService.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  // 编辑设备
  editDeviceType(data: any) {
    this.dialogService.open(DeviceTypeEditComponent, {
      context: {
        deviceTypeInfo: data
      },
      hasBackdrop: true,
      closeOnBackdropClick: false
    }).onClose.subscribe((result) => {
      if (result) {
        this.searchData(this.pageIndex);
      }
    });
  }
  // 删除
  delete(ref) {
    const params = {
      id: this.deviceTypeInfo.id
    };
    this.deviceService.delete(this.deviceTypeInfo.id, resp => {
      console.log('删除params====', params, resp);
      if (resp && resp.code === 0) {
        this.msg.success('删除成功！', { nzDuration: 3000 });
        this.searchData(this.pageIndex);
      } else {
        this.msg.error('删除失败！', { nzDuration: 3000 });
      }
    });
    ref.close();
  }
}
