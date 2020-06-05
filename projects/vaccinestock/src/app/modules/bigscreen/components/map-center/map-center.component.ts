import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'uea-map-center',
  templateUrl: './map-center.component.html',
  styleUrls: ['./map-center.component.scss']
})
export class MapCenterComponent implements OnInit {
  /**
   * echarts 的 option
   */
  echartsOption: any;

  /**
   * echarts 需要展现的数据
   */
  optionData: any;

  @Input()
  userInfo: any;


  /**
   * 当前所在城市编码，比如滁州市3411，凤阳县就是3411XX 共6位数
   */
  searchDistrictCode: string;

  @Input('searchDistrictCode')
  set setSearchDistrictCode(code: string) {
    // if (!code) return;
    this.searchDistrictCode = code ? code : '341100';
    this.setOptionData(this.searchDistrictCode);
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  /**
   * 根据地图geo数据渲染地图
   * @param mapData
   */
  setOption(mapData: any) {
    if (!this.userInfo || !mapData) return;
    echarts.registerMap('geoMap', mapData);

    this.echartsOption = {
      title: {
        text: '滁州市',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c} (p / km2)'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '滁州市各区县POV分布情况',
          type: 'map',
          mapType: 'geoMap',
          data: [],
          nameMap: {},
          itemStyle: {
            areaColor: '#3366ff',
            borderColor: '#ffffff',
            borderWidth: 1
          }
        }
      ]
    };
  }

  /**
   * 根据各区县编码获取地图数据
   * @param code
   * @param func
   */
  getMapDataByCode(code: string, func: Function) {
    this.http.get('/assets/data/bigscreen/' + code + '.json').subscribe(res => func(res));
  }

  /**
   * 根据传入的地区编码查询地图数据，并重新绘制地图
   * @param code 地区编码6位数
   */
  setOptionData(code: string) {
    this.getMapDataByCode(code, res => {
      if (!res) return;
      this.setOption(res);
    });
  }

}
