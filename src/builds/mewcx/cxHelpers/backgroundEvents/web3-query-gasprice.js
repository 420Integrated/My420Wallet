/* eslint-disable no-undef */
import { CX_GET_SMOKEPRICE } from '../cxEvents';
import store from '@/store';
import unit from 'fourtwentyjs-unit';
export default async ({ event }, res, next) => {
  if (event !== CX_GET_SMOKEPRICE) return next();
  const smokePrice = store.state.main.smokePrice;
  const convertedSmokePrice = unit.toWei(smokePrice, 'maher').toString();
  res(convertedSmokePrice);
};
