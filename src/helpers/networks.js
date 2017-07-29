// https://en.bitcoin.it/wiki/List_of_address_prefixes
// TODO: Figure out how to integrate Ethereum: hint https://github.com/iancoleman/bip39/blob/master/src/js/ethereumjs-util.js

module.exports = {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  },
  dash: {
    messagePrefix: '\x20DASH Signed Message:\n', // TODO: See how sensitive this is. I made this line up.
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
  },
  dashtn: {
    messagePrefix: '\x20DASH Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x8c,
    scriptHash: 0x13,
    wif: 0xef,
  },
  blockcypherTestChain: { // TODO: Test this one out to verify values below.
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x1b, // https://www.blockcypher.com/dev/bitcoin/#testing
    scriptHash: 0x1f, // https://www.blockcypher.com/dev/bitcoin/#testing
    wif: 0x80
  },
}
