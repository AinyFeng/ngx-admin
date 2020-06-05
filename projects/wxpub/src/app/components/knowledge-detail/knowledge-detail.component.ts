import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {WxService} from '../../services/wx.service';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.scss']
})
export class KnowledgeDetailComponent implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private wxService: WxService
  ) {
    this.activeRoute.params.subscribe((params: Params) => {
      this.detailInfo = JSON.parse(params['detail']);
      console.log(22, this.detailInfo);
    });
  }

  detailInfo = {};

  ngOnInit() {
  }
}
