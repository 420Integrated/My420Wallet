<template>
  <div class="sign-message-container">
    <interface-container-title :title="$t('verifyMessage.title')" />
    <verify-message-input />
    <div class="content-container">
      <div class="submit-button-container">
        <interface-bottom-text
          :link-text="$t('common.help-center')"
          :question="$t('common.have-issues')"
          link="https://kb.my420wallet.420integrated.com"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import InterfaceContainerTitle from '../../components/InterfaceContainerTitle';
import VerifyMessageInput from '@/components/VerifyMessageInput';

export default {
  name: 'VerifyMessage',
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'interface-container-title': InterfaceContainerTitle,
    'verify-message-input': VerifyMessageInput
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageContainer.scss';
</style>
