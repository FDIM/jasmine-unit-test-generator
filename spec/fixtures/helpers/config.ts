import { InjectionToken } from "@angular/core";

export interface AppConfig {
  env: string;
}

export type ENV = 'dev' | 'test';

export const CONFIG_TOKEN = new InjectionToken<AppConfig>('AppConfig');
export const ENV_TOKEN = new InjectionToken<ENV>('ENV');
