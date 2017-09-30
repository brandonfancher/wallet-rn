import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';
import networks from './networks';
import { randomBytes } from 'react-native-randombytes';


const generateAddressFromSeed = (mnemonic, path, network = process.env.ASSET_NETWORK) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = bitcoin.HDNode.fromSeedHex(seed, network);
  const xpub = root.neutered().toBase58();
  // console.log('xpub: ', xpub);
  return root.derivePath(path).getAddress();
}

export const generateXpub = (mnemonic, network = process.env.ASSET_NETWORK) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = bitcoin.HDNode.fromSeedHex(seed, network);
  const xpub = root.neutered().toBase58();
  return xpub;
}

export const generateWalletAddresses = (mnemonic, network) => {
  const addresses = [];
  for (const i = 0; i <= 32; i++) {
    const address = generateAddressFromSeed(mnemonic, `m/${i}`, network);
    addresses.push(address);
  }
  // console.log('ADDRESSES: ', addresses);
  return addresses;
}

export const generateMnemonic = async (bitsOfEntropy = 128) => {
  try {
    return await bip39.generateMnemonic(bitsOfEntropy);
  } catch (e) {
    console.error('Error while generating key: ', e);
    return false;
  }
}

export const generateRandomHexString = (size) => {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, bytes) => {
      if (err) reject(err);
      resolve(bytes.toString('hex'));
    })
  });
}

export const toSatoshi = (amount) => amount * 100000000;
