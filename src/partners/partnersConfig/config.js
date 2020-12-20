const networkSymbols = {
  FOURTWENTY: 'FOURTWENTY',
  ROP: 'ROP'
};

const BASE_CURRENCY = 'FOURTWENTY';
const baseCurrencyEntry = { symbol: 'FOURTWENTY', name: 'Fourtwentycoin' };
const MIN_SWAP_AMOUNT = 0.000001;
const TIME_SWAP_VALID_DEFAULT = 600;
const TOP_OPTIONS_ORDER = ['FOURTWENTY', 'BTC', 'EUR', 'USD', 'CHF'].reverse(); // easier to visualize with a first to last, but easier to sort with last to first.

const swapApiEndpoints = {
  base: 'https://swap.mewapi.io',
  changelly: '/changelly',
  bity: '/bity',
  dexag: '/dexag'
};

const mewSimplex = 'https://apiccswap.my420wallet.420integrated.com';

const swapNotificationStatuses = {
  new: 'new',
  sent: 'sent',
  cancelled: 'cancelled',
  NEW: 'new',
  SENT: 'sent',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

export {
  BASE_CURRENCY,
  TOP_OPTIONS_ORDER,
  MIN_SWAP_AMOUNT,
  TIME_SWAP_VALID_DEFAULT,
  swapNotificationStatuses,
  baseCurrencyEntry,
  networkSymbols,
  swapApiEndpoints,
  mewSimplex
};
