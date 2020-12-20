import BigNumber from 'bignumber.js';
import store from 'store';
const MED_CONST = 21.428571428571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42.857142857145;
const FAST_MULTIPLIER = 1.1428571428571;
const OLD_MED_CONST = 1.25;
const OLD_FAST_CONST = 1.5;
const LIMITER = 25;

const getEconomy = smokePrice => {
  return new BigNumber(smokePrice).div(1).toFixed(9);
};
const getRegular = smokePrice => {
  if (smokePrice > LIMITER) {
    let initialValue = new BigNumber(smokePrice).times(MED_MULTIPLIER);
    initialValue = initialValue.plus(MED_CONST);

    return new BigNumber(initialValue).toFixed(9);
  }

  return new BigNumber(smokePrice).times(1.25).toFixed(9);
};
const getFast = smokePrice => {
  if (smokePrice > LIMITER) {
    let initialValue = new BigNumber(smokePrice).times(FAST_MULTIPLIER);
    initialValue = initialValue.plus(FAST_CONST);

    return new BigNumber(initialValue).toFixed(9);
  }

  return new BigNumber(smokePrice).times(1.5).toFixed(9);
};

const getOther = () => {
  const storedPrice = store.get('customSmokePrice') || 0;
  return new BigNumber(storedPrice).toFixed(9);
};

const fastToEconomy = smokePrice => {
  const oldConverted = smokePrice / OLD_FAST_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = new BigNumber(smokePrice).minus(FAST_CONST);
  initialValue = initialValue.div(FAST_MULTIPLIER);
  return new BigNumber(initialValue).toFixed(9);
};

const regularToEconomy = smokePrice => {
  const oldConverted = smokePrice / OLD_MED_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = new BigNumber(smokePrice).minus(MED_CONST);
  initialValue = initialValue.div(MED_MULTIPLIER);
  return new BigNumber(initialValue).toFixed(9);
};

const getSmokeBasedOnType = smokePrice => {
  const smokePriceType = store.get('smokePriceType') || 'economy';
  switch (smokePriceType) {
    case 'economy':
      return getEconomy(smokePrice);
    case 'regular':
      return getRegular(smokePrice);
    case 'fast':
      return getFast(smokePrice);
    default:
      return getOther();
  }
};

export {
  getEconomy,
  getRegular,
  getFast,
  getOther,
  getSmokeBasedOnType,
  fastToEconomy,
  regularToEconomy
};
