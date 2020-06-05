import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {UserService} from '@tod/uea-auth-lib';
import {DepartmentConfigService, VaccDepartmentManageService, DepartmentInitService} from '@tod/svs-common-lib';
import {NbDialogService} from '@nebular/theme';

@Component({
  selector: 'uea-choose-vac-deploy',
  templateUrl: './choose-vac-deploy.component.html',
  styleUrls: ['./choose-vac-deploy.component.scss']
})
export class ChooseVacDeployComponent implements OnInit {
  nodes = [];

  // 改变指针地址
  @Input('nodes')
  set setNodeData(val: any) {
    this.nodes = JSON.parse(JSON.stringify(val));
  }

  // 从父组件中传来的部门数据信息
  @Input()
  departmentData: any;
  @Input()
  vacSubClassData: any;

  @Output() readonly changeCopay = new EventEmitter();

  @ViewChild('dialog', {static: true})
  dialog;

  userInfo: any;

  /**
   * 科室已配置疫苗
   */
  selectedVacData: any;
  /**
   * 树节点选中数据
   */
  treeSelectedNodes = [];

  subClassCodes = [];

  // 科室选择
  departmentOption: any;
  // 所有的科室
  registerDeskOption = [];

  // 选择已有疫苗科室
  selectedDepartCode: any;

  loading = false;


  constructor(
    private departVacConfigSvc: DepartmentConfigService,
    private msg: NzMessageService,
    private userSvc: UserService,
    private vacDepartManageSvc: VaccDepartmentManageService,
    private dialogSvc: NbDialogService,
    private departmentInitSvc: DepartmentInitService
  ) {
    const sub = this.userSvc.getUserInfoByType().subscribe(user => this.userInfo = user);
    this.registerDeskOption = this.departmentInitSvc.getDepartmentData('1');
  }

  ngOnInit() {
    // 获取部门的疫苗
    this.getDepartmentVac(this.departmentData['departmentCode']);
  }

  // 使用已有配置
  useExitConfig(departmentCode: string) {
    console.log(departmentCode);
    this.departmentOption = [];
    if (this.registerDeskOption.find(option => option.departmentCode !== departmentCode)) {
      this.registerDeskOption.forEach(option => {
        if (option.departmentCode !== departmentCode) {
          this.departmentOption.push(option);
        }
      });
      this.dialogSvc.open(this.dialog, {
        context: '请选择配置的接种科室！',
        closeOnBackdropClick: false,
        closeOnEsc: false
      });
      console.log('科室', this.departmentOption);
    } else {
      this.msg.warning('当前只有一个科室,无法使用已有配置');
      return;
    }
    console.log('科室', this.departmentOption);

  }

  // 保存此科室选中的疫苗
  addVaccine(departmentCode: string) {
    if (this.loading) return;
    console.log('已选择的疫苗', this.subClassCodes);
    if (!this.subClassCodes.length) {
      this.msg.warning('请选择疫苗');
      return;
    }
    // 先删除该部门现有的疫苗,然后再批量插入
    const conditions = {
      belongDepartmentCode: departmentCode,
      belongPovCode: this.userInfo.pov,
    };
    this.departVacConfigSvc.deleteDepartVacConfig(conditions, result => {
      // 只有先删除成功了,才能在插入
      if (result && result.code === 0) {
        let params = [];
        this.subClassCodes.forEach(item => {
          const query = {
            belongDepartmentCode: departmentCode,
            belongPovCode: this.userInfo.pov,
            vaccineSubclassCode: item
          };
          params.push(query);
        });

        console.log('参数', params);
        this.loading = true;
        this.departVacConfigSvc.insertDepartVacConfig(params, resp => {
          this.loading = false;
          console.log(resp);
          if (resp.code === 0) {
            this.msg.info('配置成功');
            this.vacDepartManageSvc.setDepartmentVaccineArrByDepartmentCode(departmentCode, this.treeSelectedNodes);
          }
        });
      } else {
        this.msg.warning('配置失败');
        return;
      }
    });


  }

  // 获取点击树节点
  onClickTree(event) {
    const nodes = event.keys;
    this.treeSelectedNodes = [];
    this.subClassCodes = [];
    if (!nodes) {
      this.treeSelectedNodes = [];
      this.subClassCodes = [];
    } else {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node === 'all') {
          for (let k = 0; k < this.vacSubClassData.length; k++) {
            this.subClassCodes.push(this.vacSubClassData[k].value);
          }
          this.treeSelectedNodes = ['all'];
        } else {
          if (node.length === 2) {
            for (let j = 0; j < this.vacSubClassData.length; j++) {
              const single = this.vacSubClassData[j].value;
              if (single.substr(0, 2) === node) {
                this.treeSelectedNodes.push(single);
                this.subClassCodes.push(single);
              }
            }
          } else {
            this.treeSelectedNodes.push(node);
            this.subClassCodes.push(node);
          }
        }
      }
    }
  }

  // 获取疫苗数据
  /*getVacc() {
    this.selectedVacData = this.vacDepartManageSvc.getVaccineByDepartmentCode(this.departmentData['departmentCode']);
    console.log('获取到的疫苗', this.selectedVacData);
    this.treeSelectedNodes = [...this.selectedVacData['vaccine']];
  }*/

  /**
   * 根据部门编码获取疫苗配置数据
   * @param departCode
   */
  getDepartmentVac(departCode: string) {
    let params = {
      belongPovCode: this.userInfo.pov,
      belongDepartmentCode: departCode
    };
    this.departVacConfigSvc.getVaccineListByDept(params, resp => {
      if (!resp || !resp.hasOwnProperty('data') || resp.data.length === 0) {
        return;
      }
      console.log('疫苗', resp.data);
      // 存储科室配置的疫苗
      this.vacDepartManageSvc.setDepartmentVaccineArrByDepartmentCode(departCode, resp.data.filter(item => item !== null));
      // 获取此科室的疫苗配置
      this.selectedVacData = this.vacDepartManageSvc.getVaccineByDepartmentCode(departCode);
      // 匹配树节点选中的疫苗节点
      this.treeSelectedNodes = [...this.selectedVacData['vaccine']];
      this.subClassCodes = [...this.selectedVacData['vaccine']];
    });
  }

  // 选择已有的科室保存
  saveManage(ref) {
    this.getDepartmentVac(this.selectedDepartCode);
    ref.close();
  }
}
