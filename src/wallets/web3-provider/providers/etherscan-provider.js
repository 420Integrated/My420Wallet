import FourtwentyScanRequestManger from './fourtwentyscan-request-manager';
import MiddleWare from '../middleware';
import {
  fourtwentySendTransaction,
  fourtwentySignTransaction,
  fourtwentyGetTransactionCount,
  fourtwentySign,
  fourtwentyAccounts,
  fourtwentyCoinbase,
  netVersion,
  fourtwentyGetBlockByNumber,
  fourtwentyGetTransactionReceipt,
  fourtwentyGetBlockNumber
} from '../methods';
import FourtwentyscanProxy from '../fourtwentyscan-proxy';
class FourtwentyscanProvider {
  constructor(host, options, store, eventHub) {
    this.host = host;
    this.apikey = options.apikey || 'UDJW3ARXWN9EHMTFUA2FW4V1KA7QZGAGCB';
    options.apikey = this.apikey;
    this.store = store;
    this.eventHub = eventHub;
    this.proxy = new FourtwentyscanProxy(this.host, this.apikey);
    this.requestManager_ = new FourtwentyScanRequestManger(host, options);
    this.requestThrottler = {
      requests: [],
      remaining: 5,
      timer: setInterval(() => {
        if (
          this.requestThrottler.requests.length &&
          this.requestThrottler.remaining
        ) {
          for (let i = 0; i < this.requestThrottler.remaining; i++) {
            if (this.requestThrottler.requests.length) {
              const req = this.requestThrottler.requests.shift();
              this.requestThrottler.remaining--;
              this.send_(req.payload, req.callback);
            }
          }
        }
      }, 400),
      reset: setInterval(() => {
        this.requestThrottler.remaining = 5;
      }, 5500)
    };
  }
  send(payload, callback) {
    this.requestThrottler.requests.push({ payload, callback });
  }
  send_(payload, callback) {
    const req = {
      payload,
      store: this.store,
      requestManager: this.requestManager_,
      eventHub: this.eventHub
    };
    const middleware = new MiddleWare();
    middleware.use(fourtwentySendTransaction);
    middleware.use(fourtwentySignTransaction);
    middleware.use(fourtwentyGetTransactionReceipt);
    middleware.use(fourtwentySign);
    middleware.use(fourtwentyAccounts);
    middleware.use(fourtwentyGetTransactionCount);
    middleware.use(fourtwentyCoinbase);
    middleware.use(fourtwentyGetBlockByNumber);
    middleware.use(fourtwentyGetBlockNumber);
    middleware.use(netVersion);
    middleware.use(async ({ payload }, res) => {
      this.proxy
        .request(payload)
        .then(body => {
          res(null, body);
        })
        .catch(err => {
          if (typeof err !== Error && err.error)
            err = new Error(err.error.message);
          res(err);
        });
    });
    middleware.run(req, callback).then(() => {
      callback(new Error('Fourtwentyscan doesnt support this function'));
    });
  }
  disconnect() {}
}
export default FourtwentyscanProvider;
