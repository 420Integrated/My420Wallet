import axios from 'axios';
import { toPayload } from './jsonrpc';

const toQueryString = params => {
  return Object.keys(params)
    .map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');
};
class FourtwentyscanProxy {
  constructor(url, apikey) {
    this.url = url;
    this.apikey = apikey;
  }
  fourtwentyscanXHR(isGET, params) {
    return new Promise((resolve, reject) => {
      Object.keys(params).forEach(
        key => params[key] === undefined && delete params[key]
      );
      const qString = isGET
        ? '?' + toQueryString(Object.assign(params, { apikey: this.apikey }))
        : '';
      axios({
        method: isGET ? 'get' : 'post',
        data: isGET ? {} : params,
        url: this.url + qString
      })
        .then(res => {
          if (!res.data.error) resolve(res.data);
          else reject(res.data);
        })
        .catch(reject);
    });
  }
  request(payload) {
    return new Promise((resolve, reject) => {
      switch (payload.method) {
        case 'fourtwenty_blockNumber':
          this.fourtwentyscanXHR(true, {
            module: 'proxy',
            action: 'fourtwenty_blockNumber'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getBlockByNumber':
          this.fourtwentyscanXHR(true, {
            module: 'proxy',
            action: 'fourtwenty_getBlockByNumber',
            tag: payload.params[0],
            boolean: payload.params[1]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getBlockTransactionCountByNumber':
          this.fourtwentyscanXHR(true, 'fourtwenty_getBlockTransactionCountByNumber', {
            module: 'proxy',
            action: 'fourtwenty_getBlockTransactionCountByNumber',
            tag: payload.params[0]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getTransactionByHash':
          this.fourtwentyscanXHR(true, {
            module: 'proxy',
            action: 'fourtwenty_getTransactionByHash',
            txhash: payload.params[0]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getBalance':
          this.fourtwentyscanXHR(true, {
            module: 'account',
            action: 'balance',
            address: payload.params[0],
            tag: payload.params[1]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_call':
          Object.keys(payload.params[0]).forEach(key =>
            payload.params[0][key] === undefined
              ? delete payload.params[0][key]
              : ''
          );
          this.fourtwentyscanXHR(
            true,
            Object.assign(payload.params[0], {
              module: 'proxy',
              action: 'fourtwenty_call'
            })
          )
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_estimateSmoke':
          this.fourtwentyscanXHR(
            true,
            Object.assign(
              {
                module: 'proxy',
                action: 'fourtwenty_estimateSmoke'
              },
              payload.params[0]
            )
          )
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_sendRawTransaction':
          this.fourtwentyscanXHR(true, {
            hex: payload.params[0],
            module: 'proxy',
            action: 'fourtwenty_sendRawTransaction'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getTransactionReceipt':
          this.fourtwentyscanXHR(true, {
            txhash: payload.params[0],
            module: 'proxy',
            action: 'fourtwenty_getTransactionReceipt'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getTransactionCount':
          this.fourtwentyscanXHR(true, {
            address: payload.params[0],
            tag: payload.params[1],
            module: 'proxy',
            action: 'fourtwenty_getTransactionCount'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_smokePrice':
          this.fourtwentyscanXHR(true, {
            module: 'proxy',
            action: 'fourtwenty_smokePrice'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getCode':
          this.fourtwentyscanXHR(true, {
            address: payload.params[0],
            tag: payload.params[1],
            module: 'proxy',
            action: 'fourtwenty_getCode'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'fourtwenty_getStorageAt':
          this.fourtwentyscanXHR(true, {
            address: payload.params[0],
            position: payload.params[1],
            tag: payload.params[2],
            module: 'proxy',
            action: 'fourtwenty_getStorageAt'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        default:
          reject(new Error('Not supported'));
      }
    });
  }
}
export default FourtwentyscanProxy;
