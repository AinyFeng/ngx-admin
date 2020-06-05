import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'uea-exchange-rates',
  template: `
    <nb-card accent="info">
      <div *ngIf="loading">
        Loading...
      </div>
      <div *ngIf="error">
        Error :(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(:(
      </div>
      <div *ngIf="rates">
        <div *ngFor="let rate of rates">
          <p>{{ rate.title }}: {{ rate.author }}</p>
        </div>
      </div>
    </nb-card>
  `
})
export class UeaExchangeRatesComponent implements OnInit {
  rates: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            books {
              title
              author
            }
          }
        `
      })
      .valueChanges.subscribe((result: any) => {
        this.rates = result.data && result.data.books;
        this.loading = result.loading;
        this.error = result.error;
      });
  }
}
