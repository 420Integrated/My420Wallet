import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';
if (
  window.hasOwnProperty('web3') &&
  !window.web3.currentProvider.hasOwnProperty('isMew')
) {
  const event = new CustomEvent(`web3${window.extensionID}web3Detected`);
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  console.log('injecting web3');
  window.web3 = new web3(new MEWProvider('https://mainnet.infura.io/mew'));
  window.web3.currentProvider.isMew = true;
}
