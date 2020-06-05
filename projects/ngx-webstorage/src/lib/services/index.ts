import { LocalStorageServiceProvider } from './localStorage';
import { Provider } from '@angular/core';
import { SessionStorageServiceProvider } from './sessionStorage';
import { StrategyCacheService } from '../core/strategyCache';

export const Services: Provider[] = [
  LocalStorageServiceProvider,
  SessionStorageServiceProvider,
  StrategyCacheService
];
