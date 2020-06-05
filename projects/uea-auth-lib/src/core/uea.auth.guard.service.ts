import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './uea.auth.service';
import { Observable } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UeaAuthGuardService implements CanActivate {

  private isAuthenticated: boolean;

  constructor(private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(i => this.isAuthenticated = i);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isDoneLoading$
      .pipe(filter(isDone => isDone))
      .pipe(tap(_ => this.isAuthenticated || this.authService.login(state.url)))
      .pipe(map(_ => this.isAuthenticated));
  }
}
