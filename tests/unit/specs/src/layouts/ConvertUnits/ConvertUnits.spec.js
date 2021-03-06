import { shallowMount } from '@vue/test-utils';
import ConvertUnits from '@/layouts/ConvertUnits/ConvertUnits.vue';

import { Tooling } from '@@/helpers';

describe('ConvertUnits.vue', () => {
  let localVue, i18n, wrapper, store;
  beforeAll(() => {
    const baseSetup = Tooling.createLocalVueInstance();
    localVue = baseSetup.localVue;
    i18n = baseSetup.i18n;
    store = baseSetup.store;
  });

  beforeEach(() => {
    wrapper = shallowMount(ConvertUnits, {
      localVue,
      i18n,
      store,
      attachToDocument: true
    });
  });

  afterEach(() => {
    wrapper.destroy();
    wrapper = null;
  });

  it('should render correct etherUnitRef', () => {
    const trElements = wrapper.vm.$el.getElementsByTagName('tr');
    for (let i = 0; i < trElements.length; i++) {
      const trElement = trElements[i];
      const tdElements = trElement.getElementsByTagName('td');
      expect(tdElements[0].textContent.trim()).toEqual(
        wrapper.vm.$data.fourtwentyerUnitRef[i].name
      );
      expect(tdElements[1].textContent.trim()).toEqual(
        wrapper.vm.$data.fourtwentyerUnitRef[i].unit1
      );
      expect(tdElements[2].textContent.trim()).toEqual(
        wrapper.vm.$data.fourtwentyerUnitRef[i].unit2 +
          wrapper.vm.$data.fourtwentyerUnitRef[i].unit2e
      );
      expect(tdElements[3].textContent.trim()).toEqual(
        wrapper.vm.$data.fourtwentyerUnitRef[i].desc
      );
    }
  });
});
