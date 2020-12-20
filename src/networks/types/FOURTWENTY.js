import tokens from '@/_generated/tokens/tokens-fourtwenty.json';
import contracts from '@/_generated/contracts/contract-abi-fourtwenty.json';
import fourtwenty from '@/assets/images/networks/fourtwenty-logo.svg';
import { FOURTWENTY } from '../tlds';

export default {
  name: 'FOURTWENTY',
  name_long: '420coin',
  homePage: 'https://420integrated.org',
  blockExplorerTX: 'https://fourtwentyscan.420integrated.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://fourtwentyscan.420integrated.com/address/[[address]]',
  chainID: 2020,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x0000000DEADBEEF74eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: '420',
    registrarType: 'permanent',
    supportedTld: 420
  },
  icon: 420,
  currencyName: '420coin'
};
