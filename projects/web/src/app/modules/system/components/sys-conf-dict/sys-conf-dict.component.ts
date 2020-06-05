import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { DicDataService, ApiSystemDictionaryService, FieldNameUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-sys-conf-dict',
  templateUrl: './sys-conf-dict.component.html',
  styleUrls: ['../system.common.scss']
})
export class SysConfDictComponent implements OnInit {

  loading = false;
  pageIndex = 1;
  pageSize = 10;
  listOfData: any[] = [];
  dialogTitle = '';

  dictForm: FormGroup;
  editDictForm: FormGroup;
  editDictionary: any = null;
  deleteDictionary: any = null;
  sysConfGroupOptions = [];
  private readonly sysConfKey = 'sysConfGroup';


  constructor(
    private dictService: ApiSystemDictionaryService,
    private fb: FormBuilder,
    private nbDialogService: NbDialogService,
    private messageService: NzMessageService,
    private dictSvc: DicDataService
  ) {
  }

  ngOnInit() {
    this.sysConfGroupOptions = this.dictSvc.getDicDataByKey(this.sysConfKey);
    // console.log(this.sysConfGroupOptions);
    this.searchData(true);
  }

  searchData(reset = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    // let conditions = JSON.parse(JSON.stringify(this.dictForm.value));
    let param = {
      // title:
      //   conditions.title === null
      //     ? null
      //     : conditions.title.trim() === ''
      //     ? null
      //     : conditions.title.trim(), // 配置标题
      // confCode:
      //   conditions.confCode === null
      //     ? null
      //     : conditions.confCode.trim() === ''
      //     ? null
      //     : conditions.confCode.trim(), // 配置项编码
      // confGroup:
      //   conditions.confGroup === null
      //     ? null
      //     : conditions.confGroup.trim() === ''
      //     ? null
      //     : conditions.confGroup.trim(), // 分组
      pageEntity: {
        page: this.pageIndex,
        pageSize: 1000
      }
    };

    this.loading = true;

    this.dictService.searchDataAndCount(param, resp => {
      this.loading = false;
      let searchDataList = resp[0];
      if (searchDataList && searchDataList.code === 0) {
        this.listOfData = searchDataList.data;
      } else {
        this.listOfData = [];
      }
    });
  }

  reset(reset: Boolean) {
    this.dictForm = this.fb.group({
      title: [null], // 配置标题
      confCode: [null], // 配置项编码
      confGroup: ['1'] // 分组
    });
    if (reset) {
      this.searchData(true);
    }
  }

  openDialog(template, dictionary?: any) {
    if (dictionary) {
      this.editDictionary = JSON.parse(JSON.stringify(dictionary));
      const listOfControl: any[] = [];
      if (
        this.editDictionary.hasOwnProperty('confOptions') &&
        this.isNotBlank(this.editDictionary.confOptions)
      ) {
        JSON.parse(this.editDictionary.confOptions.trim()).forEach(
          (option, id) => {
            listOfControl.push({
              id,
              labelControl: `label${id}`,
              labelValue: option.label,
              valueControl: `value${id}`,
              valueValue: option.value
            });
          }
        );
        console.log(listOfControl);
      }
      this.editDictForm = this.fb.group({
        title: [this.editDictionary.title, [Validators.required]], // 配置标题
        confName: [this.editDictionary.confName, [Validators.required]], // 配置名称
        confCode: [this.editDictionary.confCode, [Validators.required]], // 配置项编码
        confDesc: [this.editDictionary.confDesc, [Validators.required]], // 说明
        confGroup: [this.editDictionary.confGroup, [Validators.required]], // 分组
        confScope: [this.editDictionary.confScope, [Validators.required]], // 数据范围
        defaultValue: [this.editDictionary.defaultValue, [Validators.required]] // 默认值
        // confOptions: [listOfControl], // 可选项
      });
      this.editDictForm.addControl(
        'confOptions',
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
      this.dialogTitle = '修改配置词典';
    } else {
      this.editDictForm = this.fb.group({
        title: [null, [Validators.required]], // 配置标题
        confName: [null, [Validators.required]], // 配置名称
        confCode: [null], // 配置项编码
        confDesc: [null, [Validators.required]], // 说明
        confGroup: [null, [Validators.required]], // 分组
        confScope: [null, [Validators.required]], // 数据范围
        defaultValue: [null, [Validators.required]], // 默认值
        confOptions: [[]] // 可选项
      });
      this.dialogTitle = '新增配置词典';
    }
    this.nbDialogService.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe(res => {
      if (res) {
        this.searchData(true);
      }
    });
  }

  update(ref) {
    Object.keys(this.editDictForm.controls).forEach(i => {
      this.editDictForm.controls[i].markAsDirty();
      this.editDictForm.controls[i].updateValueAndValidity();
    });
    console.log(this.editDictForm);
    if (this.editDictForm.valid) {
      let param = this.getParam();
      param.id = this.editDictionary.id;
      this.dictService.updateSysConfDictionary(param, resp => {
        if (resp && resp.code === 0) {
          this.messageService.success('修改成功！', { nzDuration: 3000 });
          this.searchData(true);
          this.editDictionary = null;
          ref.close();
        } else {
          this.messageService.error('修改失败！', { nzDuration: 3000 });
        }
      });
    }
  }

  insert(ref) {
    Object.keys(this.editDictForm.controls).forEach(i => {
      this.editDictForm.controls[i].markAsDirty();
      this.editDictForm.controls[i].updateValueAndValidity();
    });
    if (this.editDictForm.valid) {
      let param = this.getParam();
      this.dictService.insertSysConfDictionary(param, resp => {
        if (resp && resp.code === 0) {
          this.messageService.success('添加成功！', { nzDuration: 3000 });
          this.searchData(true);
          ref.close();
        } else {
          this.messageService.error('添加失败！', { nzDuration: 3000 });
        }
      });
    }
  }

  getParam() {
    let param: any = {};
    param.title = this.editDictForm.controls.title.value;
    param.confName = FieldNameUtils.toHump(this.editDictForm.controls.confName.value);
    param.confCode = this.editDictForm.controls.confCode.value;
    param.confDesc = this.editDictForm.controls.confDesc.value;
    param.confGroup = this.editDictForm.controls.confGroup.value;
    param.confScope = this.editDictForm.controls.confScope.value;
    param.defaultValue = this.editDictForm.controls.defaultValue.value;
    if (this.editDictForm.controls.confOptions.value !== null && this.editDictForm.controls.confOptions.value.length !== 0) {
      let options: any[] = [];
      this.editDictForm.controls.confOptions.value.forEach(option => {
        options.push({
          label: this.editDictForm.controls[option.labelControl].value,
          value: this.editDictForm.controls[option.valueControl].value
        });
      });
      param.confOptions = JSON.stringify(options);
    } else {
      param.confOptions = '';
    }
    console.log(param);
    return param;
  }

  addOptions(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (
      this.editDictForm.controls.confOptions.value === null ||
      this.editDictForm.controls.confOptions.value.length === 0
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
    // if (this.editDictForm.controls.confOpitons.value === '') {
    //   return;
    // }
    let listOfControl: any[] = JSON.parse(
      JSON.stringify(this.editDictForm.controls.confOptions.value)
    );
    const id =
      listOfControl.length > 0
        ? listOfControl[listOfControl.length - 1].id + 1
        : 0;
    const control = {
      id,
      labelControl: `label${id}`,
      valueControl: `value${id}`
    };
    const index = listOfControl.push(control);
    this.editDictForm.controls.confOptions.setValue(listOfControl);
    this.editDictForm.addControl(
      listOfControl[index - 1].labelControl,
      new FormControl(null, Validators.required)
    );
    this.editDictForm.addControl(
      listOfControl[index - 1].valueControl,
      new FormControl(null, Validators.required)
    );
  }

  removeOption(option: any, e?: MouseEvent) {
    if (this.editDictForm.controls.confOptions.value.length > 2) {
      this.removeField(option, e);
    } else {
      let listOfControl: any[] = JSON.parse(
        JSON.stringify(this.editDictForm.controls.confOptions.value)
      );
      listOfControl.forEach(control => {
        this.removeField(control, e);
      });
    }
  }

  removeField(option: any, e?: MouseEvent) {
    e.preventDefault();
    let listOfControl: any[] = this.editDictForm.controls.confOptions.value;
    const index = listOfControl.indexOf(option);
    listOfControl.splice(index, 1);
    this.editDictForm.controls.confOptions.setValue(listOfControl);
    this.editDictForm.removeControl(option.labelControl);
    this.editDictForm.removeControl(option.valueControl);
  }

  openDeleteDialog(template, dictionary) {
    this.deleteDictionary = dictionary;
    this.nbDialogService.open(template, {
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  delete(ref) {
    this.dictService.deleteSysConfDictionary(this.deleteDictionary.confCode, resp => {
      if (resp && resp.code === 0) {
        this.messageService.success('删除成功！', { nzDuration: 3000 });
        this.searchData(true);
        this.deleteDictionary = null;
      } else {
        this.messageService.error('删除失败！', { nzDuration: 3000 });
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
