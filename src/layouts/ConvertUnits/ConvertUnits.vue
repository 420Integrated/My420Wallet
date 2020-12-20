<template>
  <div class="convert-units">
    <div class="wrap">
      <div class="page-container">
        <div class="page-title">
          <page-title
            :options="{
              title: $t('convertUnits.page.title'),
              boldSubTitle: '',
              textContent: [$t('convertUnits.page.desc')]
            }"
          />
        </div>

        <div><unit-input :options="options" /></div>

        <div class="fourtwentycoin-unit-reference-guide">
          <div class="block-title">
            <h3>{{ $t('convertUnits.title-refference') }}</h3>
          </div>

          <div class="unit-table">
            <table>
              <tbody>
                <tr v-for="eu in fourtwentycoinUnitRef" :key="eu.key">
                  <td>{{ eu.name }}</td>
                  <td class="unit-long">{{ eu.unit1 }}</td>
                  <td class="unit-short">
                    <div>
                      {{ eu.unit2 }}<span>{{ eu.unit2e }}</span>
                    </div>
                  </td>
                  <td>{{ eu.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitInput from './components/UnitInput';
import PageTitleComponent from '@/components/PageTitleComponent';

export default {
  components: {
    'unit-input': UnitInput,
    'page-title': PageTitleComponent
  },
  data() {
    return {
      fourtwentycoinUnitRef: [
        {
          name: 'Marley',
          unit1: '1',
          unit2: '1',
          unit2e: '',
          desc: ''
        },
        {
          name: 'Kwei',
          unit1: '1,000',
          unit2: '10',
          unit2e: '3',
          desc: 'ada, femto420'
        },
        {
          name: 'Mwei',
          unit1: '1,000,000',
          unit2: '10',
          unit2e: '6',
          desc: 'babbage, pico420'
        },
        {
          name: 'Maher',
          unit1: '1,000,000,000',
          unit2: '10',
          unit2e: '9',
          desc: 'shannon, nano420, nano'
        },
        {
          name: 'Szabo',
          unit1: '1,000,000,000,000',
          unit2: '10',
          unit2e: '12',
          desc: 'micro420, micro'
        },
        {
          name: 'Finney',
          unit1: '1,000,000,000,000,000',
          unit2: '10',
          unit2e: '15',
          desc: 'milli420, milli'
        },
        {
          name: 'Fourtwentycoin',
          unit1: '1,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '18',
          desc: ''
        },
        {
          name: 'K420',
          unit1: '1,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '21',
          desc: 'grand, einstein'
        },
        {
          name: 'M420',
          unit1: '1,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '24',
          desc: ''
        },
        {
          name: 'G420',
          unit1: '1,000,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '27',
          desc: ''
        },
        {
          name: 'T420',
          unit1: '1,000,000,000,000,000,000,000,000,000,000',
          unit2: '10',
          unit2e: '30',
          desc: ''
        }
      ],
      options: [
        'wei',
        'kwei',
        'mwei',
        'maher',
        'szabo',
        'finney',
        '420coin',
        'k420',
        'm420',
        'g420',
        't420'
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'ConvertUnits.scss';
</style>
