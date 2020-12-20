<template>
  <div class="popover-container">
    <div v-if="hasAccounts">
      <accounts-container
        :add-wallet="addWallet"
        :accounts="accounts"
        :usd="fourtwentyPrice"
      />
    </div>
    <div v-else>
      <welcome-container :add-wallet="addWallet" />
    </div>
  </div>
</template>

<script>
/* eslint no-console:0 */
import WelcomeContainer from './containers/WelcomeContainer';
import AccountsContainer from './containers/AccountsContainer';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import BigNumber from 'bignumber.js';
import ENS from 'fourtwenty-ens';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    'welcome-container': WelcomeContainer,
    'accounts-container': AccountsContainer
  },
  data() {
    return {
      hasAccounts: false,
      accounts: [],
      fourtwentyPrice: 0
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3', 'Networks'])
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.fetchNewStore);
  },
  mounted() {
    this.fetchNewStore();
  },
  methods: {
    ...mapActions('main', ['setENS', 'setWeb3Instance', 'switchNetwork']),
    addWallet() {
      const chrome = window.chrome;
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // eslint-disable-next-line
        window.open(chrome.runtime.getURL('index.html'));
      }
    },
    fetchNewStore() {
      window.chrome.storage.sync.get(null, obj => {
        const defaultNetwork = obj.hasOwnProperty('defNetwork')
          ? this.Networks[JSON.parse(obj['defNetwork']).key][0]
          : this.Networks['FOURTWENTY'][0];
        this.switchNetwork(defaultNetwork).then(() => {
          this.setWeb3Instance().then(() => {
            this.setENS(
              new ENS(this.web3.currentProvider, this.network.type.ens.registry)
            );
          });
        });
        ExtensionHelpers.getAccounts(this.getAccountsCb);
      });
    },
    fetchFourtwentyBalance() {
      const price = fetch('https://cryptorates.mewapi.io/ticker?filter=FOURTWENTY')
        .then(res => {
          return res.json();
        })
        .catch(() => {
          return 0;
        });
      price.then(res => {
        const priceAvailable = res.hasOwnProperty('data')
          ? res.data.FOURTWENTY.quotes.USD.price
          : res;
        this.convertedBalance = `$ ${new BigNumber(priceAvailable)
          .times(this.totalBalance)
          .toFixed(2)}`;

        this.fourtwentyPrice = priceAvailable;
      });
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          return isAddress(item);
        })
        .map(item => {
          const newObj = {};
          newObj[item] = res[item];
          return newObj;
        });
      this.hasAccounts = accounts.length > 0;
      this.accounts = this.hasAccounts ? accounts : {};
      this.fetchFourtwentyBalance();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionPopup.scss';
</style>
