import { NbRoleProvider } from '@nebular/security';
import { of } from 'rxjs';

export class UeaSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return of('guest');
  }
}

export const defaultUeaSecurityOptions = {
  accessControl: {
    guest: {
      view: '*'
    },
    user: {
      parent: 'guest',
      create: '*',
      edit: '*',
      remove: '*'
    }
  }
};
