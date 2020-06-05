import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { AuthService } from '@tod/uea-auth-lib';

@Injectable({
  providedIn: 'root'
})
export class ScimService {

  baseURL = 'https://uat.chinavacc.com.cn/identity/restv1/scim/v2';



  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {
  }

  GetToken() {
    return this.authService.accessToken;
  }

  getServiceConfig() {
    let url = '/scim/ServiceProviderConfig';
    return this.httpClient.get(url)
      .pipe(
        catchError(this.errorHandle)
      );
  }


  GetScimAccessToken(): Observable<any> {
    // const tokenURL = 'https://uat.chinavacc.com.cn/oxauth/restv1/token';
    const tokenURL = '/token';
    const clientId = '0dd5575c-07c6-4311-aeee-4f717bef7fda';
    const clientSecret = 'Pf9TOrlSTderTe1I12bJjhda';
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      })
    };

    let data = 'grant_type=client_credentials';

    return this.httpClient.post(tokenURL, data, httpOptions)
      .pipe(
        retry(1),
        map((res) => res['access_token']),
        catchError(this.errorHandle)
      );
  }
  GetUser(scimAccessToken: string) {
    let url = '/scim/Users/de5ece91-44c8-42fc-bdbd-76f04e79bc1d';
    let accessToken = scimAccessToken;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
      params: {
      },
    };

    return this.httpClient.get<any>(url, httpOptions)
      .pipe(
        retry(1),
        tap(res => console.table(res)),
        catchError(this.errorHandle)
      );
  }


  // Error handling
  errorHandle(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
