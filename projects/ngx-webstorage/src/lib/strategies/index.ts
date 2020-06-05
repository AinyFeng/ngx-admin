import { InjectionToken, Provider, PLATFORM_ID, NgZone } from '@angular/core';
import { StorageStrategy } from '../core/interfaces/storageStrategy';
import { LocalStorageStrategy } from './localStorage';
import { SessionStorageStrategy } from './sessionStorage';
import { InMemoryStorageStrategy } from './inMemory';
import { LOCAL_STORAGE, SESSION_STORAGE } from '../core/nativeStorage';
import { StrategyCacheService } from '../core/strategyCache';

export const STORAGE_STRATEGIES: InjectionToken<StorageStrategy<any>> = new InjectionToken<StorageStrategy<any>>('STORAGE_STRATEGIES');

export const Strategies: Provider[] = [
  { provide: STORAGE_STRATEGIES, useClass: InMemoryStorageStrategy, multi: true, deps: [StrategyCacheService] },
  { provide: STORAGE_STRATEGIES, useClass: LocalStorageStrategy, multi: true, deps: [LOCAL_STORAGE, StrategyCacheService, PLATFORM_ID, NgZone] },
  { provide: STORAGE_STRATEGIES, useClass: SessionStorageStrategy, multi: true, deps: [SESSION_STORAGE, StrategyCacheService, PLATFORM_ID, NgZone] },
];
