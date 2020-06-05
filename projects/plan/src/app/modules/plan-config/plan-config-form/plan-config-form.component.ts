import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { PlanConfigService } from '../../services/plan-config.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'uea-plan-config-form',
  templateUrl: './plan-config-form.component.html',
  styleUrls: ['./plan-config-form.component.scss']
})
export class PlanConfigFormComponent implements OnInit {
  @Input()
  tabIndex: number;

  @Output()
  readonly tabIndexChange = new EventEmitter();

  _data: any = {};
  @Input()
  set data(value: any) {
    console.log('value', value);
    if (value) {
      this._data = value;
      this.isUpdate = true;
      this.resetSaveForm();
    } else {
      this.isUpdate = false;
      this.resetSaveForm();
    }
  }

  get data() {
    return this._data;
  }

  saveForm: FormGroup;

  isUpdate: boolean = false;

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    public planConfigService: PlanConfigService) {
  }

  ngOnInit() {
    this.resetSaveForm();
  }

  save(): void {
    // tslint:disable-next-line:forin
    for (const i in this.saveForm.controls) {
      this.saveForm.controls[i].markAsDirty();
      this.saveForm.controls[i].updateValueAndValidity();
    }
    if (!this.saveForm.valid) {
      return;
    }
    if (this.isUpdate) {
      this.planConfigService.updatePlanConfig(this.saveForm.value, resp => {
        if (resp['code'] === 0 && resp['data']) {
          this.message.success('修改成功！');
          this.isUpdate = false;
          this.back();
        } else {
          this.message.error('修改失败！');
        }
      });
    } else {
      this.planConfigService.savePlanConfig(this.saveForm.value, resp => {
        if (resp['code'] === 0 && resp['data']) {
          this.message.success('保存成功！');
          this.back();
        } else {
          this.message.error('保存失败！');
        }
      });
    }
  }

  resetSaveForm() {
    if (this.isUpdate) {
      this.saveForm = this.fb.group({
        vaccineSubclassCode: [this.data['vaccineSubclassCode'], [Validators.required]],
        vaccineSubclassName: [this.data['vaccineSubclassName'], [Validators.required]],
        spec: [this.data['spec'], [Validators.required]],
        dosage: [this.data['dosage'], [Validators.required]],
        lossFactor: [this.data['lossFactor'], [Validators.required]],
        type: [this.data['type'], [Validators.required]],
        memo: [this.data.hasOwnProperty('memo') ? this.data['memo'] : null],
        updateBy: [this.planConfigService.userInfo['userCode']],
        planConfigCode: [this.data['planConfigCode']],
      });
    } else {
      this.saveForm = this.fb.group({
        vaccineSubclassCode: [null, [Validators.required]],
        vaccineSubclassName: [null, [Validators.required]],
        spec: [null, [Validators.required]],
        dosage: [null, [Validators.required]],
        lossFactor: [null, [Validators.required]],
        type: [null, [Validators.required]],
        memo: [null],

        createBy: [this.planConfigService.userInfo['userCode']],
        updateBy: [this.planConfigService.userInfo['userCode']],
      });
    }
  }

  back() {
    this.tabIndexChange.emit(0);
  }
}
