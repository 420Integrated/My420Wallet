<template>
  <div id="app">
    <logout-warning-modal ref="logoutWarningModal" />
    <header-container />
    <router-view />
    <footer-container />
    <confirmation-container />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer';
import HeaderContainer from '@/containers/HeaderContainer';
import ConfirmationContainer from '@/containers/ConfirmationContainer';
import LogoutWarningModal from '@/components/LogoutWarningModal';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';

import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    'footer-container': FooterContainer,
    'header-container': HeaderContainer,
    'confirmation-container': ConfirmationContainer,
    'logout-warning-modal': LogoutWarningModal
  },
  computed: {
    ...mapState('main', ['wallet', 'Networks', 'web3'])
  },
  watch: {
    $route(to, from) {
      if (
        !from.meta.hasOwnProperty('requiresAuth') &&
        to.meta.hasOwnProperty('requiresAuth') &&
        this.wallet !== null
      ) {
        this.$refs.logoutWarningModal.$refs.logoutWarningModal.show();
      }
    }
  },
  created() {
    const _self = this;
    window.chrome.storage.sync.get(null, item => {
      if (item.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(item['defNetwork']);
        let network = {};
        if (networkProps.hasOwnProperty('url')) {
          network = _self.Networks[networkProps.key][0];
          window.chrome.storage.sync.set(
            {
              defNetwork: JSON.stringify({
                key: network.type.name,
                service: network.service
              })
            },
            () => {}
          );
        } else {
          network = _self.Networks[networkProps.key][0];
          window.chrome.storage.sync.set({
            defNetwork: JSON.stringify({
              key: network.type.name,
              service: network.service
            })
          });
        }
        _self.switchNetwork(network).then(() => {
          _self.setWeb3Instance().then(() => {
            _self.web3.fourtwenty.getSmokePrice().then(res => {
              _self.setSmokePrice(
                utils.fromWei(new BigNumber(res).toString(), 'maher')
              );
            });
          });
        });
      } else {
        _self.setWeb3Instance().then(() => {
          _self.web3.fourtwenty.getSmokePrice().then(res => {
            _self.setSmokePrice(
              utils.fromWei(new BigNumber(res).toString(), 'maher')
            );
          });
        });
      }
    });
  },
  mounted() {
    this.$refs.logoutWarningModal.$refs.logoutWarningModal.$on('hidden', () => {
      window.scrollTo(0, 0);
    });
  },
  methods: {
    ...mapActions('main', ['setWeb3Instance', 'switchNetwork', 'setSmokePrice'])
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/Global-tablet';
@import '~@/scss/Global-mobile';

@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomForms-tablet';
@import '~@/scss/CustomForms-mobile';

@import '~@/scss/CustomModal-desktop';
@import '~@/scss/CustomModal-tablet';
@import '~@/scss/CustomModal-mobile';
</style>
