import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VaccinateService} from '@tod/svs-common-lib';
import {Subscription} from 'rxjs';
import {VaccinatePlatformService} from '../vaccinate-platform.service';

@Component({
  selector: 'uea-vaccinate-history-list',
  templateUrl: './vaccinate-history-list.component.html',
  styleUrls: ['./vaccinate-history-list.component.scss']
})
export class VaccinateHistoryListComponent  implements OnInit, OnDestroy {
  @Input()
  showCard: boolean = true;
  vaccinateRecords: any[] = [];
  vaccinateRecordsCount: number = 0;
  vaccinateRecordsPageSize = 10;
  vaccinateRecordsPageIndex = 1;
  currentQueueItem: any;

  private subscription: Subscription[] = [];

  constructor(
    private vaccinateService: VaccinateService,
    private platformService: VaccinatePlatformService) {
  }

  ngOnInit() {
    this.initCurrentQueueItem();
    this.initVaccinateHistoryRecords();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  initCurrentQueueItem() {
    const sub = this.platformService.getCurrentQueueItem().subscribe(queueItem => {
      if (queueItem) {
        this.currentQueueItem = queueItem;
        this.platformService.queryHistoryVaccinateRecords(queueItem['profileCode']);
      } else {

      }
    });
    this.subscription.push(sub);
  }

  initVaccinateHistoryRecords() {
    const sub = this.platformService.getVaccinateHistoryRecords().subscribe(data => {
      this.vaccinateRecords = data['records'];
      this.vaccinateRecordsCount = data['count'];
    });
    this.subscription.push(sub);
  }

  queryVaccinateHistoryRecords(event) {
    this.platformService.queryHistoryVaccinateRecords(this.currentQueueItem['profileCode'], event);
  }
}
