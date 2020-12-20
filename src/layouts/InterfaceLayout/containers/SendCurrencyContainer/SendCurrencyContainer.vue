<template>
  <div class="send-currency-container">
    <interface-container-title :title="$t('sendTx.send-tx')" />
    <div class="send-form">
      <div class="form-block amount-to-address">
        <div class="amount">
          <div class="single-input-block">
            <div class="title">
              <h4>{{ $t('sendTx.type') }}</h4>
            </div>
            <currency-picker
              :currency="tokensWithBalance"
              :page="'sendFourtwentyAndTokens'"
              :token="true"
              :default="selectedCurrency !== '' ? selectedCurrency : {}"
              @selectedCurrency="selectedCurrency = $event"
            />
          </div>
          <div class="single-input-block">
            <div class="title">
              <h4>{{ $t('sendTx.amount') }}</h4>
              <p
                class="title-button prevent-user-select"
                @click="sendEntireBalance"
              >
                {{ $t('sendTx.button-entire') }}
              </p>
            </div>
            <div class="the-form amount-number">
              <input
                v-model="toValue"
                :placeholder="$t('sendTx.amount')"
                type="number"
                min="0"
                name="value"
                step="any"
              />
              <i
                :class="[
                  !isValidAmount.valid || errors.has('value') ? 'not-good' : '',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
            <div
              v-if="!isValidAmount.valid || errors.has('value')"
              class="error-message-container"
            >
              <p>{{ isValidAmount.msg }}</p>
            </div>
          </div>
        </div>
        <div class="to-address">
          <dropdown-address-selector
            :clear-address="clearAddress"
            :title="$t('sendTx.to-addr')"
            @toAddress="getToAddress($event)"
          />
        </div>
        <div class="tx-fee">
          <div class="title">
            <h4>{{ $t('sendTx.tx-fee') }}</h4>
            <p class="copy-button prevent-user-select" @click="openSettings">
              {{ $t('common.edit') }}
            </p>
          </div>
          <div class="fee-value">
            <div class="maher">
              {{ displayedSmokePrice }}
              {{ $t('common.smoke.maher') }}
              <!--(Economic)-->
            </div>
            <div v-show="network.type.name === 'FOURTWENTY'" class="usd">
              <i18n path="sendTx.cost-fourtwenty-convert" tag="div">
                <span slot="txFeeFourtwenty">{{ txFeeFourtwenty }}</span>
                <span slot="convert">{{ convert }}</span>
              </i18n>
            </div>
          </div>
          <div v-if="showSmokeWarning" class="smoke-price-warning">
            {{ $t('errorsGlobal.high-smoke-limit-warning') }}
          </div>
        </div>
      </div>
    </div>

    <div class="send-form advanced">
      <div class="advanced-content">
        <div class="toggle-button-container">
          <h4>{{ $t('common.advanced') }}</h4>
          <div class="toggle-button">
            <span>{{ $t('sendTx.data-smoke') }}</span>
            <!-- Rounded switch -->
            <div class="sliding-switch-white">
              <label class="switch">
                <input
                  type="checkbox"
                  @click="advancedExpand = !advancedExpand"
                />
                <span class="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div
          :class="advancedExpand && 'input-container-open'"
          class="input-container"
        >
          <div class="margin-container">
            <div v-show="!isToken" class="the-form user-input">
              <p>{{ $t('sendTx.add-data') }}</p>
              <input
                v-model="toData"
                :placeholder="$t('sendTx.ph-add-data')"
                type="text"
                autocomplete="off"
              />
              <i
                :class="[
                  isValidData ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
            <div class="the-form user-input">
              <p>{{ $t('common.smoke.limit') | capitalize }}</p>
              <input
                v-model="smokeLimit"
                :placeholder="$t('common.smoke.limit')"
                type="number"
                min="0"
                name
              />
              <i
                :class="[
                  isValidSmokeLimit ? '' : 'not-good',
                  'fa fa-check-circle good-button'
                ]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit-button-container">
      <div
        :class="[
          validInputs ? '' : 'disabled',
          'submit-button large-round-button-green-filled'
        ]"
        @click="submitTransaction"
      >
        {{ $t('sendTx.send-tx') }}
      </div>
      <div class="clear-all-btn" @click="clear()">
        {{ $t('common.clear-all') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import CurrencyPicker from '../../components/CurrencyPicker';
import { Transaction } from 'fourtwentyjs-tx';
import { Misc, Toast } from '@/helpers';
import BigNumber from 'bignumber.js';
import fourtwentyUnit from 'fourtwentyjs-unit';
import utils from 'web3-utils';
import fetch from 'node-fetch';
import DropDownAddressSelector from '@/components/DropDownAddressSelector';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'currency-picker': CurrencyPicker,
    'dropdown-address-selector': DropDownAddressSelector
  },
  props: {
    checkPrefilled: {
      type: Function,
      default: () => {}
    },
    clearPrefilled: {
      type: Function,
      default: () => {}
    },
    isPrefilled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: '0'
    },
    data: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    smokelimit: {
      type: String,
      default: ''
    },
    smoke: {
      type: Number,
      default: 0
    },
    tokensymbol: {
      type: String,
      default: ''
    },
    tokensWithBalance: {
      type: Array,
      default: function () {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      advancedExpand: false,
      isValidAddress: false,
      hexAddress: '',
      address: '',
      toValue: '0',
      smokeLimit: '21000',
      toData: '',
      selectedCurrency: '',
      fourtwentyPrice: 0,
      clearAddress: false
    };
  },

  computed: {
    ...mapState('main', [
      'account',
      'smokePrice',
      'web3',
      'network',
      'linkQuery',
      'online',
      'smokeLimitWarning'
    ]),
    currency() {
      return this.selectedCurrency.symbol;
    },
    showSmokeWarning() {
      return this.smokePrice >= this.smokeLimitWarning;
    },
    txFee() {
      return new BigNumber(fourtwentyUnit.toWei(this.smokePrice, 'maher')).times(
        this.smokeLimit || 0
      );
    },
    txFeeFourtwenty() {
      if (new BigNumber(this.txFee).gt(0)) {
        return fourtwentyUnit.fromWei(this.txFee, '420coin');
      }
      return 0;
    },
    isValidAmount() {
      const notEnoughSmokeMsg =
        this.$t('errorsGlobal.not-valid-amount-total') +
        ' Smoke ' +
        this.$t('errorsGlobal.to-send');
      const notEnoughTokenMsg =
        this.$t('errorsGlobal.not-valid-amount-total') +
        ' ' +
        this.selectedCurrency.symbol +
        ' ' +
        this.$t('errorsGlobal.to-send');
      const notEnoughCurrencyMsg =
        this.$t('errorsGlobal.not-valid-amount-total') +
        ' ' +
        this.network.type.currencyName +
        ' ' +
        this.$t('errorsGlobal.to-send');
      const invalidValueMsg = this.$t('errorsGlobal.invalid-value');
      const enoughTokenBalance = new BigNumber(this.toValue).lte(
        this.selectedCurrency.balance
      );
      const enoughCurrency = new BigNumber(this.toValue)
        .plus(this.txFeeFourtwenty)
        .lte(this.balanceDefault);
      const enoughSmoke = new BigNumber(this.txFeeFourtwenty).lte(this.balanceDefault);
      const validDecimal = this.isValidDecimals;
      if (new BigNumber(this.toValue).lt(0)) {
        return {
          msg: invalidValueMsg,
          valid: false
        };
      }
      if (this.isToken) {
        const enoughBalance = enoughTokenBalance && enoughSmoke && validDecimal;
        return {
          valid: enoughBalance,
          msg: enoughBalance
            ? ''
            : !enoughTokenBalance
            ? notEnoughTokenMsg
            : !enoughSmoke
            ? notEnoughSmokeMsg
            : invalidValueMsg
        };
      }
      return {
        valid: enoughCurrency && validDecimal,
        msg: enoughCurrency
          ? ''
          : !enoughCurrency
          ? notEnoughCurrencyMsg
          : invalidValueMsg
      };
    },
    isValidDecimals() {
      const decimals = (this.toValue + '').split('.')[1];
      if (!decimals) return true;
      if (this.isToken) {
        return decimals.length <= this.selectedCurrency.decimals;
      }
      return decimals.length <= 18;
    },
    isValidData() {
      return Misc.validateHexString(this.toData);
    },
    isValidSmokeLimit() {
      return new BigNumber(this.smokeLimit).gte(0);
    },
    balanceDefault() {
      return new BigNumber(fourtwentyUnit.fromWei(this.account.balance, '420coin'));
    },
    validInputs() {
      return (
        this.isValidAmount.valid &&
        this.isValidAddress &&
        new BigNumber(this.smokeLimit).gte(0) &&
        Misc.validateHexString(this.toData)
      );
    },
    isToken() {
      const symbol = this.network.type.currencyName;
      return this.selectedCurrency.symbol !== symbol;
    },
    txData() {
      if (this.isToken) {
        return this.getTokenTransferABI(
          this.toValue,
          this.selectedCurrency.decimals
        );
      }
      return Misc.sanitizeHex(this.toData);
    },
    txValue() {
      if (this.isToken) {
        return '0x00';
      }
      return Misc.sanitizeHex(
        fourtwentyUnit.toWei(this.toValue, '420coin').toString(16)
      );
    },
    txTo() {
      return this.isToken
        ? this.selectedCurrency.address.toLowerCase()
        : this.hexAddress.toLowerCase().trim();
    },
    multiWatch() {
      return (
        this.toValue,
        this.isValidAddress,
        this.toData,
        this.selectedCurrency,
        new Date().getTime() / 1000
      );
    },
    convert() {
      if (this.fourtwentyPrice) {
        return new BigNumber(
          new BigNumber(this.txFeeFourtwenty).times(new BigNumber(this.fourtwentyPrice))
        )
          .toFixed(2)
          .toString();
      }
      return '--';
    },
    displayedSmokePrice() {
      const newVal = this.smokePrice.toString();
      const showMore = `~${new BigNumber(newVal).toString()}`;
      const showSome = `~${new BigNumber(newVal).toFixed(2).toString()}`;
      return newVal.includes('.')
        ? new BigNumber(newVal).lt(1)
          ? showMore
          : showSome
        : newVal;
    }
  },
  watch: {
    multiWatch: utils._.debounce(function () {
      if (this.validInputs) this.estimateSmoke();
    }, 500),
    network(newVal) {
      if (this.online && newVal.type.name === 'FOURTWENTY') this.getFourtwentyPrice();
    },
    isPrefilled() {
      this.prefillForm();
    }
  },
  mounted() {
    this.checkPrefilled();
    if (this.online && this.network.type.name === 'FOURTWENTY') this.getFourtwentyPrice();
  },
  methods: {
    clear() {
      this.toData = '';
      this.toValue = '0';
      this.hexAddress = '';
      this.address = '';
      this.smokeLimit = '21000';
      this.isValidAddress = false;
      this.advancedExpand = false;
      this.clearAddress = !this.clearAddress;
      this.selectedCurrency = {
        name: this.network.type.name_long,
        symbol: this.network.type.currencyName
      };
    },
    getToAddress(data) {
      this.address = data.address;
      this.hexAddress = data.address;
      this.isValidAddress = data.valid;
    },
    prefillForm() {
      if (this.isPrefilled) {
        const foundToken = this.tokensymbol
          ? this.tokensWithBalance.find(item => {
              return (
                item.symbol.toLowerCase() === this.tokensymbol.toLowerCase()
              );
            })
          : undefined;

        this.toData = Misc.validateHexString(this.data) ? this.data : '';
        this.toValue = this.value;
        this.hexAddress = this.to;
        this.address = this.to;
        this.smokeLimit = new BigNumber(this.smokelimit).toString();

        this.selectedCurrency = foundToken ? foundToken : this.selectedCurrency;
        this.advancedExpand = true;
        Toast.responseHandler(
          'Form has been prefilled. Please proceed with caution!',
          Toast.WARN
        );
        this.clearPrefilled();
      }
    },
    openSettings() {
      this.$eventHub.$emit('open-settings');
    },
    sendEntireBalance() {
      if (this.isToken) this.toValue = this.selectedCurrency.balance;
      else
        this.toValue =
          this.balanceDefault > 0
            ? this.balanceDefault.minus(
                fourtwentyUnit.fromWei(
                  new BigNumber(fourtwentyUnit.toWei(this.smokePrice, 'maher'))
                    .times(this.smokeLimit)
                    .toString(),
                  '420coin'
                )
              )
            : 0;
    },
    getTokenTransferABI(amount, decimals) {
      const jsonInterface = [
        {
          constant: false,
          inputs: [
            { name: '_to', type: 'address' },
            { name: '_amount', type: 'uint256' }
          ],
          name: 'transfer',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ];
      const contract = new this.web3.fourtwenty.Contract(jsonInterface);
      return contract.methods
        .transfer(
          this.hexAddress.toLowerCase(),
          new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
        )
        .encodeABI();
    },
    async estimateSmoke() {
      const coinbase = await this.web3.fourtwenty.getCoinbase();
      const params = {
        from: coinbase,
        value: this.txValue,
        to: this.txTo,
        smokePrice: Misc.sanitizeHex(
          fourtwentyUnit.toWei(this.smokePrice, 'maher').toString(16)
        ),
        data: this.txData
      };

      this.web3.fourtwenty
        .estimateSmoke(params)
        .then(smokeLimit => {
          this.smokeLimit = smokeLimit;
        })
        .catch(err => {
          this.smokeLimit = -1;
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    async submitTransaction() {
      window.scrollTo(0, 0);
      try {
        const coinbase = await this.web3.fourtwenty.getCoinbase();
        const nonce = await this.web3.fourtwenty.getTransactionCount(coinbase);
        const raw = {
          nonce: Misc.sanitizeHex(new BigNumber(nonce).toString(16)),
          smokeLimit: Misc.sanitizeHex(new BigNumber(this.smokeLimit).toString(16)),
          to: this.txTo,
          value: this.txValue,
          data: this.txData
        };
        const _tx = new Transaction(raw);
        const json = _tx.toJSON(true);
        json.from = coinbase;
        this.web3.fourtwenty.sendTransaction(json).catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
        this.clear();
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    async getFourtwentyPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=FOURTWENTY'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.fourtwentyPrice =
        typeof price === 'object' ? price.data.FOURTWENTY.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SendCurrencyContainer.scss';
</style>
