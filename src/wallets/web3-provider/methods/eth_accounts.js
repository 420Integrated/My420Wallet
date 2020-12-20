import { toPayload } from '../jsonrpc';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'fourtwenty_accounts') return next();
  res(null, toPayload(payload.id, [store.state.wallet.getAddressString()]));
};
