import { toPayload } from '../jsonrpc';
import FourtwentyCalls from '../web3Calls';
const WAIT_TIME = 30 * 1000; //30 seconds
const memcache = {};
export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'fourtwenty_getTransactionReceipt') return next();
  const fourtwentyCalls = new FourtwentyCalls(requestManager);
  const txHash = payload.params[0];
  if (
    !memcache[txHash] ||
    (memcache[txHash] &&
      memcache[txHash].timestamp < new Date().getTime() - WAIT_TIME)
  ) {
    try {
      const receipt = await fourtwentyCalls.getTransactionReceipt(txHash);
      memcache[txHash] = {
        timestamp: new Date().getTime(),
        receipt: JSON.stringify(receipt)
      };
      res(null, toPayload(payload.id, receipt));
    } catch (e) {
      res(null, toPayload(payload.id, null));
    }
  } else {
    res(
      null,
      toPayload(payload.id, JSON.parse(memcache[txHash].receipt) || null)
    );
  }
};
