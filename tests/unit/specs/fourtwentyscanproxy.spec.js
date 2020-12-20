import FourtwentyscanProxy from '@/wallets/web3-provider/fourtwentyscan-proxy';
const SERVERURL = 'https://api.fourtwentyscan.420integrated.com/api';
const API_KEY = 'DSH5B24BQY**TO*DO**CDY3SAQSS6ZAU175';

describe('FourtwentyScan Proxy', () => {
  it('should respond correct json rpc', async () => {
    // eslint-disable-next-line no-undef
    if (WITH_NETWORK) {
      expect.assertions(3);
      const fourtwentyProxy = new FourtwentyscanProxy(SERVERURL, API_KEY);
      await fourtwentyProxy
        .request({
          method: 'fourtwenty_blockNumber',
          id: 5,
          jsonrpc: '2.0'
        })
        .then(resp => {
          expect(resp.id).toEqual(5);
          expect(resp.jsonrpc).toEqual('2.0');
          expect(resp.result.substr(0, 2)).toEqual('0x');
        });
    } else {
      expect.assertions(0);
    }
  });
});
