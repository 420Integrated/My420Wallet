import unit from 'fourtwentyjs-unit';
import FourtwentyCalls from '../web3Calls';
import { WEB3_WALLET } from '../../bip44/walletTypes';
import { toPayload } from '../jsonrpc';
import EventNames from '../events';
import { getSanitizedTx } from './utils';
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'fourtwenty_signTransaction') return next();
  const tx = payload.params[0];
  const localTx = Object.assign({}, payload);
  delete localTx['smoke'];
  delete localTx['nonce'];
  const fourtwentyCalls = new FourtwentyCalls(requestManager);
  tx.nonce = !tx.nonce
    ? await store.state.web3.fourtwenty.getTransactionCount(
        store.state.wallet.getAddressString()
      )
    : tx.nonce;
  tx.smoke = !tx.smoke ? await fourtwentyCalls.estimateSmoke(localTx) : tx.smoke;
  tx.chainId = !tx.chainId ? store.state.network.type.chainID : tx.chainId;
  tx.smokePrice = !tx.smokePrice
    ? unit.toWei(store.state.smokePrice, 'maher').toString()
    : tx.smokePrice;
  getSanitizedTx(tx)
    .then(_tx => {
      if (store.state.wallet.identifier === WEB3_WALLET) {
        res(new Error('web3 wallets doesnt support fourtwenty_signTransaction'));
      } else {
        if (_tx.hasOwnProperty('generateOnly')) {
          eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, toPayload(payload.id, _response));
          });
        } else {
          eventHub.$emit(EventNames.SHOW_TX_CONFIRM_MODAL, _tx, _response => {
            res(null, _response);
          });
        }
      }
    })
    .catch(e => {
      res(e);
    });
};
