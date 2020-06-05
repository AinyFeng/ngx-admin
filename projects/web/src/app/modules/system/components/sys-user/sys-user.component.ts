import { ValidatorsUtils } from './../../../../@uea/components/form/validators-utils';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { ApiSystemUserService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-sys-user',
  templateUrl: './sys-user.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysUserComponent implements OnInit {
  userForm: FormGroup;
  editUserForm: FormGroup;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  dialogTitle = '';

  editUser: any = null;

  constructor(
    private thisApiService: ApiSystemUserService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private nbDialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.reset();
    this.searchData(true);
  }

  /*查询数据*/
  searchData(reset?: Boolean) {
    if (reset) {
      this.pageIndex = 1;
    }
    // 查询条件组装
    let conditions = JSON.parse(JSON.stringify(this.userForm.value));
    let param = {
      userName:
        conditions.userName === null
          ? null
          : conditions.userName.trim() === ''
            ? null
            : conditions.userName, // 用户名
      nickName:
        conditions.nickName === null
          ? null
          : conditions.nickName.trim() === ''
            ? null
            : conditions.nickName, // 昵称
      loginName:
        conditions.loginName === null
          ? null
          : conditions.loginName.trim() === ''
            ? null
            : conditions.loginName, // 登录名
      phone:
        conditions.phone === null
          ? null
          : conditions.phone.trim() === ''
            ? null
            : conditions.phone, // 手机号码
      accountStatus:
        conditions.accountStatus === null
          ? null
          : conditions.accountStatus.trim() === ''
            ? null
            : conditions.accountStatus, // 状态
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    // 调用apiService查询数据
    this.thisApiService.searchDataAndCount(param, resp => {
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

  reset() {
    this.userForm = this.fb.group({
      userName: [''], // 用户名
      nickName: [''], // 昵称
      loginName: [''], // 登录名
      phone: ['', [ValidatorsUtils.validatePhoneNo('phone')]], // 手机号码
      accountStatus: [''] // 状态
    });
    this.listOfData = [];
    // if (reset) {
    //   this.searchData(true);
    // }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.editUserForm.controls.checkPwd.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.editUserForm.controls.pwd.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  openDialog(template, user?: any) {
    if (user) {
      this.editUser = JSON.parse(JSON.stringify(user));
      this.editUserForm = this.fb.group({
        userName: [this.editUser.userName], // 用户名
        nickName: [this.editUser.nickName], // 昵称
        loginName: [{ value: this.editUser.loginName, disabled: true }], // 登录名
        pwd: [null, [Validators.required]], // 密码
        checkPwd: [null, [Validators.required, this.confirmationValidator]], // 检查密码
        head: [this.editUser.head], // 头像
        phone: [this.editUser.phone, [ValidatorsUtils.validatePhoneNo('phone')]], // 手机号码
        accountStatus: [this.editUser.accountStatus], // 状态
        memo: [this.editUser.memo] // 备注
      });
      this.dialogTitle = '修改用户';
    } else {
      this.editUserForm = this.fb.group({
        userName: [null, [Validators.required]], // 用户名
        nickName: [null, [Validators.required]], // 昵称
        loginName: [null, [Validators.required]], // 登录名
        pwd: [null, [Validators.required]], // 密码
        checkPwd: [null, [Validators.required, this.confirmationValidator]], // 检查密码
        head: [null, [Validators.required]], // 头像
        phone: [null, [Validators.required, ValidatorsUtils.validatePhoneNo('phone')]], // 手机号码
        accountStatus: [null, [Validators.required]], // 状态
        memo: [null] // 备注
      });
      this.dialogTitle = '新增用户';
    }
    this.nbDialogService.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  update(ref) {
    let editUserFormValue = JSON.parse(JSON.stringify(this.editUserForm.value));
    delete this.editUser.loginName;
    this.editUser.pwd = editUserFormValue.pwd === null || editUserFormValue.pwd.trim() === '' ? '' : editUserFormValue.pwd.trim();
    this.editUser.userName =
      editUserFormValue.userName === null ||
        editUserFormValue.userName.trim() === ''
        ? ''
        : editUserFormValue.userName.trim();
    this.editUser.nickName =
      editUserFormValue.nickName === null ||
        editUserFormValue.nickName.trim() === ''
        ? ''
        : editUserFormValue.nickName.trim();
    this.editUser.head =
      editUserFormValue.head === null || editUserFormValue.head.trim() === ''
        ? ''
        : editUserFormValue.head.trim();
    this.editUser.phone =
      editUserFormValue.phone === null || editUserFormValue.phone.trim() === ''
        ? ''
        : editUserFormValue.phone.trim();
    this.editUser.accountStatus =
      editUserFormValue.accountStatus === null ||
        editUserFormValue.accountStatus.trim() === ''
        ? ''
        : editUserFormValue.accountStatus.trim();
    this.editUser.memo =
      editUserFormValue.memo === null || editUserFormValue.memo.trim() === ''
        ? ''
        : editUserFormValue.memo.trim();

    this.thisApiService.updateSysUser(this.editUser, resp => {
      if (resp.code === 0 && resp.data === 1) {
        this.messageService.success('修改成功！', { nzDuration: 3000 });
      } else {
        this.messageService.error('修改失败！', { nzDuration: 3000 });
      }
      this.editUser = null;
      this.searchData();
      ref.close();
    });
  }

  delete() {
    this.messageService.warning('修改失败！', { nzDuration: 3000 });
  }

  insert(ref) {
    Object.keys(this.editUserForm.controls).forEach(i => {
      this.editUserForm.controls[i].markAsDirty();
      this.editUserForm.controls[i].updateValueAndValidity();
    });
    if (this.editUserForm.valid) {
      this.editUser = {};
      let editUserFormValue = JSON.parse(
        JSON.stringify(this.editUserForm.value)
      );
      this.editUser.pwd =
        editUserFormValue.pwd === null || editUserFormValue.pwd.trim() === ''
          ? null
          : editUserFormValue.pwd.trim();
      this.editUser.loginName =
        editUserFormValue.loginName === null ||
          editUserFormValue.loginName.trim() === ''
          ? null
          : editUserFormValue.loginName.trim();
      this.editUser.userName =
        editUserFormValue.userName === null ||
          editUserFormValue.userName.trim() === ''
          ? null
          : editUserFormValue.userName.trim();
      this.editUser.nickName =
        editUserFormValue.nickName === null ||
          editUserFormValue.nickName.trim() === ''
          ? null
          : editUserFormValue.nickName.trim();
      this.editUser.head =
        editUserFormValue.head === null || editUserFormValue.head.trim() === ''
          ? null
          : editUserFormValue.head.trim();
      this.editUser.phone =
        editUserFormValue.phone === null ||
          editUserFormValue.phone.trim() === ''
          ? null
          : editUserFormValue.phone.trim();
      this.editUser.accountStatus =
        editUserFormValue.accountStatus === null ||
          editUserFormValue.accountStatus.trim() === ''
          ? null
          : editUserFormValue.accountStatus.trim();
      this.editUser.memo =
        editUserFormValue.memo === null || editUserFormValue.memo.trim() === ''
          ? null
          : editUserFormValue.memo.trim();

      this.thisApiService.insertSysUser(this.editUser, resp => {
        if (resp.code === 0 && resp.data === 1) {
          this.messageService.success('新增成功！', { nzDuration: 3000 });
        } else {
          this.messageService.error('新增失败！', { nzDuration: 3000 });
        }
        this.editUser = null;
        this.searchData();
        ref.close();
      });
    }
  }
}
