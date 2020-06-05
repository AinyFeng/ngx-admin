import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ProfileChangeService {
  private profileChange$ = new BehaviorSubject<string>(null);

  private callNumberProfile$ = new BehaviorSubject<string>(null);

  setProfileChange(key: string) {
    this.profileChange$.next(key);
  }

  getProfileChange() {
    return this.profileChange$.asObservable();
  }

  setCallNumberProfileName(data: any) {
    if (!data) return;
    this.callNumberProfile$.next(data);
  }

  getCallNumberProfileName() {
    return this.callNumberProfile$.asObservable();
  }
}
