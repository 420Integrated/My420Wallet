import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import FourtwentyscanProxy from '../fourtwentyscan-proxy';
class FourtwentyscanRequestManager {
  constructor(host, options) {
    this.host = host;
    this.apikey = options.apikey;
    this.proxy = new FourtwentyscanProxy(this.host, this.apikey);
    return new Web3RequestManager(this);
  }
  send(payload, callback) {
    const req = {
      payload
    };
    const middleware = new MiddleWare();
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
export default FourtwentyscanRequestManager;
