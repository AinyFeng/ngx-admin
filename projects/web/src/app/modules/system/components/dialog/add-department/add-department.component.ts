import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {PovStaffApiService, DepartmentInfoService, DicDataService, DepartmentInitService} from '@tod/svs-common-lib';
import {Router} from '@angular/router';

@Component({
  selector: 'uea-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['../../system.common.scss']
})
export class AddDepartmentComponent implements OnInit {
  // 登录用户信息
  userInfo: any;
  // 修改的数据
  updateData: any;
  // 目前查询出来的部门的数据
  departmentData: any;

  // 全部业务职能
  departTypeCodes: any = [];
  // 部门编码
  departmentCode: any;

  // 选择的业务职能
  business: any;
  // 简称
  departmentName: any;
  // 全称
  departmentAlias: any;
  memo: any;
  type = false;
  loading = false;

  @ViewChild('dialog', {static: true})
  dialog;

  constructor(
    private ref: NbDialogRef<AddDepartmentComponent>,
    private fb: FormBuilder,
    private departmentInfoSvc: DepartmentInfoService,
    private povStaffSvc: PovStaffApiService,
    private msg: NzMessageService,
    private dicSvc: DicDataService,
    private departmentInitSvc: DepartmentInitService,
    private dialogSvc: NbDialogService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // 全部的部门
    this.departmentData = this.departmentInitSvc.getDepartmentData();
    // 获取全部业务职能
    this.departTypeCodes = this.dicSvc.getDicDataByKey('departmentType');
    if (this.updateData) {
      this.departmentCode = this.updateData.departmentCode;
      this.business = this.updateData.type;
      this.type = true;
      this.departmentName = this.updateData.departmentName;
      this.departmentAlias = this.updateData.departmentAlias;
      this.memo = this.updateData.memo;
    }
  }

  // 保存科室
  saveDepartmentInfo() {
    if (this.loading) return;
    if (this.business === '') {
      this.msg.warning('请选择业务职能');
      return;
    }
    let params = {
      type: this.business,
      departmentCode: this.departmentCode,
      belongPovCode: this.userInfo.pov,
      departmentName: this.departmentName,
      departmentAlias: this.departmentAlias,
      memo: this.memo
    };
    if (!this.updateData) {
      // 如果当前pov已经存在了科室了
      if (this.departmentData.length) {
        // 去除重名问题
        for (let i = 0; i < this.departmentData.length; i++) {
          if (this.departmentData[i].departmentName === this.departmentName) {
            console.log('此科室简称重名');
            this.msg.warning('此科室简称重名,请重新输入');
            return;
          }
          if (this.departmentData[i].departmentAlias === this.departmentAlias) {
            console.log('此科室全称重名');
            this.msg.warning('此科室全称重名,请重新输入');
            return;
          }
        }
        // 正确存在的编码和存在的编码
        let rightCodes = [];
        let exitCodes = [];
        const officeCode = this.userInfo.pov + this.business;
        console.log('正确的编码', officeCode);
        // 去除不规范的数据
        this.departmentData.forEach(item => {
          if (item.departmentCode.substring(0, 11) === officeCode) {
            exitCodes.push(item);
          }
        });
        // 规范的数据存在
        if (exitCodes.length) {
          for (let i = 0; i < exitCodes.length; i++) {
            const singleDepartCode = exitCodes[i].departmentCode;
            const type = singleDepartCode.substring(singleDepartCode.length - 2, singleDepartCode.length);
            if (this.business === type.slice(0, 1)) {
              rightCodes.push(type);
            }
          }
        } else {
          if (this.business === 0) {
            this.departmentCode = this.userInfo.pov + '0' + this.business + 1;
          } else {
            this.departmentCode = this.userInfo.pov + this.business + 1;
            console.log('科室1', this.departmentCode);
          }
        }
        console.log('rightCodes', rightCodes);
        if (rightCodes.length) {
          if (this.business === '0') {
            this.departmentCode = this.userInfo.pov + 0 + (Math.max(...rightCodes) + 1);
          } else {
            this.departmentCode = this.userInfo.pov + (Math.max(...rightCodes) + 1);
          }
          console.log(this.departmentCode);
        }
      } else {
        if (this.business === 0) {
          this.departmentCode = this.userInfo.pov + '0' + this.business + 1;
        } else {
          this.departmentCode = this.userInfo.pov + this.business + 1;
        }

      }
      params['departmentCode'] = this.departmentCode;
      console.log('参数', params);
      // return;
      this.loading = true;
      this.departmentInfoSvc.addDepartmentInfo(params, resp => {
        console.log('结果', resp);
        this.loading = false;
        if (resp && resp.code === 0) {
          //  添加接种台时要提示去配置疫苗,否则无法进行叫号!
          if (this.business === '1') {
            this.msg.success('新增成功');
            this.dialogSvc.open(this.dialog, {
              context: '是否现在去配置科室的可接种疫苗?',
              closeOnBackdropClick: false,
              closeOnEsc: false
            });
            // this.msg.info('新增成功,新增接种台之后要去配置可接种疫苗,否则无法进行接种叫号');
          } else {
            this.msg.success('新增成功');
            this.ref.close(true);
          }
        }
      });
    } else {
      for (let i = 0; i < this.departmentData.length; i++) {
        if (this.departmentData[i].departmentCode !== this.updateData.departmentCode) {
          if (this.departmentData[i].departmentName === this.departmentName) {
            this.msg.warning('此科室简称重名,请重新输入');
            return;
          }
          if (this.departmentData[i].departmentAlias === this.departmentAlias) {
            this.msg.warning('此科室全称重名,请重新输入');
            return;
          }
        }
      }
      params['departmentCode'] = this.departmentCode;
      params['id'] = this.updateData.id;
      this.loading = true;
      this.departmentInfoSvc.updateDepartmentInfo(params, resp => {
        console.log('结果', resp);
        this.loading = false;
        if (resp && resp.code === 0) {
          this.msg.info('修改成功');
          this.ref.close(true);
        }
      });
    }
  }

  // 关闭
  onClose() {
    this.ref.close();
  }

  // 关闭二次弹框 - 稍后配置科室配置可接种疫苗
  close(ref) {
    // 关闭二次弹框
    ref.close();
    // 关闭首次弹框(已经成功的新增了科室)
    this.ref.close(true);
  }

  // 现在去配置科室配置可接种疫苗, 跳转到科室配置疫苗管理界面
  saveManage(ref) {
    this.router.navigateByUrl('modules/admin/vacDepartmentDeploy');
    ref.close();
    this.ref.close(true);
  }

}
