import nodeList from '@/networks';
import url from 'url';
import Web3 from 'web3';
const network = nodeList['FOURTWENTY'][0];
const hostUrl = url.parse(network.url);

const newWeb3 = new Web3(
  `${hostUrl.protocol}//${hostUrl.hostname}:${network.port}${hostUrl.pathname}`
);
const state = {
  account: {
    balance: 0,
    address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
    identifier: 'keystore',
    isHardware: false
  },
  customTokens: [
    { name: 'FOURTWENTY', balance: 200 },
    { name: 'BTH', balance: 300 },
    { name: 'ETC', balance: 400 }
  ],

  customPaths: {},
  ens: true,
  Errors: {},
  fourtwentyConationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  smokePrice: 41,
  Networks: nodeList,
  token: {
    symbol: 'ABC',
    utilizationRate: '.654234',
    user: {
      id: '123'
    }
  },
  network: {
    auth: false,
    password: '',
    port: 443,
    service: 'infura.io',
    type: {
      blockExplorerAddr: 'https://fourtwentyscan.420integrated.com/address/[[address]]',
      blockExplorerTX: 'https://fourtwentyscan.420integrated.com/tx/[[txHash]]',
      chainID: 1,
      contracts: [],
      ensResolver: '0x314159265dd8dbb310642f98f50c066173c1259b',
      homePage: 'https://420integrated.com',
      name: 'FOURTWENTY',
      name_long: 'Fourtwentycoin',
      tokens: [],
      ens: {
        registry: '0x123456789',
        registrarTLD: 'eth',
        registrarType: 'auction'
      },
      currencyName: 'FOURTWENTY'
    },
    url: 'https://mainnet.infura.io/mew'
  },
  notifications: {},
  online: true,
  Transactions: {},
  wallet: {
    getAddressString: jest.fn()
  },
  web3: newWeb3,
  rateHistory: {
    labels: []
  }
};

const actions = {
  setToken: () => {
    return true;
  },
  toggleTempHide: () => {
    return true;
  }
};

const getters = {
  token: () => {
    return {
      symbol: 'ABC',
      utilizationRate: '.654234',
      user: {
        id: '123'
      }
    };
  },
  rateHistory: () => {
    return {
      labels: []
    };
  },
  account: () => {
    return state.account;
  },
  customPaths: () => {},
  ens: () => {},
  Errors: () => {},
  fourtwentyConationAddress: () => '',
  smokePrice: () => 41,
  Networks: () => {
    return nodeList;
  },
  network: () => {
    return {
      auth: false,
      password: '',
      port: 443,
      service: 'infura.io',
      type: {
        blockExplorerAddr: 'https://fourtwentyscan.420integrated.com/address/[[address]]',
        blockExplorerTX: 'https://fourtwentyscan.420integrated.com/tx/[[txHash]]',
        chainID: 1,
        contracts: [],
        ensResolver: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        homePage: 'https://420integrated.com',
        name: 'FOURTWENTY',
        name_long: 'Fourtwentycoin',
        tokens: [],
        ens: {
          registry: '0x123456789',
          registrarTLD: 'eth',
          registrarType: 'auction'
        }
      },
      url: 'https://mainnet.infura.io/mew'
    };
  },
  notifications: () => [],
  online: () => true,
  sidemenuOpen: () => {
    return false;
  },

  customTokens: () => [
    { name: 'FOURTWENTY', balance: 200 },
    { name: 'BTH', balance: 300 },
    { name: 'ETC', balance: 400 }
  ],

  Transactions: () => {},
  wallet: () => {
    return {
      getChecksumAddressString: () =>
        '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
    };
  },
  web3: () => {
    return newWeb3;
  },
  path: () => {}
};

export { state, getters, actions };
