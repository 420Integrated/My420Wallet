import BigNumber from 'bignumber.js';
import { Toast } from '@/helpers';
import { Util } from '@fourtwenty-alarm-clock/lib';
import * as unit from 'fourtwentyjs-unit';

const EAC_SCHEDULING_CONFIG = {
  FEE: new BigNumber('0'),
  TOKEN_TRANSFER_ADDITIONAL_SMOKE: new BigNumber('20000'),
  TOKEN_SCHEDULING_SMOKE_LIMIT: new BigNumber('1500000'),
  FUTURE_SMOKE_LIMIT: new BigNumber('1000000'),
  TIME_BOUNTY_MIN: new BigNumber('1'),
  TIME_BOUNTY_DEFAULTS: ['0.01', '0.02', '0.03'],
  BOUNTY_TO_DEPOSIT_MULTIPLIER: 2,
  SUPPORTED_MODES: [
    {
      name: 'scheduleTx.date-time',
      executionWindow: {
        min: 5,
        default: 10
      },
      unit: 'Minutes'
    },
    {
      name: 'scheduleTx.block-num',
      executionWindow: {
        min: 20,
        default: 90
      },
      unit: 'Blocks'
    }
  ],
  TOKEN_TRANSFER_MFOURTWENTYOD_ID: '23b872dd',
  APPROVE_TOKEN_TRANSFER_MFOURTWENTYOD_ID: '095ea7b3'
};

const calcSchedulingTotalCost = ({
  smokePrice,
  smokeLimit,
  futureSmokeLimit,
  futureSmokePrice,
  timeBounty
}) => {
  const deployCost = smokePrice.times(smokeLimit);
  const futureExecutionCost = timeBounty.plus(
    futureSmokeLimit.times(futureSmokePrice)
  );
  return deployCost.plus(futureExecutionCost).plus(EAC_SCHEDULING_CONFIG.FEE);
};

const canBeConvertedToWei = (web3, string, denomination = '420coin') => {
  try {
    web3.utils.toWei(string.toString(), denomination);
  } catch (e) {
    if (
      !e.message.includes('too many decimal places') ||
      !e.message.includes(`invalid number value ''`)
    ) {
      Toast.responseHandler(e, false);
    }
    return false;
  }
  return true;
};

const estimateBountyForSmokePrice = (smokePrice, futureSmokeLimit) => {
  const estimatedWei = Util.estimateBountyForExecutionSmokePrice(
    new BigNumber(unit.toWei(Math.round(smokePrice).toString(), 'maher')),
    new BigNumber(futureSmokeLimit.toString()),
    new BigNumber(unit.toWei('0', 'maher'))
  );

  const estimatedFourtwenty = unit.fromWei(estimatedWei.toString(), '420coin');

  // Estimate the number of decimals to show
  let decimalPoints = 0;
  if (estimatedFourtwenty.substring(0, 2) === '0.') {
    let endFound = false;

    let i = estimatedFourtwenty.length;
    while (i && !endFound) {
      i -= 1;
      const char = estimatedFourtwenty.charAt(estimatedFourtwenty.length - i - 1);
      if (char !== '0' && char !== '.') {
        endFound = true;
        break;
      }
      decimalPoints += 1;
    }
  }

  return parseFloat(estimatedFourtwenty).toFixed(decimalPoints);
};

export {
  calcSchedulingTotalCost,
  canBeConvertedToWei,
  EAC_SCHEDULING_CONFIG,
  estimateBountyForSmokePrice
};
