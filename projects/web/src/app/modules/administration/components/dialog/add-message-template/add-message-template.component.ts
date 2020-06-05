import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DateUtils } from '@tod/svs-common-lib';
import { NzMessageService } from 'ng-zorro-antd';
import {ApiSystemMessageInfoService, SmsModelDicInitService} from '@tod/svs-common-lib';
@Component({
  selector: 'uea-add-message-template',
  templateUrl: './add-message-template.component.html',
  styleUrls: ['../../admin.common.scss']
})
export class AddMessageTemplateComponent implements OnInit {

  template: any;
  // 模板内容
  templateContent = {
    content: ''
  };
  // 模板预览
  templatePreview = {
    content: ''
  };
  // 模板名称
  templateName: string;
  povInfo: any;
  loading = false;

  // 短信模板参数
  /*customParam = [
    { label: '家长姓名', value: 'parentName' },
    { label: '接种日期', value: 'vaccinateTime' },
    { label: '补充说明', value: 'memo' },
    { label: '门诊工作时间', value: 'workTime' },
    { label: '儿童姓名', value: 'childName' },
    { label: '接种疫苗列表', value: 'vaccList' },
    { label: '门诊简称', value: 'name' },
    { label: '门诊地址', value: 'registerAddress' },
    { label: '门诊电话', value: 'telephone' },
    { label: '自定义日期', value: 'customDate' },
  ];*/
  customParam: any;

  constructor(
    private ref: NbDialogRef<AddMessageTemplateComponent>,
    private msg: NzMessageService,
    private messageTempSvc: ApiSystemMessageInfoService,
    private smsTemplateDicSvc: SmsModelDicInitService
  ) {
    this.customParam = this.smsTemplateDicSvc.getSmsModelDic();
    console.log('模板', this.customParam);
  }

  ngOnInit() {
    if (this.template) {
      this.templateName = this.template.templateName;
      this.templateContent.content = this.template.templateContent;
      this.addSmsParam();
    }
    console.log(this.povInfo);
  }

  onClose() {
    this.ref.close();
  }

  // 输入名称
  changeName() {
    // this.templateName = this.templateName.trim();
  }

  // 保存
  onSubmit() {
    console.log(this.templateName);
    if (this.loading) return;
    if (!this.templateName || !this.templateContent.content) {
      this.msg.warning('请正确填写表单');
      return;
    }
    let query = {
      templateName: this.templateName,
      templateContent: this.templateContent.content,
      dataTime: DateUtils.getFormatDateTime(new Date()),
      operating: this.template ? '1' : '0',
      povCode: this.povInfo.povCode,
    };
    console.log(query);
    this.loading = true;
    if (!this.template) {
      this.messageTempSvc.insertMessageTemplate(query, resp => {
        this.loading = false;
        console.log(resp);
        if (resp.code === 0) {
          this.msg.warning('添加成功');
          this.ref.close();
        }
      });
    } else {
      query['id'] = this.template.id;
      this.messageTempSvc.updateMessageTemp(query, resp => {
        this.loading = false;
        console.log(resp);
        if (resp.code === 0) {
          this.msg.warning('修改成功');
          this.ref.close();
        }
      });
    }

  }

  // 模块框改变内容
  changeContent() {
    // this.templateContent.content = this.templateContent.content.trim();
    this.addSmsParam();
  }

  // 添加短信参数
  /*addParam(params = { label: '', value: '' }) {
    if (params.label) {
      this.templateContent.content += '<' + params.label + '>';
    }
    this.templatePreview.content = this.templateContent.content;
    for (let i = 0; i < this.customParam.length; i++) {
      const reg = '<' + this.customParam[i].label + '>';
      let msg = '';
      if (this.templatePreview.content.indexOf(reg) !== -1) {
        switch (this.customParam[i].value) {
          case 'childName':
            msg = 'XX宝宝';
            break;
          case 'parentName':
            msg = 'XX宝宝妈妈';
            break;
          case 'name':
            msg = this.povInfo.name;
            break;
          case 'workTime':
            msg = this.povInfo.workTime;
            break;
          case 'telephone':
            msg = this.povInfo.telephone;
            break;
          case 'registerAddress':
            msg = this.povInfo.registerAddress;
            break;
          case 'customDate':
            msg = DateUtils.formatToDate(new Date());
            break;
          case 'vaccList':
            msg = '百白破疫苗';
            break;
        }
        if (msg) {
          this.templatePreview.content = this.templatePreview.content.replace(new RegExp(reg, 'gm'), msg);
        }
      }
    }
  }*/
  addSmsParam(params = {tempDictValue: '', tempDictKey: ''}) {
    if (params.tempDictValue) {
      this.templateContent.content += params.tempDictValue;
    }
    this.templatePreview.content = this.templateContent.content;
    for (let i = 0; i < this.customParam.length; i++) {
      const reg = this.customParam[i].tempDictValue;
      let msg = '';
      if (this.templatePreview.content.indexOf(reg) !== -1) {
        switch (this.customParam[i].tempDictKey) {
          case 'CHILDNAME':
            msg = this.customParam[i].tempDictValueShow;
            break;
          case 'PARENTNAME':
            msg = this.customParam[i].tempDictValueShow;
            break;
          case 'OUTPATIENTABBREVIATION':
            msg = this.povInfo.name;
            break;
          case 'OUTPIENTWORKTIME':
            msg = this.povInfo.workTime;
            break;
          case 'OUTPATIENPHONE':
            msg = this.povInfo.telephone;
            break;
          case 'OUTPATIENTADDRESS':
            msg = this.povInfo.registerAddress;
            break;
          case 'CUSTOMDATE':
            msg = this.customParam[i].tempDictValueShow;
            break;
          case 'VACCINATIONLIST':
            msg = this.customParam[i].tempDictValueShow;
            break;
        }
        if (msg) {
          this.templatePreview.content = this.templatePreview.content.replace(new RegExp(reg, 'gm'), msg);
        }
      }
    }
  }

}
