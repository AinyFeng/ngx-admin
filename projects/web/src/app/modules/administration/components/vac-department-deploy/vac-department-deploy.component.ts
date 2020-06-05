import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '@tod/uea-auth-lib';
import {NbDialogService} from '@nebular/theme';
import {
  DepartmentConfigService,
  DepartmentInitService,
  VaccBroadHeadingDataService,
  VaccDepartmentManageService,
  VaccineSubclassInitService
} from '@tod/svs-common-lib';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'uea-vac-department-deploy',
  templateUrl: './vac-department-deploy.component.html',
  styleUrls: ['../admin.common.scss']
})
export class VacDepartmentDeployComponent implements OnInit {
  form: FormGroup;

  // 全部的接种科室
  registerDeskOption = [];
  // 疫苗小类名称
  vacSubClassData = [];
  // 疫苗大类名称
  vacBroadHeadingData = [];
  // 登录用户信息
  userInfo: any;
  // 使用已有配置的科室选项
  departmentOption: any = [];

  @ViewChild('dialog', {static: true})
  dialog;

  // 选中的需要使用此科室疫苗的配置的科室
  selectedDepartmentCode: any;
  // 传来选择的节点
  selectTags: any;

  // 子组件传来选择的科室
  section: any;

  // 监听的数据
  watchData: any = [];

  // 构造树组织数据
  treeData: any;

  constructor(
    private fb: FormBuilder,
    private departmentInitSvc: DepartmentInitService,
    private vacSubClassSvc: VaccineSubclassInitService,
    private vacBroadHeadingSvc: VaccBroadHeadingDataService,
    private userSvc: UserService,
    private dialogSvc: NbDialogService,
    private departVacConfigSvc: DepartmentConfigService,
    private vacDepartManageSvc: VaccDepartmentManageService,
    private msg: NzMessageService
  ) {
    this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    // 获取接种科室
    this.registerDeskOption = this.departmentInitSvc.getDepartmentData('1');
  }

  ngOnInit() {
    // 获取疫苗小类
    this.vacSubClassData = this.vacSubClassSvc.getVaccineSubClassData();
    // 获取疫苗大类
    this.vacBroadHeadingData = this.vacBroadHeadingSvc.getVaccBoradHeadingData();
    this.vacBroadHeadingData = [...this.process(this.vacBroadHeadingData)];
    // 添加全选
    for (let i = 0; i < this.vacBroadHeadingData.length; i++) {
      const broadHeadingData = this.vacBroadHeadingData[i];
      const children = [];
      broadHeadingData['title'] = broadHeadingData['broadHeadingFullName'];
      broadHeadingData['key'] = broadHeadingData['broadHeadingCode'];
      const broadHeadingCode = broadHeadingData['broadHeadingCode'];
      for (let j = 0; j < this.vacSubClassData.length; j++) {
        const vsc = this.vacSubClassData[j];
        if (vsc.value.substr(0, 2) !== broadHeadingCode) continue;
        vsc['title'] = vsc['label'];
        vsc['key'] = vsc['value'];
        vsc['isLeaf'] = true;
        children.push(vsc);
      }
      broadHeadingData['children'] = children;
    }
    this.treeData = [{
      title: '全选',
      key: 'all',
      expanded: true,
      children: [...this.vacBroadHeadingData]
    }];
  }

  // 数组属性去重
  process(arr) {
    const tempArr = [];
    for (const t of arr) {
      if (tempArr.find(c => c.broadHeadingCode === t.broadHeadingCode)) {
        continue;
      }
      tempArr.push(t);
    }
    return tempArr;
  }

  // 使用已有科室的疫苗配置
  changeVacSub(ev) {
    this.section = ev;
    // console.log('已有科室的疫苗', this.selectTags);
    this.departmentOption = [];
    this.departmentOption.push(this.registerDeskOption.find(option => option.departmentCode !== this.section));
    this.dialogSvc.open(this.dialog, {
      context: '请选择配置的接种科室！',
      closeOnBackdropClick: false,
      closeOnEsc: false
    });
  }

  saveManage(ref) {
    // console.log('aaa', this.selectTags);
    console.log('子', this.section);
    console.log('父', this.selectedDepartmentCode);
    if (!this.selectedDepartmentCode) return;
    let registerDeskOption = [...this.registerDeskOption];
    for (let j = 0; j < registerDeskOption.length; j++) {
      const item = registerDeskOption[j];
      if (this.section === item.departmentCode) {
        item['defaultCheckedKeys'] = [];
        if (this.watchData) {
          for (let m = 0; m < this.watchData.length; m++) {
            if (this.selectedDepartmentCode === this.watchData[m].code) {
              item['defaultCheckedKeys'] = this.watchData[m]['vaccine'];
            }
          }
        }
        console.log('结果', item['defaultCheckedKeys']);
      }
    }
    console.log('修改后的数据', this.registerDeskOption);
    ref.close();
    this.addVaccine();
  }

  // 根据povCode获取所有部门科室的疫苗配置
  getDepartmentVac(departCode) {
    let params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: departCode
    };
    this.departVacConfigSvc.getVaccineListByDept(params, resp => {
      if (!resp || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      this.vacDepartManageSvc.setDepartmentVaccineArrByDepartmentCode(departCode, resp.data.filter(item => item !== null));
    });
  }

  // 保存此科室选中的疫苗
  addVaccine() {
    console.log('复制后的', this.registerDeskOption);
    let temp = [];
    console.log(this.watchData.length);
    console.log('点击了方法吗');
    if (this.registerDeskOption.length) {
      console.log('进来了');
      for (let i = 0; i < this.registerDeskOption.length; i++) {
        console.log('1', this.selectedDepartmentCode);
        console.log('2', this.registerDeskOption[i].departmentCode);
        if (this.section === this.registerDeskOption[i].departmentCode) {
          temp = [...this.registerDeskOption[i]['defaultCheckedKeys']];
        }
      }
    }
    console.log('temp', temp);
    console.log('temp1', temp.length);
    if (temp) {
      let query = {
        belongDepartmentCode: this.section,
        belongPovCode: this.userInfo.pov,
        vaccineSubclassCodes: temp
      };
      console.log('参数', query);
      this.departVacConfigSvc.insertDepartVacConfig(query, resp => {
        console.log(resp);
        if (resp.code === 0) {
          this.msg.info('配置成功');
          // this.vacDepartManageSvc.setDepartmentVaccineArrByDepartmentCode(this.section, temp);
        }
      });
    }
    this.selectedDepartmentCode = '';


  }
}
