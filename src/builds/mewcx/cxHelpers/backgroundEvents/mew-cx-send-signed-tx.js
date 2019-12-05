/* eslint-disable no-undef */
import { CX_SEND_SIGNED_TX } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, callback, next) => {
  if (event !== CX_SEND_SIGNED_TX) return next();
  console.log('gets here');
  let funcHash = '';
  let errored = false;
  const listenerFunc = () => {
    if (errored) {
      chrome.tabs.create({
        url: 'https://github.com/MyEtherWallet/MyEtherWallet/issues/new'
      });
    } else {
      chrome.tabs.create({
        url: store.state.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          funcHash
        )
      });
    }
  };
  console.log('calls the thing');
  store.state.web3.eth
    .sendSignedTransaction(payload.signedTx)
    .once('transactionHash', hash => {
      funcHash = hash;
      console.log('gets here with hash', hash);
      store.dispatch('addNotification', [
        'Hash',
        payload.raw.from,
        payload.raw,
        hash
      ]);
      callback(hash);
    })
    .once('receipt', res => {
      errored = false;
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Transaction confirmed!',
        message: `Transaction with hash ${res.blockHash} has been mined!`
      });
      store.dispatch('addNotification', [
        'Receipt',
        payload.raw.from,
        payload.raw,
        res
      ]);
    })
    .on('error', err => {
      errored = true;
      funcHash = '';
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Something went wrong!',
        message: `Your transaction with hash ${funcHash} failed with error: ${err}`
      });
      store.dispatch('addNotification', [
        'Error',
        payload.raw.from,
        payload.raw,
        err
      ]);
    });
  chrome.notifications.onClicked.addListener(listenerFunc);
};
