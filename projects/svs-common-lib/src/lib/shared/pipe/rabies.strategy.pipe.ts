import {Pipe, PipeTransform} from '@angular/core';
import {LocalStorageService} from '@tod/ngx-webstorage';
import {RabiesStrategyProgramService} from '../../service/rabies.strategy.program.service';

@Pipe({
  name: 'rabiesStrategyPipe',
  pure: true
})

export class RabiesStrategy implements PipeTransform {
  programNameData = [];

  constructor(private localSt: LocalStorageService,
              private rabiesStrategySvc: RabiesStrategyProgramService) {
    this.programNameData = this.rabiesStrategySvc.getProgramsData();
  }

  /**
   * 根据犬伤接种方案的value来转换犬伤接种方案的name
   * @param 接种方案value
   */
  transform(value: string): any {
    if (!value || value.trim() === '') {
      return;
    }
    for (let i = 0; i < this.programNameData.length; i++) {
      const item = this.programNameData[i];
      if (value.trim() === item['value'].trim()) {
        return item['label'].trim();
      }
    }
  }

}
