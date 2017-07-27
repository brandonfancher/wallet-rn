// Don't forget to import './config/globals'; in index.ios.js!

// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};

// Polyfill crypto.getRandomValues() with randomBytes.
import { randomBytes } from 'react-native-randombytes';
global.crypto = {
  getRandomValues(byteArray) {
    const strength = byteArray.length;
    return randomBytes(strength);
  },
};
