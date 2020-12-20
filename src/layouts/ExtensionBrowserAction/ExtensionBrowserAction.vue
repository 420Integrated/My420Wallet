<template>
  <div class="cx-container">
    <wallet-side-menu class="side-menu" />
    <div class="max-width-limit">
      <keep-alive>
        <router-view
          :fourtwenty-price="fourtwentyPrice"
          :token-prices="tokenPrices"
          :wallets="wallets"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import WalletSideMenu from './components/WalletSideMenu';
import { Toast, ExtensionHelpers } from '@/helpers';
import { mapState, mapActions } from 'vuex';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'wallet-side-menu': WalletSideMenu
  },
  data() {
    return {
      fourtwentyPrice: 0,
      tokenPrices: {},
      wallets: []
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'Networks'])
  },
  created() {
    window.chrome.storage.onChanged.addListener(this.fetchNewStore);
  },
  mounted() {
    this.getFourtwentyPrice();
    this.getTokenPrices();
    this.fetchNewStore();
  },
  destroyed() {
    window.chrome.storage.onChanged.addListener(this.fetchNewStore);
  },
  methods: {
    ...mapActions('main', ['switchNetwork', 'setWeb3Instance', 'setSmokePrice']),
    fetchAccountFromStore() {
      ExtensionHelpers.getAccounts(this.getAccountsCb);
    },
    fetchNewStore(changes) {
      const relevantChange = changes
        ? Object.keys(changes).find(item => {
            return item === 'defNetwork' || isAddress(item);
          })
        : true;
      if (relevantChange) {
        window.chrome.storage.sync.get(null, obj => {
          const defaultNetwork = obj.hasOwnProperty('defNetwork')
            ? this.Networks[JSON.parse(obj['defNetwork']).key][0]
            : this.Networks['FOURTWENTY'][0];
          this.switchNetwork(defaultNetwork).then(() => {
            this.setWeb3Instance().then(() => {
              this.web3.fourtwenty.getSmokePrice().then(res => {
                this.setSmokePrice(
                  this.web3.utils.fromWei(new BigNumber(res).toString(), 'maher')
                );
              });
            });
          });
          this.fetchAccountFromStore();
        });
      }
    },
    getAccountsCb(res) {
      const accounts = Object.keys(res)
        .filter(item => {
          if (isAddress(item)) {
            return item;
          }
        })
        .map(item => {
          const newObj = Object.assign(
            {},
            { address: toChecksumAddress(item), wallet: res[item] }
          );

          return newObj;
        });
      this.wallets = accounts.slice();
    },
    getFourtwentyPrice() {
      try {
        fetch('https://cryptorates.mewapi.io/ticker?filter=FOURTWENTY')
          .then(res => {
            res
              .json()
              .then(response => {
                if (response.error) {
                  this.fourtwentyPrice = 0;
                } else {
                  this.fourtwentyPrice = response.data.FOURTWENTY.quotes.USD.price;
                }
              })
              .catch(() => {
                Toast.responseHandler(
                  this.$t('mewcx.trouble-fetching-fourtwenty'),
                  Toast.ERROR
                );
              });
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(this.$t('mewcx.trouble-fetching'), Toast.ERROR);
      }
    },
    getTokenPrices() {
      try {
        fetch('https://cryptorates.mewapi.io/ticker')
          .then(res => {
            res
              .json()
              .then(response => {
                if (response.error) {
                  this.tokenPrices = {};
                } else {
                  this.tokenPrices = Object.assign({}, response.data);
                }
              })
              .catch(() => {
                Toast.responseHandler(
                  this.$t('mewcx.trouble-fetching'),
                  Toast.ERROR
                );
              });
          })
          .catch(e => {
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(this.$t('mewcx.trouble-fetching'), Toast.ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cx-container {
  background-color: #f2f4fa;
  min-height: calc(100vh - 64px);
  min-width: 960px;
  position: relative;
  width: 100%;
}

.max-width-limit {
  max-width: 1055px;
  margin: 0 auto;
  height: 100%;
}

.side-menu {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 1;
}
</style>
