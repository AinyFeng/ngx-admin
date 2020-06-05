import { OAuthStorage } from 'angular-oauth2-oidc';

export class UeaAuthStorageService extends OAuthStorage {
  private ueaAuthStoragePrefix: string = 'uea.auth.';

  constructor() {
    super();
  }
  getItem(key: string): string {
    const authkey = this.ueaAuthStoragePrefix + key;
    return localStorage.getItem(authkey);
  }
  removeItem(key: string): void {
    const authkey = this.ueaAuthStoragePrefix + key;
    localStorage.removeItem(authkey);
  }
  setItem(key: string, data: string): void {
    const authkey = this.ueaAuthStoragePrefix + key;
    localStorage.setItem(authkey, data);
  }
}
