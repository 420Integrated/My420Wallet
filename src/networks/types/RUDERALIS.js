import tokens from '@/_generated/tokens/tokens-rud.json';
import contracts from '@/_generated/contracts/contract-abi-rud.json';
import rud from '@/assets/images/icons/network.svg';
import { RUDERALIS } from '../tlds';

export default {
  name: 'RUDERALIS',
  name_long: 'Ruderalis',
  homePage: 'https://github.com/420integrated/go-420coin/ruderalis',
  blockExplorerTX: 'https://ruderalis.fourtwentyscan.420integrated.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://ruderalis.fourtwentyscan.420integrated.com/address/[[address]]',
  chainID: 2019,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x00000000BEEFDEADC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'test',
    registrarType: 'fifs',
    supportedTld: RUD
  },
  icon: rud,
  currencyName: 'RUD'
};
