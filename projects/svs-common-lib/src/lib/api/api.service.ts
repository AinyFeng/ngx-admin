import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public errorDefaultValue = { msg: '操作失败', code: -1 };

  constructor(
    private httpClient: HttpClient,
    // private notification: NbToastrService
  ) {
  }

  public handleResponse(): OperatorFunction<object, object> {
    const catchErrorFunction = catchError(error => {
      // TODO 在这里就需要对返回的错误信息进行处理，不管是什么错误，给用户提示的都得是"网络故障"
      if (error.error instanceof ErrorEvent) {
        console.error('出错了', error.error.message);
      } else {
        console.log('请求出错了', error);
      }
      // this.notification.danger(`请检查网络情况后重试`, '出错了', {
      //   preventDuplicates: true
      // });
      return of(this.errorDefaultValue);
    });
    const mapFunction = map((resp: object) => {
      // TODO 编辑返回结果map处理，如果在后端定义了返回对象，则在这里就可以将返回对象中的数据值返回，比如后端的返回对象为 { code: 1, data: [], msg: ''}
      // TODO 那么在这个处理方法里就可以直接把data对象返回回去，code 和 msg 就不需要了，因为本身就已经成功了
      if (resp === undefined || !resp) return this.errorDefaultValue;
      return resp;
    });
    return pipe(
      catchErrorFunction,
      mapFunction
    );
  }

  public get(url: string, params?: any): Observable<object> {
    return this.httpClient
      .get<object>(url, { params: params })
      .pipe(this.handleResponse());
  }

  public post(url: string, body: any, params?: any): Observable<object> {
    return this.httpClient
      .post<object>(url, body, { params: params })
      .pipe(this.handleResponse());
  }

  public put(url: string, body: any, params?: any): Observable<object> {
    return this.httpClient
      .put<object>(url, body, { params: params })
      .pipe(this.handleResponse());
  }

  public del(url: string, params?: any): Observable<object> {
    return this.httpClient
      .delete<object>(url, { params: params })
      .pipe(this.handleResponse());
  }

  public postForDownload(url: string, body: any, params?: any): Observable<object> {
    return this.httpClient
      .post<object>(url, body, params);
  }
}
