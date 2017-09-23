// TODO: Get more than ten. (Basically paginate based on block height.)
// TODO: Display to/from addresses in transactions lists.

/**
 * Returns the addresses and value transacted
 * @param {array} inOut - An array of inputs or outputs.
 * @param {string} mode - "send" or "receive"
 * @returns {object} An object containing the value and addresses of interest.
 */
function getValueAndAddressInfo(walletAddresses, tx, mode) {

  const inOut = tx.outputs;

  let condition;
  switch (mode) {
    case 'receive':
      condition = (addr) => walletAddresses.includes(addr);
      break;
    case 'send':
      condition = (addr) => !walletAddresses.includes(addr);
      break;
    default:
      console.error('Send/receive mode not specified.')
  }

  const info = {
    addresses: [],
    value: 0,
  };

  for (const obj of inOut) {
    for (const addr of obj.addresses) {
      if (condition(addr)) {
         if (!info.addresses.includes(addr)) info.addresses.push(addr);
        info.value += obj.value || obj.output_value;
      }
    }
  }

  return info;
}

function ourAddressIsIn(walletAddresses, inOut) {
  let result = false;
  for (const obj of inOut) {
    for (const addr of obj.addresses) {
      if (walletAddresses.includes(addr)) {
        result = true;
      }
    }
  }
  return result;
}

function allAddressesAreOursIn(walletAddresses, inOut) {
  let result = true;
  for (const obj of inOut) {
    for (const addr of obj.addresses) {
      if (!walletAddresses.includes(addr)) {
        result = false;
      }
    }
  }
  return result;
}

function parseTransaction(tx, walletAddresses) {
  const parsedTx = {
    txHash: tx.hash,
    receivedTime: tx.received,
    preference: tx.preference,
    confirmations: tx.confirmations,
    confirmed: tx.confirmations > 5,
    exploreUri: `https://live.blockcypher.com/bcy/tx/${tx.hash}/`
  };

  const ourAddressIsInInput = ourAddressIsIn(walletAddresses, tx.inputs);
  const allAddressesInOutputsAreOurs = allAddressesAreOursIn(walletAddresses, tx.outputs);

  const receiving = !ourAddressIsInInput;
  const sending = ourAddressIsInInput && !allAddressesInOutputsAreOurs;
  const sendingToOurselves = ourAddressIsInInput && allAddressesInOutputsAreOurs;

  const sendInfo = getValueAndAddressInfo(walletAddresses, tx, 'send');
  const receiveInfo = getValueAndAddressInfo(walletAddresses, tx, 'receive');

  if (sending) {
    // Get the sum for all outputs that are not my addresses. That's what was sent and to whom.
    parsedTx.fees = tx.fees;
    parsedTx.io = 'OUTGOING';
    parsedTx.value = sendInfo.value;
    parsedTx.addresses = sendInfo.addresses;

  } else if (sendingToOurselves) {
    // Get the sum for all outputs that are not my addresses. That's what was sent and to whom.
    // TODO: Figure out how to handle values and addresses here.
    parsedTx.fees = tx.fees;
    parsedTx.io = 'OUTIN';

  } else if (receiving) {
    // get the sum for all outputs that ARE my addresses. That's what was received.
    parsedTx.io = 'INCOMING';
    parsedTx.value = receiveInfo.value;
    parsedTx.addresses = receiveInfo.addresses;

  } else {
    parsedTx.io = 'UNKNOWN';
  }

  return parsedTx;
}

function parseAllTransactions(transactions, walletAddresses) {
  const txs = [];
  for (const tx of transactions) {
    txs.push(parseTransaction(tx, walletAddresses));
  }
  return txs;
}

export default parseAllTransactions;
