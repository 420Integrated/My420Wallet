/* eslint-disable no-undef */
import { CX_GET_SMOKE } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_GET_SMOKE) return next();
  const newTx = Object.assign({}, payload.tx);
  delete newTx.chainId;
  delete newTx.tokenSymbol;
  delete newTx.tokenTransferTo;
  delete newTx.tokenTransferVal;
  delete newTx.smokeLimit;
  delete newTx.r;
  delete newTx.s;
  delete newTx.v;
  const smoke = await store.state.main.web3.fourtwenty.estimateSmoke(newTx);
  res(smoke);
};
