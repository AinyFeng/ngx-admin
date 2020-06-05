import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {WxService} from '../../services/wx.service';
import {Validators} from '@angular/forms';
import {DateUtils} from '@tod/svs-common-lib';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'uea-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.less']
})
export class ArchiveDetailComponent implements OnInit {
  archive = [];
  wxDicInfo: any = {};

  constructor(
    private wxService: WxService,
    private activeRoute: ActivatedRoute,
  ) {
    this.activeRoute.params.subscribe((params: Params) => {
      const temp = JSON.parse(params['archive']);
      console.log(22, temp);
      this.wxDicInfo = JSON.parse(localStorage.getItem('wxDicInfo'));
      console.log(this.wxDicInfo);
      const archiveinfo = {
        name: temp['profileName'] || '无',
        sex: temp['gender'] === 'f' ? '女' : '男',
        birthday: DateUtils.getTimeFromTimestamp(temp['birthDate'], 'YYYY-MM-DD'),
        nation: this.transformNation(temp['nationCode']) || '无',
        vaccNum: temp['immunityVacCard'],  // 免疫卡号
        idNum: temp['idCardNo'],
        phone: temp['createAccount'] || '无',  // 联系电话
        birthdayNum: temp['birthCardNo'] || '无',  // 出生症编号
        hospital: this.transformHospital(temp['birthHospitalCode']) || '无', //  出生医院 !!!
        weight: temp['birthWeight'] || '无',  //  出生体重
        birthNum: temp['parity'] || '无', // 胎次

        accountType: this.transformAccountType(temp['idTypeCode']), // 户口类别 !!!
        liveType: this.transformLiveType(temp['residentialTypeCode']), // 居住类型
        householdAddress: this.transformDistrict(temp['idCardProvCode'], temp['idCardCityCode'], temp[' idCardDistrictCode']) || '无', // 户籍所在地
        householdAddressInfo: temp['idCardDetail'] || '无', // 户籍详细住址
        liveAddress: this.transformDistrict(temp['liveProvCode'], temp['liveCityCode'], temp['liveDistrictCode']) || '无', // 居住地区
        liveAddressInfo: temp['liveDetail'] || '无', // 居住地区详细住址

        motherName: temp['motherName'] || '无',
        motherId: temp['motherIdCardNo'] || '无',  // 母亲身份证号
        motherPhone: temp['motherContactPhone'] || '无',
        fatherName: temp['fatherName'] || '无',
        fatherId: temp['fatherIdCardNo'] || '无',
        fatherPhone: temp['fatherContactPhone'] || '无',

      };
      this.archive = [
        {
          title: '姓名',
          value: archiveinfo['name']
        },
        {
          title: '性别',
          value: archiveinfo['sex']
        },
        {
          title: '出生日期',
          value: archiveinfo['birthday']
        },
        {
          title: '民族',
          value: archiveinfo['nation']
        },
        {
          title: '免疫卡号',
          value: archiveinfo['vaccNum']
        },
        {
          title: '身份证号',
          value: archiveinfo['idNum']
        },
        {
          title: '联系电话：',
          value: archiveinfo['phone']
        },
        {
          title: '出生证编号：',
          value: archiveinfo['birthdayNum']
        },
        {
          title: '出生医院：',
          value: archiveinfo['hospital']
        },
        {
          title: '出生体重(g)：',
          value: archiveinfo['weight']
        },
        {
          title: '胎次：',
          value: archiveinfo['birthNum']
        },
        {
          title: '户口类别：',
          value: archiveinfo['accountType']
        },
        {
          title: '居住类型：',
          value: archiveinfo['liveType']
        },
        {
          title: '户籍所在地：',
          value: archiveinfo['householdAddress']
        },
        {
          title: '户籍住址：',
          value: archiveinfo['householdAddressInfo']
        },
        {
          title: '居住地区：',
          value: archiveinfo['liveAddress']
        },
        {
          title: '详细住址：',
          value: archiveinfo['liveAddressInfo']
        },
        {
          title: '母亲姓名：',
          value: archiveinfo['motherName']
        },
        {
          title: '母亲身份证号：',
          value: archiveinfo['motherId']
        },
        {
          title: '母亲电话：',
          value: archiveinfo['motherPhone']
        },
        {
          title: '父亲姓名：',
          value: archiveinfo['fatherName']
        },
        {
          title: '父亲身份证号：',
          value: archiveinfo['fatherId']
        },
        {
          title: '父亲电话：',
          value: archiveinfo['fatherPhone']
        },
      ];
    });
  }

  ngOnInit() {
    this.queryArchive(this.archive);
    // this.transformDistrict();
  }

  queryArchive(archive) {
    // this.wxService.queryProfileList()
  }

  transformAccountType(type) {
    let typeValue = '';
    switch (type) {
      case '1':
        typeValue = '本县';
        break;
      case '2':
        typeValue = '本市';
        break;
      case '3':
        typeValue = '本省';
        break;
      case '4':
        typeValue = '外省';
        break;
      case '5':
        typeValue = '境外';
        break;
      default:
        typeValue = '港澳台';
    }
    return typeValue;
  }

  transformLiveType(type) {
    let typeValue = '';
    switch (type) {
      case '1':
        typeValue = '本地';
        break;
      case '2':
        typeValue = '外来';
        break;
      default:
        typeValue = '流动';
    }
    return typeValue;
  }

  // 转换省市区
  transformDistrict(provCode = '', cityCode = '', districtCode = '') {
    let address = '';
    const tempData = require('../../../assets/data/common/AdministrativeDivisionTreeData.json');
    const districtData = tempData.data;
    districtData.forEach(prov => {
      if (provCode === prov.value) {
        address += prov.label + ' ';
        prov.children.forEach(city => {
          if (cityCode === city.value) {
            address += city.label + ' ';
            city.children.forEach(district => {
              if (districtCode === district.value) {
                address += district.label + ' ';
              }
            });
          }
        });
      }
    });
    return address;
  }

  // 转换民族
  transformNation(nationCode) {
    let nation = '';
    this.wxDicInfo['nationData'].forEach(item => {
      if (item['code'] === nationCode) {
        nation = item['label'];
      }
    });
    return nation;
  }

  // 转换医院
  transformHospital(birthHospitalCode) {
    let hospital = '';
    this.wxDicInfo['nationData'].forEach(item => {
      if (item['code'] === birthHospitalCode) {
        hospital = item['label'];
      }
    });
    return hospital;
  }
}

