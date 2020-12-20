<template>
  <div class="modal-container">
    <b-modal
      ref="manageFundsModal"
      :title="
        manageFundsText === 'Add'
          ? $t('dappsAmbrpay.manage-funds.add-funds')
          : $t('dappsAmbrpay.manage-funds.withdraw-funds')
      "
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="balance-container">
          <span class="funds-txt">{{
            $t('dappsAmbrpay.manage-funds.avail-balance')
          }}</span>
          <div>
            <p class="funds-txt">
              {{ availableBalanceFourtwenty }} {{ $t('common.currency.fourtwenty') }}
            </p>
            <p class="text-right">${{ availableBalanceUsd }}</p>
          </div>
        </div>
        <hr />
        <div v-if="actionStep" class="action-container">
          <p class="funds-txt">
            {{
              manageFundsText === 'Add'
                ? $t('dappsAmbrpay.manage-funds.how-much-fourtwenty-add')
                : $t('dappsAmbrpay.manage-funds.how-much-fourtwenty-withdraw')
            }}
          </p>
          <span class="fourtwenty-text">{{ $t('common.currency.fourtwenty') }}</span>
          <input v-model="fourtwentyAmount" class="mt-3" type="number" />
          <p v-show="errMsg" class="err-msg pl-2">{{ errMsg }}</p>
        </div>
        <div v-if="!actionStep" class="confirmation-container">
          <i class="check-icon fa fa-check" aria-hidden="true" />
          <p v-if="manageFundsText === 'Add'" class="mr-5 ml-5 mt-3 mb-1">
            {{ $t('dappsAmbrpay.manage-funds.subscription-fund') }}
            <span class="mew-txt">{{ fourtwentyAmount }}</span>
            {{ $t('dappsAmbrpay.manage-funds.should-update') }}
          </p>
          <p v-if="manageFundsText === 'Withdraw'" class="mr-5 ml-5 mt-2">
            {{ $t('dappsAmbrpay.manage-funds.withdraw-fund') }}
            <span class="mew-txt">{{ fourtwentyAmount }}</span>
            {{ $t('dappsAmbrpay.manage-funds.should-update') }}
          </p>
        </div>
        <div class="btn-container">
          <button
            :class="errMsg || !fourtwentyAmount ? 'disabled' : ''"
            class="mew-btn mt-4 mb-4"
            @click="onClick()"
          >
            {{ actionStep ? manageFundsText : $t('common.ok') }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  props: {
    manageFundsText: {
      type: String,
      default: ''
    },
    availableBalanceFourtwenty: {
      type: String,
      default: ''
    },
    availableBalanceUsd: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      actionStep: true,
      fourtwentyAmount: 0,
      errMsg: ''
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account'])
  },
  watch: {
    manageFundsText(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fourtwentyAmount = 0;
        this.errMsg = '';
      }
    },
    fourtwentyAmount(newVal) {
      const value = new BigNumber(newVal);
      const accountBalance = this.web3.utils.fromWei(
        new BigNumber(this.account.balance).toFixed(),
        '420coin'
      );
      const subAccountBalance = new BigNumber(this.availableBalanceFourtwenty);

      if (newVal <= 0) {
        this.errMsg = this.$t('dappsAmbrpay.errors.amount-higher-zero');
      } else if (this.manageFundsText === 'Add' && value.gt(accountBalance)) {
        this.errMsg = this.$t('dappsAmbrpay.errors.amount-higher-balance');
      } else if (
        this.manageFundsText === 'Withdraw' &&
        value.gt(subAccountBalance)
      ) {
        this.errMsg = this.$t('dappsAmbrpay.errors.amount-higher-sub-balance');
      } else {
        this.errMsg = '';
      }
    }
  },
  methods: {
    onClick() {
      if (this.manageFundsText === 'Add' && this.actionStep === true) {
        this.$emit('addFunds', this.fourtwentyAmount);
        this.actionStep = false;
      } else if (
        this.manageFundsText === 'Withdraw' &&
        this.actionStep === true
      ) {
        this.$emit('withdrawFunds', this.fourtwentyAmount);
        this.actionStep = false;
      } else {
        this.$refs['manageFundsModal'].hide();
        this.actionStep = true;
        this.fourtwentyAmount = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageFundsModal.scss';
@import '../../AmbrpayGlobal.scss';
</style>

<style lang="scss">
.modal-body {
  padding: 0;
}
</style>
