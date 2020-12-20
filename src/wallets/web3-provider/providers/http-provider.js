import HttpRequestManger from './http-request-manager';
import MiddleWare from '../middleware';
import {
  fourtwentySendTransaction,
  fourtwentySignTransaction,
  fourtwentySign,
  fourtwentyAccounts,
  fourtwentyCoinbase,
  fourtwentyGetTransactionCount,
  fourtwentyGetTransactionReceipt,
  fourtwentyGetBlockByNumber,
  fourtwentyGetBlockNumber,
  netVersion
} from '../methods';
class HttpProvider {
  constructor(host, options, store, eventHub) {
    const requestManager = new HttpRequestManger(host, options);
    this.httpProvider = {
      send: (payload, callback) => {
        const req = {
          payload,
          store,
          requestManager,
          eventHub
        };
        const middleware = new MiddleWare();
        middleware.use(fourtwentySendTransaction);
        middleware.use(fourtwentySignTransaction);
        middleware.use(fourtwentyGetTransactionCount);
        middleware.use(fourtwentyGetTransactionReceipt);
        middleware.use(fourtwentySign);
        middleware.use(fourtwentyAccounts);
        middleware.use(fourtwentyCoinbase);
        middleware.use(fourtwentyGetBlockByNumber);
        middleware.use(fourtwentyGetBlockNumber);
        middleware.use(netVersion);
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      }
    };
    return this.httpProvider;
  }
}
export default HttpProvider;
