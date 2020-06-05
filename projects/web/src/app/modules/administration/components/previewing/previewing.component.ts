import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogService} from '@nebular/theme';

import {SystemPreliminaryClinicalService} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';

@Component({
  selector: 'uea-previewing',
  templateUrl: './previewing.component.html',
  styleUrls: ['../admin.common.scss']
})
export class PreviewingComponent implements OnInit {
  templateName: any;
  listOfData: any = [];
  total = 0;
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  template: any = null;

  editDictForm: FormGroup;
  editDictionary: any = null;
  // 新增标题
  dialogTitle = '';
  userInfo: any;

  constructor(
    private dialogSvc: NbDialogService,
    private fb: FormBuilder,
    private preliminaryClinicalSvc: SystemPreliminaryClinicalService,
    private msg: NzMessageService,
    private userSvc: UserService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    console.log(this.userInfo);
  }

  ngOnInit() {
    this.searchData();
  }

  // 查询预诊模板
  searchData(page = 1) {
    if (this.loading) return;
    this.pageIndex = page;
    const params = {
      modelCode: null,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.listOfData = [];
    this.loading = true;
    this.preliminaryClinicalSvc.queryPreliminaryClinicalAndCount(params, resp => {
      this.loading = false;
      if (!resp || resp[0].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        this.msg.warning('暂时未查询到数据');
        return;
      }
      this.listOfData = resp[0].data;
      /*if (resp[0].data.length) {
        for (let i = 0; i < resp[0].data.length; i++) {
          let singleData = resp[0].data[i];
          singleData['optionArr'] = [];
          const optionsArr = singleData['options'].trim().split(",");
          console.log('改造后的数据', optionsArr);
          optionsArr.forEach((item, index) => {
            if (index % 2 === 0) {
              singleData['optionArr'].push({label: item, value: 1});
            } else {
              singleData['optionArr'].push({label: item, value: 0});
            }
          });
        }
      }*/
      /*this.listOfData.forEach(item => {
        for (let j = 0; j < resp[0].data.length; j++) {
          item['options'] = JSON.stringify(resp[0].data[j]['optionArr']);
        }
      });*/
      if (!resp || resp[1].code !== 0 || !resp[0].hasOwnProperty('data') || resp[0].data.length === 0) {
        return;
      }
      this.total = resp[1].data[0].count;
    });

  }

  // 增加修改删除
  openDialog(template, model?: any) {
    this.template = '';
    this.template = model;
    // 修改
    if (model) {
      this.editDictionary = JSON.parse(JSON.stringify(model));
      const listOfControl: any[] = [];
      if (
        this.editDictionary.hasOwnProperty('options') &&
        this.isNotBlank(this.editDictionary.options)
      ) {
        /*let optionArr = this.editDictionary.options.trim().split(',');
        let changeArr = [];
        if (optionArr.length) {
          // optionArr.unshift(optionArr.splice(1, 1)[0]);
          optionArr.forEach(item => {
            if (item === '是') {
              changeArr.unshift({label: item, value: 1});
            } else {
              changeArr.unshift({label: item, value: 0});
            }
          });
        }
        if (changeArr.length) {
          changeArr.forEach(
            (option, id) => {
              listOfControl.unshift({
                id,
                labelControl: `label${id}`,
                labelValue: option.label,
                valueControl: `value${id}`,
                valueValue: option.value
              });
            }
          );
        }*/
        JSON.parse(this.editDictionary.options.trim()).forEach(
          (option, id) => {
            listOfControl.unshift({
              id,
              labelControl: `label${id}`,
              labelValue: option.label,
              valueControl: `value${id}`,
              valueValue: option.value
            });
          }
        );
      }
      this.editDictForm = this.fb.group({
        question: [this.editDictionary.question, [Validators.required]], // 配置标题
        options: [listOfControl], // 可选项
      });
      this.editDictForm.addControl(
        'options',
        new FormControl(listOfControl)
      );
      listOfControl.forEach(control => {
        this.editDictForm.addControl(
          control.labelControl,
          new FormControl(control.labelValue, Validators.required)
        );
        this.editDictForm.addControl(
          control.valueControl,
          new FormControl(control.valueValue, Validators.required)
        );
      });
      this.dialogTitle = '修改预诊模板';

    } else {
      // 新增
      this.editDictForm = this.fb.group({
        question: [null, [Validators.required]], // 模板标题
        options: [[]] // 可选项
      });
      this.dialogTitle = '新增预诊模板';
    }
    this.dialogSvc.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe(res => {
      if (res) {
        this.searchData();
      }
    });

  }

  // 添加可选项
  addOptions(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (
      this.editDictForm.controls.options.value === null ||
      this.editDictForm.controls.options.value.length === 0
    ) {
      this.addField(e);
      this.addField(e);
    } else {
      this.addField(e);
    }
    console.log(this.editDictForm.controls);
  }

  addField(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    let listOfControl: any[] = JSON.parse(JSON.stringify(this.editDictForm.controls.options.value));
    const id = listOfControl.length > 0 ? listOfControl[listOfControl.length - 1].id + 1 : 0;
    const control = {
      id, labelControl: `label${id}`, valueControl: `value${id}`
    };
    const index = listOfControl.push(control);
    this.editDictForm.controls.options.setValue(listOfControl);
    this.editDictForm.addControl(
      listOfControl[index - 1].labelControl,
      new FormControl(null, Validators.required)
    );
    this.editDictForm.addControl(
      listOfControl[index - 1].valueControl,
      new FormControl(null, Validators.required)
    );
  }

  // 删除选项
  removeOption(option: any, e?: MouseEvent) {
    if (this.editDictForm.controls.options.value.length > 2) {
      this.removeField(option, e);
    } else {
      let listOfControl: any[] = JSON.parse(
        JSON.stringify(this.editDictForm.controls.options.value)
      );
      listOfControl.forEach(control => {
        this.removeField(control, e);
      });
    }
  }

  removeField(option: any, e?: MouseEvent) {
    e.preventDefault();
    let listOfControl: any[] = this.editDictForm.controls.options.value;
    const index = listOfControl.indexOf(option);
    listOfControl.splice(index, 1);
    this.editDictForm.controls.options.setValue(listOfControl);
    this.editDictForm.removeControl(option.labelControl);
    this.editDictForm.removeControl(option.valueControl);
  }

  getParam() {
    let param: any = {};
    param.question = this.editDictForm.controls.question.value;
    if (this.editDictForm.controls.options.value !== null && this.editDictForm.controls.options.value.length !== 0) {
      let options: any[] = [];
      this.editDictForm.controls.options.value.forEach(option => {
        options.push({
          label: this.editDictForm.controls[option.labelControl].value,
          value: this.editDictForm.controls[option.valueControl].value
        });
      });
      param.options = JSON.stringify(options);
    } else {
      param.options = '';
    }
    console.log(param);
    return param;
  }

  // 修改模板
  update(ref) {
    Object.keys(this.editDictForm.controls).forEach(i => {
      this.editDictForm.controls[i].markAsDirty();
      this.editDictForm.controls[i].updateValueAndValidity();
    });
    console.log(this.editDictForm);
    if (!this.editDictForm.controls.options.value) {
      this.msg.warning('请添加可选项');
      return;
    }
    if (this.editDictForm.valid) {
      let confOptions = this.getParam();
      console.log(confOptions);
      let params = {
        question: confOptions.question,
        options: confOptions.options,
        modelScope: 3,
        createBy: this.userInfo.userCode,
        normalRange: '正常',
        useAble: 1,
        id: this.template.id,
        createDate: null,
      };
      this.preliminaryClinicalSvc.updatePreliminaryClinical(params, resp => {
        if (resp.code === 0) {
          this.msg.info('修改模板成功');
          this.searchData();
        }
      });
    }
    ref.close();
  }

  // 新增模板
  insert(ref) {
    Object.keys(this.editDictForm.controls).forEach(i => {
      this.editDictForm.controls[i].markAsDirty();
      this.editDictForm.controls[i].updateValueAndValidity();
    });
    let confOptions = this.getParam();
    console.log(confOptions);
    if (!confOptions.options) {
      this.msg.warning('请添加可选项');
      return;
    }
    if (this.editDictForm.valid) {
      let param = {
        question: confOptions.question,
        options: confOptions.options,
        modelScope: 3,
        createBy: this.userInfo.userCode,
        normalRange: '正常',
        useAble: 1
      };
      console.log('参数', param);
      this.preliminaryClinicalSvc.addPreliminaryClinical(param, resp => {
        console.log(resp);
        if (resp.code === 0) {
          this.msg.info('新增成功');
        }
        ref.close();
        this.searchData();
      });
    }
  }

  // 修改
  changeInfo(d) {

  }

  // 表格删除模板
  openDeleteDialog(template, data) {
    this.template = data;
    this.dialogSvc.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  // 删除此条模板
  delete(ref) {
    this.preliminaryClinicalSvc.deletePreliminaryClinical(this.template.id, resp => {
      console.log(resp);
      if (resp.code === 0) {
        this.msg.info('删除成功');
        this.searchData();
      }
    });
    ref.close();
  }

  isBlank(s: any) {
    if (s === null) {
      return true;
    } else if (s === undefined) {
      return true;
    } else {
      return s.trim() === '';
    }
  }

  isNotBlank(s: any) {
    return !this.isBlank(s);
  }
}
