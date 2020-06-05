import { ConfirmDialogComponent } from './../../../../../@uea/components/dialog/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeCommunityComponent } from '../../dialog/change-community/change-community.component';
import { NbDialogService } from '@nebular/theme';
import { CommunityBaseInfoService } from '@tod/svs-common-lib';

@Component({
  selector: 'uea-community-data',
  templateUrl: './community-data.component.html',
  styleUrls: ['../../system.common.scss']
})
export class CommunityDataComponent implements OnInit {
  communityData: any[] = [];
  communityForm: FormGroup;
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private communitySvc: CommunityBaseInfoService,
    private dialog: NbDialogService
  ) { }

  ngOnInit() {
    this.communityForm = this.fb.group({
      communityCode: [null], // 社区编码
      communityName: [null] // 社区名称
    });
  }

  // 查询数据
  search(page = 1) {
    this.pageIndex = page;
    if (this.loading) return;
    let communityForm = JSON.parse(JSON.stringify(this.communityForm.value));
    let params = {
      communityCode: communityForm.communityCode,
      communityName: communityForm.communityName,
      pageEntity: {
        page: this.pageIndex,
        pageSize: this.pageSize
      }
    };
    this.loading = true;
    this.communityData = [];
    this.communitySvc.queryCommunityBaseInfoAndCount(params, resp => {
      this.loading = false;
      if (resp && resp[0].code === 0 && resp[0].hasOwnProperty('data')) {
        this.communityData = resp[0].data;
      }
      if (resp && resp[1].code === 0 && resp[1].hasOwnProperty('data')) {
        this.total = resp[1].data[0].count;
      } else {
        this.total = 0;
      }
    });
  }

  // 修改
  updateCommunity(data: any) {
    this.dialog
      .open(ChangeCommunityComponent, {
        closeOnEsc: false,
        context: {
          updateData: data
        }
      })
      .onClose.subscribe(resp => this.search());
  }

  // 删除
  deleteCommunity(data: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
        context: {
          title: '确认删除',
          content: '是否确认删除此条社区数据?'
        }
      })
      .onClose.subscribe(confirm => {
        if (confirm) {
          console.log(data.id);
          this.communitySvc.deleteCommunityBaseInfo(data.id, resp => {
            console.log('delete', resp);
            if (resp && resp.code === 0 && resp.hasOwnProperty('data')) {
              this.search();
            }
          });
        }
      });
  }

  // 重置
  reset() {
    this.communityForm.reset();
    this.loading = false;
    this.communityData = [];
  }
}
