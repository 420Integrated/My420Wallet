import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import {
  fourtwentySendTransaction,
  fourtwentySign,
  fourtwentySignTransaction,
  fourtwentyGetTransactionCount
} from '../methods';
class GivenProvider {
  constructor(host, options, store, eventHub) {
    this.givenProvider = Object.assign({}, host);
    const requestManager = new Web3RequestManager(host);
    options = options ? options : null;
    if (this.givenProvider.sendAsync) {
      this.givenProvider.send = this.givenProvider.sendAsync;
      delete this.givenProvider.sendAsync;
    }
    this.givenProvider.send_ = this.givenProvider.send;
    delete this.givenProvider.send;
    this.givenProvider.send = (payload, callback) => {
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
      middleware.use(fourtwentySign);
      middleware.run(req, callback).then(() => {
        this.givenProvider.send_(payload, callback);
      });
    };
    return this.givenProvider;
  }
}
export default GivenProvider;
