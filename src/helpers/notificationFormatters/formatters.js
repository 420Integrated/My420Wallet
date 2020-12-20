import BigNumber from 'bignumber.js';
import { v4 as uuid } from 'uuid';
import { Toast } from '@/helpers';

import {
  INVESTIGATE_FAILURE_KEY,
  type,
  notificationStatuses,
  notificationType,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes
} from './config';

/*
ERROR EXAMPLES:

Returned error: known transaction: 4e6c0d9a75b6c826ad7ed3a657a6c3bf2621620bf8879b9a83597865acef2a5b
Returned error: nonce too low

 */

const extractErrorMessage = errObj => {
  try {
    if (errObj.hasOwnProperty('message')) {
      const errorMessage = errObj.message.toString();
      const regex1 = RegExp('(?<=:).*');
      const regEx1Matches = regex1.exec(errorMessage);
      if (regEx1Matches !== null) {
        return regEx1Matches[0];
      }
      return errorMessage;
    }
    return errObj;
  } catch (e) {
    return errObj;
  }
};

const parseStatus = status => {
  if (typeof status === 'boolean') {
    return status;
  } else if (typeof status === 'string') {
    if (status.slice(0, 2) === '0x') {
      return new BigNumber(status).gt(0);
    }
    return status.toLowerCase() === 'true';
  }
  // the transaction receipt status is sometimes returning false even if the transaction was successful.
  // Need to investigate why and where this is happening.
  return true;
};

const updateStatusBasedOnReciept = status => {
  return parseStatus(status)
    ? notificationStatuses.COMPLETE
    : notificationStatuses.FAILED;
};

const formatTransactionHash = (val, network) => {
  try {
    return {
      id: uuid(),
      title: 'Transaction',
      read: false,
      timestamp: Date.now(),
      type: notificationType.TRANSACTION,
      status: val[txIndexes.response]
        ? notificationStatuses.PENDING
        : notificationStatuses.FAILED,
      hash: val[txIndexes.response].hasOwnProperty('transactionHash')
        ? val[txIndexes.response].transactionHash
        : val[txIndexes.response],
      network: network,
      body: {
        error: false,
        errorMessage: '',
        hash: val[txIndexes.response],
        to: val[txIndexes.txDetails] ? val[txIndexes.txDetails].to : '',
        amount: val[txIndexes.txDetails]
          ? new BigNumber(val[txIndexes.txDetails].value).toString()
          : '0',
        nonce: val[txIndexes.txDetails]
          ? new BigNumber(val[txIndexes.txDetails].nonce).toString()
          : '0',
        smokePrice: val[txIndexes.txDetails]
          ? new BigNumber(val[txIndexes.txDetails].smokePrice).toString()
          : '0',
        smokeLimit: val[txIndexes.txDetails]
          ? new BigNumber(val[txIndexes.txDetails].smoke).toString()
          : '0',
        tokenTransferTo: val[txIndexes.txDetails]
          ? val[txIndexes.txDetails].tokenTransferTo
          : '',
        tokenTransferVal: val[txIndexes.txDetails]
          ? val[txIndexes.txDetails].tokenTransferVal
          : '0',
        tokenSymbol: val[txIndexes.txDetails]
          ? val[txIndexes.txDetails].tokenSymbol
          : ''
      },
      expanded: false
    };
  } catch (e) {
    Toast.responseHandler('error-parsing-tx-details', 3);
  }
};

const formatTransactionReciept = (entry, val) => {
  entry.status = updateStatusBasedOnReciept(val[txIndexes.response].status);
  entry.body.error = !val[txIndexes.response].status;
  entry.body.errorMessage = parseStatus(val[txIndexes.response].status)
    ? ''
    : INVESTIGATE_FAILURE_KEY;
  entry.body.smokeUsed = new BigNumber(
    val[txIndexes.response].smokeUsed
  ).toString();
  if (val[txIndexes.response].contractAddress) {
    entry.body.contractAddress = val[txIndexes.response].contractAddress;
    entry.type = notificationType.CONTRACT_CREATION;
  }
  entry.body.blockNumber = new BigNumber(
    val[txIndexes.response].blockNumber
  ).toString();

  if (entry.body.isDex) {
    entry.swapStatus = val[txIndexes.response].status
      ? notificationStatuses.COMPLETE
      : notificationStatuses.FAILED;
    entry.body.timeRemaining = -1;
  }

  return entry;
};

const formatTransactionError = (val, network) => {
  return {
    id: uuid(),
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.ERROR,
    status: notificationStatuses.FAILED,
    swapStatus: notificationStatuses.FAILED,
    hash: val[txIndexes.txDetails].hasOwnProperty('hash')
      ? val[txIndexes.txDetails].hash
      : undefined,
    network: network,
    body: {
      error: true,
      errorMessage: extractErrorMessage(val[txIndexes.response]),
      hash: val[txIndexes.txDetails].hasOwnProperty('hash')
        ? val[txIndexes.txDetails].hash
        : undefined,
      to: val[txIndexes.txDetails].to,
      amount: new BigNumber(val[txIndexes.txDetails].value).toString(),
      nonce: new BigNumber(val[txIndexes.txDetails].nonce).toString(),
      smokePrice: new BigNumber(val[txIndexes.txDetails].smokePrice).toString(),
      smokeLimit: new BigNumber(val[txIndexes.txDetails].smoke).toString()
    },
    expanded: false
  };
};

const formatTransactionErrorUpdate = (entry, val) => {
  entry.body.error = true;
  entry.type = notificationType.ERROR;
  entry.status = notificationStatuses.FAILED;
  entry.swapStatus = notificationStatuses.FAILED;
  entry.body.errorMessage = val[txIndexes.response].hasOwnProperty('message')
    ? val[txIndexes.response].message
    : val[txIndexes.response];

  return entry;
};

const formatSwap = (val, network) => {
  const isFourtwentycoin = val[swapIndexes.label] !== type.SWAP_ORDER;
  const initialState = isFourtwentycoin
    ? swapOnlyStatuses.SENT
    : swapOnlyStatuses.NEW;

  const formatted = {
    id: uuid(),
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status: isFourtwentycoin
      ? val[swapIndexes.response]
        ? notificationStatuses.PENDING
        : notificationStatuses.FAILED
      : notificationStatuses.PENDING,
    swapStatus: isFourtwentycoin
      ? val[swapIndexes.response]
        ? initialState
        : notificationStatuses.FAILED
      : initialState,
    hasTransaction: isFourtwentycoin && val[swapIndexes.response],
    hash: isFourtwentycoin ? val[swapIndexes.response] : undefined,
    network: network,
    body: {
      error: false,
      errorMessage: '',
      providerAddress: val[swapIndexes.details].providerAddress,
      to: val[swapIndexes.details].toAddress,
      from: val[swapIndexes.details].fromAddress,
      fromValue: val[swapIndexes.details].fromValue,
      toValue: val[swapIndexes.details].toValue,
      fromCurrency: val[swapIndexes.details].fromCurrency,
      toCurrency: val[swapIndexes.details].toCurrency,
      orderId: val[swapIndexes.details].parsed.orderId,
      statusId: val[swapIndexes.details].parsed.statusId,
      timeRemaining: val[swapIndexes.details].parsed.validFor || 600,
      validFor: val[swapIndexes.details].parsed.validFor || 600,
      createdAt:
        val[swapIndexes.details].parsed.timestamp ||
        new Date(Date.now()).toISOString(),
      rate: val[swapIndexes.details].rate,
      provider: val[swapIndexes.details].provider,
      special: val[swapIndexes.details].special,
      isDex: val[swapIndexes.details].isDex
    },
    expanded: false
  };

  if (isFourtwentycoin) {
    formatted.body = {
      ...formatted.body,
      amount: new BigNumber(val[swapIndexes.txDetails].value).toString(),
      nonce: new BigNumber(val[swapIndexes.txDetails].nonce).toString(),
      smokePrice: new BigNumber(val[swapIndexes.txDetails].smokePrice).toString(),
      smokeLimit: new BigNumber(val[swapIndexes.txDetails].smoke).toString()
    };
  }

  return formatted;
};

const formatSwapReciept = async (entry, val) => {
  if (entry.body.isDex) {
    entry.swapStatus = val[swapIndexes.response].status
      ? notificationStatuses.COMPLETE
      : notificationStatuses.FAILED;
    entry.body.timeRemaining = -1;
    if (Number.isNaN(entry.body.smokeLimit)) {
      entry.body.smokeLimit = new BigNumber(
        val[swapIndexes.response].smokeUsed
      ).toString();
    }
  }
  return entry;
};

const formatSwapErrorUpdate = (entry, val) => {
  entry.type = notificationType.SWAP_ERROR;
  entry.body.error = true;
  entry.status = notificationStatuses.FAILED;
  entry.swapStatus = notificationStatuses.FAILED;
  entry.body.errorMessage = val[swapIndexes.response].hasOwnProperty('message')
    ? val[swapIndexes.response].message
    : val[swapIndexes.response];
  entry.body.blockNumber = new BigNumber(
    val[swapIndexes.response].blockNumber
  ).toString();
  return entry;
};

const formatSwapError = (val, network) => {
  return {
    id: uuid(),
    title: 'Swap',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP_ERROR,
    status: notificationStatuses.FAILED,
    swapStatus: notificationStatuses.FAILED,
    hasTransaction: true,
    hash: undefined,
    network: network,
    body: {
      error: true,
      errorMessage: val[swapIndexes.response].hasOwnProperty('message')
        ? val[swapIndexes.response].message
        : val[swapIndexes.response],
      hash: undefined,
      amount: new BigNumber(val[swapIndexes.txDetails].value).toString(),
      nonce: new BigNumber(val[swapIndexes.txDetails].nonce).toString(),
      smokePrice: new BigNumber(val[swapIndexes.txDetails].smokePrice).toString(),
      smokeLimit: new BigNumber(val[swapIndexes.txDetails].smoke).toString(),
      to: val[swapIndexes.details].toAddress,
      from: val[swapIndexes.details].fromAddress,
      fromValue: val[swapIndexes.details].fromValue,
      toValue: val[swapIndexes.details].toValue,
      fromCurrency: val[swapIndexes.details].fromCurrency,
      toCurrency: val[swapIndexes.details].toCurrency,
      orderId: val[swapIndexes.details].parsed.orderId,
      statusId: val[swapIndexes.details].parsed.statusId,
      timeRemaining: val[swapIndexes.details].parsed.validFor,
      validFor: val[swapIndexes.details].parsed.validFor,
      createdAt: val[swapIndexes.details].parsed.timestamp,
      rate: val[swapIndexes.details].rate,
      provider: val[swapIndexes.details].provider,
      special: val[swapIndexes.details].special,
      isDex: val[swapIndexes.details].isDex
    },
    expanded: false
  };
};

export {
  formatTransactionHash,
  formatTransactionReciept,
  formatTransactionError,
  formatTransactionErrorUpdate,
  formatSwap,
  formatSwapReciept,
  formatSwapError,
  formatSwapErrorUpdate
};
