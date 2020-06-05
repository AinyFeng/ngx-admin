import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const drawerAnimation = trigger('drawer', [
  state(
    'hide',
    style({ height: '0', visibility: 'hidden', overflow: 'hidden', })
  ),
  state('show', style({ height: '320px', visibility: 'visible', })),
  transition('hide => show', animate('100ms ease-in-out')),
  transition('show => hide', animate('100ms ease-in-out'))
]);
