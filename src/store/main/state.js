import nodeList from '@/networks';
import darklist from '@/_generated/address-darklist/address-darklist.json';
import store from 'store';
import { MEW_CX } from '@/builds/configs/types';
if (store.get('notifications') === undefined) store.set('notifications', {});
const gettingStartedDone =
  store.get('skipTutorial') !== undefined ? store.get('skipTutorial') : false;
const storedNetwork = store.get('network');
let network = nodeList['FOURTWENTY'][0];
if (BUILD_TYPE !== MEW_CX && storedNetwork !== undefined) {
  network = storedNetwork;
  if (storedNetwork.type.name !== 'CUS') {
    const iteratableArr = nodeList[storedNetwork.type.name];
    network = storedNetwork;
    network.type = nodeList[storedNetwork.type.name][0].type;
    for (let index = 0; index < iteratableArr.length; index++) {
      if (storedNetwork.service === iteratableArr[index].service) {
        network = iteratableArr[index];
        break;
      }
    }
  }
}

const addressBook =
  store.get('addressBook') !== undefined ? store.get('addressBook') : [];
const notifications =
  store.get('notifications') !== undefined ? store.get('notifications') : {};
const smokePrice =
  store.get('smokePrice') !== undefined ? store.get('smokePrice') : 41;
const customPaths =
  store.get('customPaths') !== undefined ? store.get('customPaths') : {};
const state = {
  account: {
    balance: 0,
    address: null,
    isHardware: false,
    identifier: '',
    nickname: ''
  },
  customPaths: customPaths,
  ens: null,
  Errors: {},
  fourtwentyConationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  smokePrice: smokePrice,
  Networks: nodeList,
  network: network,
  notifications: notifications,
  path: '',
  online: true,
  transactions: {},
  wallet: null,
  web3: {},
  sidemenuOpen: false,
  darklist: darklist,
  gettingStartedDone: gettingStartedDone,
  blockNumber: 0,
  linkQuery: {},
  addressBook: addressBook,
  locale: store.get('locale') !== undefined ? store.get('locale') : 'en_US',
  tempHide: false,
  smokeLimitWarning: 250,
  fourtwentySmokePrice: 0
};

export default state;
