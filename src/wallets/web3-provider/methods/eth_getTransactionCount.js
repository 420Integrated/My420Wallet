import utils from 'web3-utils';
import { toPayload } from '../jsonrpc';
import FourtwentyCalls from '../web3Calls';
import store from 'store';
import BigNumber from 'bignumber.js';
import { Misc } from '@/helpers';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'fourtwenty_getTransactionCount') return next();
  const fourtwentyCalls = new FourtwentyCalls(requestManager);
  const addr = payload.params[0];
  let cached = {};
  if (store.get(utils.sha3(addr)) === undefined) {
    cached = {
      nonce: '0x00',
      timestamp: 0
    };
    store.set(utils.sha3(addr), cached);
  } else {
    cached = store.get(utils.sha3(addr));
  }
  const timeDiff =
    Math.round((new Date().getTime() - cached.timestamp) / 1000) / 60;
  if (timeDiff > 1) {
    const liveNonce = await fourtwentyCalls.getTransactionCount(addr);
    const liveNonceBN = new BigNumber(liveNonce);
    const cachedNonceBN = new BigNumber(cached.nonce);
    if (timeDiff > 15) {
      cached = {
        nonce: Misc.sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    } else if (liveNonceBN.isGreaterThan(cachedNonceBN)) {
      cached = {
        nonce: Misc.sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    }
    store.set(utils.sha3(addr), cached);
  }
  res(null, toPayload(payload.id, cached.nonce));
};
