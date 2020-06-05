import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { VaccineSubclassInitService, DateUtils } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-shanghai-immunity-vac-card',
  templateUrl: './shanghai-immunity-vac-card.component.html',
  styleUrls: ['./shanghai-immunity-vac-card.component.scss']
})
export class ShanghaiImmunityVacCardComponent implements OnInit, OnChanges {
  // 上海票据打印 id
  printId = 'shanghaiImmunityCard';

  @Output()
  readonly printShanghai = new EventEmitter();

  @Input()
  vaccinateRecords = [];
  // 疫苗小类编码集合
  subclassCodeArr = [];

  // 表格集合
  originalTable = [
    [
      {
        vaccineBroadHeadingCodeArr: ['02'], // 大类code
        vaccineBroadHeadingName: '乙肝', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 3,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['02'],
        vaccineBroadHeadingName: '乙肝', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['02'],
        vaccineBroadHeadingName: '乙肝', // 大类名称
        vaccinateInjectNumber: 3, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['01'], // 大类code
        vaccineBroadHeadingName: '卡介苗', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 1,
        colspan: 2
      },
      {
        vaccineBroadHeadingCodeArr: ['03'], // 大类code
        vaccineBroadHeadingName: '灰苗', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 5,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['03'],
        vaccineBroadHeadingName: '灰苗', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['03'],
        vaccineBroadHeadingName: '灰苗', // 大类名称
        vaccinateInjectNumber: 3, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['03'],
        vaccineBroadHeadingName: '灰苗', // 大类名称
        vaccinateInjectNumber: 4, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['03'],
        vaccineBroadHeadingName: '灰苗', // 大类名称
        vaccinateInjectNumber: 5, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['04'], // 大类code
        vaccineBroadHeadingName: '白百破', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 4,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['04'],
        vaccineBroadHeadingName: '白百破', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['04'],
        vaccineBroadHeadingName: '白百破', // 大类名称
        vaccinateInjectNumber: 3, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['04'],
        vaccineBroadHeadingName: '白百破', // 大类名称
        vaccinateInjectNumber: 4, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      }
    ],
    [
      {
        vaccineBroadHeadingCodeArr: ['14'], // 大类code
        vaccineBroadHeadingName: '麻风', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 1
      },
      {
        vaccineBroadHeadingCodeArr: ['12'], // 大类code
        vaccineBroadHeadingName: '麻腮风', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 2
      },
      {
        vaccineBroadHeadingCodeArr: ['12'],
        vaccineBroadHeadingName: '麻腮风', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['18'], // 大类code
        vaccineBroadHeadingName: '乙脑', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        vaccineSubclassCodeArr: [],
        showInjectNumber: true,
        rowspan: 3,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['18'], // 大类code
        vaccineBroadHeadingName: '乙脑', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['18'], // 大类code
        vaccineBroadHeadingName: '乙脑', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        showInjectNumber: false,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['19'], // 大类code
        vaccineBroadHeadingName: '甲肝', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true,
        rowspan: 2,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['19'], // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['16', '17'], // 大类code
        vaccineBroadHeadingName: '流脑', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true,
        rowspan: 5,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['16', '17'], // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['16', '17'], // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        showInjectNumber: true,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['16', '17'], // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 4, // 针次
        showInjectNumber: true,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['16', '17'], // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 5, // 针次
        showInjectNumber: false,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      }
    ],
    [
      {
        vaccineBroadHeadingCodeArr: ['06'], // 大类code
        vaccineBroadHeadingName: '白破', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 2,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['06'],
        vaccineBroadHeadingName: '白破', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['22'], // 大类code
        vaccineBroadHeadingName: '水痘', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 2,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['22'],
        vaccineBroadHeadingName: '水痘', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['23'], // 大类code
        vaccineBroadHeadingName: 'HIB', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null, // 批号
        rowspan: 4,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['23'],
        vaccineBroadHeadingName: 'HIB', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['23'],
        vaccineBroadHeadingName: 'HIB', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['23'],
        vaccineBroadHeadingName: 'HIB', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 4, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['25'], // 肺炎
        vaccineBroadHeadingName: '肺炎', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null, // 批号
        showInjectNumber: true,
        rowspan: 5,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['25'],
        vaccineBroadHeadingName: '肺炎', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['25'],
        vaccineBroadHeadingName: '肺炎', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        showInjectNumber: true,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['25'],
        vaccineBroadHeadingName: '肺炎', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 4, // 针次
        showInjectNumber: true,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      },
      {
        vaccineBroadHeadingCodeArr: ['25'],
        vaccineBroadHeadingName: '肺炎', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 5, // 针次
        showInjectNumber: true,
        vaccinateTime: null, // 接种日期
        vaccineBatchNo: null // 批号
      }
    ],
    [
      {
        vaccineBroadHeadingCodeArr: ['24'], // 大类code
        vaccineBroadHeadingName: '轮病', // 大类名称
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 3,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['24'],
        vaccineBroadHeadingName: '轮病', // 大类名称
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['24'],
        vaccineBroadHeadingName: '轮病', // 大类名称
        vaccinateInjectNumber: 3, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true
      },
      {
        vaccineBroadHeadingCodeArr: ['54'], // 大类code
        vaccineBroadHeadingName: 'EV71', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 2,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['54'],
        vaccineBroadHeadingName: 'EV71', // 大类名称
        vaccineSubclassCode: '',
        showInjectNumber: true,
        vaccinateInjectNumber: 2, // 针次
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['38'], // 大类code
        vaccineBroadHeadingName: '霍乱', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 3,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['38'],
        vaccineBroadHeadingName: '霍乱', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['38'],
        vaccineBroadHeadingName: '霍乱', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['21'], // 大类code
        vaccineBroadHeadingName: '流感', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 1, // 针次
        vaccinateTime: null, // 接种日期
        showInjectNumber: true,
        rowspan: 5,
        direction: 'col'
      },
      {
        vaccineBroadHeadingCodeArr: ['21'],
        vaccineBroadHeadingName: '流感', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 2, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['21'],
        vaccineBroadHeadingName: '流感', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 3, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['21'],
        vaccineBroadHeadingName: '流感', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 4, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      },
      {
        vaccineBroadHeadingCodeArr: ['21'],
        vaccineBroadHeadingName: '流感', // 大类名称
        vaccineSubclassCode: '',
        vaccinateInjectNumber: 5, // 针次
        showInjectNumber: true,
        vaccinateTime: null // 接种日期
      }
    ]
  ];

  // 保留原有记录
  tableAll = [];

  // 档案信息
  @Input()
  profile: any;

  constructor(private subclassCodeSvc: VaccineSubclassInitService) {
    this.subclassCodeArr = this.subclassCodeSvc.getVaccineSubClassData();
  }

  ngOnInit() {
    this.resetTable();
    this.printShanghai.emit({ id: this.printId });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    if (
      changes.hasOwnProperty('vaccinateRecords') &&
      changes['vaccinateRecords'].currentValue !== undefined
    ) {
      this.generateTableData(changes['vaccinateRecords'].currentValue);
    }
  }

  resetTable() {
    this.tableAll = JSON.parse(JSON.stringify(this.originalTable));
  }

  /**
   * 根据疫苗接种记录生成表格数据
   * @param data 接种记录
   */
  generateTableData(data: any[]) {
    this.resetTable();
    // 对表格对象开始循环遍历，根据大类编码将接种记录放到表格中
    for (let i = 0; i < this.tableAll.length; i++) {
      // 其中一个表格对象
      const table = this.tableAll[i];
      for (let j = 0; j < table.length; j++) {
        const t = table[j];
        const broadHeadingCodeArr = t['vaccineBroadHeadingCodeArr'];
        const vaccinateInjectNumber = t['vaccinateInjectNumber'];
        const record = this.findVacRecordByBroadHeadingCode(
          broadHeadingCodeArr,
          vaccinateInjectNumber
        );
        if (record !== null) {
          t['vaccinateTime'] = DateUtils.formatToDate(record['vaccinateTime']);
        }
      }
    }
    // console.log(this.tableAll);
  }

  /**
   * 根据大类编码\接种针次查询疫苗记录
   * @param broadHeadingCodeArr 大类编码集合
   * @param vaccinateInjectNumber 针次
   */
  findVacRecordByBroadHeadingCode(
    broadHeadingCodeArr: any[],
    vaccinateInjectNumber: number
  ) {
    for (let i = 0; i < this.vaccinateRecords.length; i++) {
      const record = this.vaccinateRecords[i];
      if (
        broadHeadingCodeArr.includes(record['vaccineBroadHeadingCode']) &&
        vaccinateInjectNumber === record['vaccinateInjectNumber']
      ) {
        return record;
      }
    }
    return null;
  }
}
