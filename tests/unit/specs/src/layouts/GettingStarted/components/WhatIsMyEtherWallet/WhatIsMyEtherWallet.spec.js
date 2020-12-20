import { shallowMount } from '@vue/test-utils';
import WhatIsMy420Wallet from '@/layouts/GettingStarted/components/WhatIsMy420Wallet/WhatIsMy420Wallet.vue';

import { Tooling } from '@@/helpers';

describe('WhatIsMy420Wallet.vue', () => {
  let localVue, i18n, wrapper, store;
  const progressBarValue = 'Congratulations progressBarValue';

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(WhatIsMy420Wallet, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      propsData: { progressBarValue }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct contents', () => {
    expect(
      wrapper.vm.$el
        .querySelector('.block-progressbar__progressbar div')
        .className.trim()
    ).toEqual(progressBarValue);
  });

  describe('WhatIsMy420Wallet.vue Methods', () => {});
});
