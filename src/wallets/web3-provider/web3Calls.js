import Method from 'web3-core-method';
import utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
class Web3Calls {
  constructor(requestManager) {
    const fourtwentycoinCalls = [
      new Method({
        name: 'getId',
        call: 'net_version',
        params: 0,
        outputFormatter: utils.hexToNumber
      }),
      new Method({
        name: 'getSmokePrice',
        call: 'fourtwenty_smokePrice',
        params: 0
      }),
      new Method({
        name: 'getBlockNumber',
        call: 'fourtwenty_blockNumber',
        params: 0
      }),
      new Method({
        name: 'getBlockByNumber',
        call: 'fourtwenty_getBlockByNumber',
        params: 2
      }),
      new Method({
        name: 'estimateSmoke',
        call: 'fourtwenty_estimateSmoke',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.hexToNumber
      }),
      new Method({
        name: 'sendSignedTransaction',
        call: 'fourtwenty_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
      }),
      new Method({
        name: 'getTransactionReceipt',
        call: 'fourtwenty_getTransactionReceipt',
        params: 1,
        inputFormatter: [null]
      }),
      new Method({
        name: 'getTransactionCount',
        call: 'fourtwenty_getTransactionCount',
        params: 2,
        inputFormatter: [
          function (address) {
            if (utils.isAddress(address.toLowerCase())) {
              return address;
            }
            throw new Error(
              'Address ' +
                address +
                ' is not a valid address to get the "transactionCount".'
            );
          },
          function () {
            return 'latest';
          }
        ]
      })
    ];
    this.fourtwentycoinCalls = {};
    fourtwentycoinCalls.forEach(call => {
      call.attachToObject(this.fourtwentycoinCalls);
      call.setRequestManager(requestManager);
    });
    return this.fourtwentycoinCalls;
  }
}
export default Web3Calls;
