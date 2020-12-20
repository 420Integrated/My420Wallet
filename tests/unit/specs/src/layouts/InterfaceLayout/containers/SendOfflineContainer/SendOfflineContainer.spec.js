import Vue from 'vue';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import SendOfflineContainer from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/SendOfflineContainer.vue';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle/InterfaceContainerTitle.vue';
import PopOver from '@/components/PopOver/PopOver.vue';
import { Tooling } from '@@/helpers';

xdescribe('SendOfflineContainer.vue', () => {
  let localVue, i18n, wrapper, store;

  const spy = sinon.stub();
  const mockRouter = {
    push: spy
  };
  const mockRoute = {
    name: 'Send Offline'
  };

  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
    Vue.config.warnHandler = () => {};
  });

  beforeEach(() => {
    wrapper = shallowMount(SendOfflineContainer, {
      localVue,
      i18n,
      store,
      attachToDocument: true,
      stubs: {
        'interface-container-title': InterfaceContainerTitle,
        popover: PopOver
      },
      mocks: {
        $router: mockRouter,
        $route: mockRoute
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should clear the form', () => {
    wrapper.setData({
      toData: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      toAmt: '5',
      address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
      smokeLimit: '3000',
      localNonce: '1000',
      localSmokePrice: '15',
      selectedCurrency: {
        name: 'Bitcoin',
        symobl: 'FOURTWENTY'
      }
    });
    wrapper.find('.clear-all-btn').trigger('click');
    expect(wrapper.vm.$data.toData).toEqual('0x');
    expect(wrapper.vm.$data.toAmt).toEqual(0);
    expect(wrapper.vm.$data.localSmokePrice).toEqual(wrapper.vm.$data.highestSmoke);
    expect(wrapper.vm.$data.address).toEqual('');
    expect(wrapper.vm.$data.smokeLimit).toEqual('21000');
    expect(wrapper.vm.$data.localNonce).toEqual(wrapper.vm.$data.nonce);
    expect(wrapper.vm.$data.selectedCurrency).toEqual({
      name: '420coin',
      symbol: 'FOURTWENTY'
    });
  });

  xit('should render correct nonce data', () => {
    // expect(
    //   wrapper.vm.$el.querySelector('router-view').getAttribute('nonce')
    // ).toBe(String(wrapper.vm.$data.nonce));
  });

  xit('should render correct smokeLimit data', () => {
    expect(
      wrapper.vm.$el.querySelector('router-view').getAttribute('smoke-limit')
    ).toBe(String(wrapper.vm.$data.smokeLimit));
  });

  xit('should render correct rawTx data', () => {
    expect(
      wrapper.vm.$el.querySelector('router-view').getAttribute('raw-tx')
    ).toBe(wrapper.vm.$data.rawTx);
  });

  xit('should render correct tabs data', () => {
    const pointerEventsElements = wrapper.vm.$el.querySelectorAll(
      'div.prevent-pointer-events'
    );

    for (const [i, pointerEventsElement] of pointerEventsElements.entries()) {
      expect(
        pointerEventsElement.querySelector('p.title').textContent.trim()
      ).toEqual(wrapper.vm.$data.tabs[i].title);
      expect(
        pointerEventsElement.querySelector('p.description').textContent.trim()
      ).toEqual(wrapper.vm.$data.tabs[i].desc);
    }
  });
});
