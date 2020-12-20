import { formatters } from 'web3-core-helpers';
const getSanitizedTx = tx => {
  return new Promise((resolve, reject) => {
    if (!tx.smoke && !tx.smokeLimit && !tx.chainId)
      return reject(new Error('"smoke" or "chainId" is missing'));
    if (tx.nonce < 0 || tx.smoke < 0 || tx.smokePrice < 0 || tx.chainId < 0)
      return reject(
        new Error('Smoke, smokePrice, nonce or chainId is lower than 0')
      );

    try {
      tx = formatters.inputCallFormatter(tx);
      const transaction = tx;
      if (tx.to) transaction.to = tx.to;
      transaction.data = tx.data || '0x';
      transaction.value = tx.value || '0x';
      transaction.chainId = tx.chainId;
      resolve(transaction);
    } catch (e) {
      reject(e);
    }
  });
};

export { getSanitizedTx };
