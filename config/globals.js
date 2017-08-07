// Don't forget to import './config/globals'; in index.ios.js!

// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');

// BUG: This next line errors out when building in Production, preventing build entirely. Do we even need it?
// https://github.com/babel/babel.github.io/issues/847
process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

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
// global.crypto = {
//   getRandomValues(byteArray) {
//     const strength = byteArray.length;
//     return randomBytes(strength);
//   },
// };
