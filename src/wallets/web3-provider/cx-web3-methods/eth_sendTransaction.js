import eventHandler from './eventHandler';
import { toPayload } from '../jsonrpc';
import { getSanitizedTx } from '../methods/utils';

import {
  WEB3_SEND_TX,
  WEB3_RECEIVE_TX_HASH,
  WEB3_REJECT,
  WEB3_QUERY_SMOKEPRICE,
  WEB3_RECEIVE_SMOKEPRICE,
  WEB3_GET_TX_COUNT,
  WEB3_RECEIVE_TX_COUNT,
  WEB3_GET_SMOKE,
  WEB3_RECEIVE_SMOKE
} from '@/builds/mewcx/cxHelpers/cxEvents.js';

export default async ({ payload }, res, next) => {
  if (payload.method !== 'fourtwenty_sendTransaction') return next();
  const id = window.extensionID;
  const tx = Object.assign({}, payload.params[0]);
  const eventName = WEB3_SEND_TX.replace('{{id}}', id);
  const resolveName = WEB3_RECEIVE_TX_HASH.replace('{{id}}', id);
  const rejectName = WEB3_REJECT.replace('{{id}}', id);
  const web3QuerySmokePrice = WEB3_QUERY_SMOKEPRICE.replace('{{id}}', id);
  const web3ReceiveSmokePrice = WEB3_RECEIVE_SMOKEPRICE.replace('{{id}}', id);
  const web3GetNonce = WEB3_GET_TX_COUNT.replace('{{id}}', id);
  const web3ReceiveNonce = WEB3_RECEIVE_TX_COUNT.replace('{{id}}', id);
  const web3GetSmoke = WEB3_GET_SMOKE.replace('{{id}}', id);
  const web3ReceiveSmoke = WEB3_RECEIVE_SMOKE.replace('{{id}}', id);

  const smokePrice = await eventHandler(
    web3QuerySmokePrice,
    {},
    web3ReceiveSmokePrice,
    rejectName
  );
  const nonce = await eventHandler(
    web3GetNonce,
    {
      detail: {
        from: tx.from
      }
    },
    web3ReceiveNonce,
    rejectName
  );
  const smoke = await eventHandler(
    web3GetSmoke,
    {
      detail: {
        tx: tx
      }
    },
    web3ReceiveSmoke,
    rejectName
  );

  tx.smokePrice = tx.smokePrice ? tx.smokePrice : smokePrice;
  try {
    tx.nonce = !tx.nonce ? await nonce : tx.nonce;
    tx.smoke = !tx.smoke ? smoke : tx.smoke;
  } catch (e) {
    res(e);
    return;
  }

  getSanitizedTx(tx)
    .then(_tx => {
      const obj = {
        detail: {
          tx: _tx
        }
      };

      eventHandler(eventName, obj, resolveName, rejectName)
        .then(response => {
          res(null, toPayload(payload.id, response.payload));
        })
        .catch(e => {
          res(e);
        });
    })
    .catch(e => {
      res(e);
    });
};
