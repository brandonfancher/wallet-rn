import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';
import networks from './networks';

const generateAddressFromSeed = (mnemonic, path, network = process.env.ASSET_NETWORK) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = bitcoin.HDNode.fromSeedHex(seed, network);
  const xpub = root.neutered().toBase58();
  // console.log('xpub: ', xpub);
  return root.derivePath(path).getAddress();
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
