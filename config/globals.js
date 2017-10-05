// Don't forget to import './config/globals'; in index.ios.js!

// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
// const crypto = require('crypto');

process.env['NODE_ENV'] = __DEV__ ? 'development' : 'production';

process.browser = false;
process.version = 'v8.1.4';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};

if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// Polyfill crypto.getRandomValues() with randomBytes.
// import { randomBytes } from 'react-native-randombytes';
// global.crypto = { ...crypto, getRandomValues: (byteArray) => crypto.randomBytes(byteArray.length)};
// console.error(crypto);
// console.error(global.crypto);
// global.crypto = {
//   getRandomValues(byteArray) {
//     const strength = byteArray.length;
//     return randomBytes(strength);
//   },
// };
