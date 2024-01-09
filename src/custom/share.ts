import {Distinct} from '../types';
import {Subscribe} from './subscribe';

export type PubSubName = string & Distinct<'PubSubName'>;

export const subscriptions = new Map<
  PubSubName,
  Subscribe<unknown, unknown>[]
>();
