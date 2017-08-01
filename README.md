# wallet-rn

## Tasks
* Store addresses, keys, etc. Send and receive transactions.
* Fork `react-native-bitcoinjs-lib` and `react-native-bip39` myself. I will control it (more secure) and I can update `bitcoinjs-lib` to support things like Segwit.
* Support multiple coins
  * [x] bitcoin
  * [x] litecoin
  * [x] dash
  * [ ] ethereum
  * [x] bitcoin testnet3
  * [x] blockcypher test chain
* Security review. Make sure that `react-native-crypto` and `crypto-browserify` are secure.


## Polyfills and Resources Re: Crypto Libraries.

Some dependencies rely on `crypto` and other libraries that are usually bundled with Node but which are missing from the React Native environment. Those missing libraries must be shimmed with something like browserify and similar tools. One method for including such shims is [React Nativify](https://github.com/philikon/ReactNativify), which relies on [babel-plugin-rewrite-require](https://www.npmjs.com/package/babel-plugin-rewrite-require) to point existing `require` or `import` scripts to the shimmed packages.

Instead of `babel-plugin-rewrite-require`, I'm using the more popular `babel-plugin-module-resolver`, as detailed in this [Stack Overflow Post](https://stackoverflow.com/questions/40629856/can-we-use-nodejs-code-inside-react-native-application/45207249#45207249). I'm also declaring my transformers within `.babelrc`. It's simpler and fixes two issues: slow rebuilds and slow chrome debugger source maps.

### React Nativify

* The alternative to the React Nativify method is [rn-nodeify](https://github.com/mvayngrib/rn-nodeify/), but that's messy and scary.
* [node-libs-browser](https://github.com/webpack/node-libs-browser) should be installed to provide many of the basic node functions.
* We may have issues with Jest tests when we use them. If so, refer to this [SO Thread](https://stackoverflow.com/questions/45084751/debugging-react-native-with-node-shims-in-vs-code). One person said that was fixed by remembering to include a `.babelrc` file. We'll see when we get there.

### crypto
* There are several libraries that attempt to shim `crypto`: [react-native-crypto](https://github.com/mvayngrib/react-native-crypto) (a clone of [crypto-browserify](https://github.com/crypto-browserify/crypto-browserify) with `randomBytes` replaced) and [native-crypto](https://github.com/calvinmetcalf/native-crypto). I opted for the former. Haven't tried the latter yet.
* **pbkdf2** If `pbkdf2` errors out, ensure that it is frozen at 3.0.8. An `npm list pbkdf2` should show only 3.0.8.
* `react-native-crypto` relies on [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes) for random byte generation, which in turn relies on [SJCL (Standford Javascript Crypto Library)](https://github.com/bitwiseshiftleft/sjcl/) for synchronous generation and iOS's `SecRandomCopyBytes` for asynchronous generation. `react-native-randombytes` recommends linking with `rnpm link`, however that and `react-native link` is not currently working for me. The Manual method must be used. Furthermore, two files must be manually modified in Xcode for newer versions of React Native: https://github.com/mvayngrib/react-native-randombytes/pull/15. Hopefully that will be merged soon. In the meantime, I'm depending on my branch (listed in `package.json`) with those files fixed already. That library must be installed, added to the `.babelrc` file.
* Here's another interesting take on [React Native Synchronous Secure Random Number Generation](https://stackoverflow.com/questions/34732159/react-native-synchronous-secure-random-number-generation).

#### BIP39
* Currently using [`react-native-bip39`](https://github.com/novalabio/react-native-bip39), a port of [`bip39`](https://github.com/bitcoinjs/bip39). Will likely see if I can figure out how to use `bip39` directly, or fork `bip39` myself for security reasons.
* Online Mnemonic Code Converter: https://iancoleman.github.io/bip39/

#### BIP32 and Other Cryptocurrency Functions
* Using [`react-native-bitcoinjs-lib`](https://github.com/novalabio/react-native-bitcoinjs-lib), a fork of [`bitcoinjs`](https://github.com/bitcoinjs/bitcoinjs-lib). Will likely fork the latter myself for security reasons and to get access to the latest features, like Segwit.

## Other Documentation
* [Original React Native README](/docs/react-native.md)
* [Tunneling to Overcome Dev Network Issues](/docs/tunneling.md)

## Before Going to Production
* Ensure any dev tunneling changes are reverted (especially App Transport Security Settings exceptions.)
