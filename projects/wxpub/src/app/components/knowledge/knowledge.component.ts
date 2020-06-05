import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {WxService} from '../../services/wx.service';

@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.scss', '../../wx.component.scss']
})
export class KnowledgeComponent implements OnInit {
  vaccForm: FormGroup;
  povForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private wxService: WxService
  ) {
  }

  tabCurrentIndex = 2;
  vaccArr = [1, 2];
  povArr = [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

  vaccInfo = {
    vaccClass: ['选择'],
    vaccFactor: ['选择'],
    vaccNumber: [null]
  };

  povInfo = {
    povArea: ['选择'],
    keyWord: [null]
  };

  knowledgeData = [
    {
      title: '乙肝疫苗',
      id: '0',
      info:
        '0百日咳是一种由百日咳杆菌引起的急性呼吸道传染病，自从广泛实施百日咳菌苗免疫接种后,本病的发生率已经大为减少。百日咳的临床特征为咳嗽逐渐加重，呈典型的阵发性、痉挛性咳嗽，咳嗽终末出现深长的鸡啼样吸气性吼声，病程长达2～3个月，故有百日咳之称。'
    },
    {
      title: '乙肝疫苗',
      id: '0',
      info:
        '1百日咳是一种由百日咳杆菌引起的急性呼吸道传染病，自从广泛实施百日咳菌苗免疫接种后,本病的发生率已经大为减少。百日咳的临床特征为咳嗽逐渐加重，呈典型的阵发性、痉挛性咳嗽，咳嗽终末出现深长的鸡啼样吸气性吼声，病程长达2～3个月，故有百日咳之称。'
    },
    {
      title: '乙肝疫苗',
      id: '0',
      info:
        '2百日咳是一种由百日咳杆菌引起的急性呼吸道传染病，自从广泛实施百日咳菌苗免疫接种后,本病的发生率已经大为减少。百日咳的临床特征为咳嗽逐渐加重，呈典型的阵发性、痉挛性咳嗽，咳嗽终末出现深长的鸡啼样吸气性吼声，病程长达2～3个月，故有百日咳之称。'
    },
    {
      title: '乙肝疫苗',
      id: '0',
      info:
        '3百日咳是一种由百日咳杆菌引起的急性呼吸道传染病，自从广泛实施百日咳菌苗免疫接种后,本病的发生率已经大为减少。百日咳的临床特征为咳嗽逐渐加重，呈典型的阵发性、痉挛性咳嗽，咳嗽终末出现深长的鸡啼样吸气性吼声，病程长达2～3个月，故有百日咳之称。'
    }
  ];

  ngOnInit() {
    this.vaccForm = this.fb.group({
      vaccClass: [[{label: '选择', value: ''}]],
      vaccFactor: [[{label: '选择', value: ''}]],
      vaccNumber: [null]
    });

    this.povForm = this.fb.group({
      povArea: [[{label: '选择', value: ''}]],
      keyWord: [null]
    });
  }

  cellClick(item) {
    this.router.navigate([
      '/knowledgeDetail',
      JSON.stringify(item)
    ]);
  }

  // 疫苗说明书
  queryVaccData() {
    const value = this.vaccForm.value;
    console.log('疫苗说明书===', value);
  }

  // 接种门诊
  queryPovData() {
    const value = this.povForm.value;
    console.log('接种门诊===', value);
  }

  tranLatePickValue(item) {
    return item.label;
  }

  tabClick(i) {
    this.tabCurrentIndex = i;
  }
}
