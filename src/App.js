import React, { PureComponent } from 'react';
import { Dimensions, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import Drawer from 'react-native-drawer';
import * as Keychain from 'react-native-keychain';

import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';

import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';

import {
  generateMnemonic,
  generateRandomHexString,
  generateWalletAddresses,
  generateXpub,
} from './helpers/coin';

import BitcoinDetail from './BitcoinDetail';
import CoinDetail from './CoinDetail';
import { PreferencesDrawer, UserButton } from './components';

const { height, width } = Dimensions.get('window');


export default class App extends PureComponent {

  state = {
    addresses: [],
    balanceBTC: 0,
    connectionEstablished: false,
    index: 1,
    initialized: false,
    invalidMnemonic: false,
    mnemonic: '',
    routes: [
      { key: '1', name: 'dash' },
      { key: '2', name: 'bitcoin' },
      { key: '3', name: 'litecoin' },
    ],
    sending: false,
    sendResult: null, // [null, 'success', 'fail']
    transactionsBTC: [],
    walletUUID: '',
  };

  componentWillMount = () => {
    const { connectionEstablished } = this.state;
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    console.error('API URL: ', process.env.API_URL);
    this.socket = io(process.env.API_URL, options);

    this.app = feathers()
      .configure(socketio(this.socket))
      .configure(hooks());

    // console.error('Socket: ', this.socket);

    this.socket.on('connect', () => {
      console.info('Connecting socket.');
      if (!connectionEstablished) this.setState({ connectionEstablished: true });
      this.registerAddressListeners();
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { connectionEstablished } = this.state;
    if (!prevState.connectionEstablished && connectionEstablished) {
      this.initializeWallet();
    }
  }

  registerAddressListeners = () => {
    const { addresses } = this.state;
    // This event should give the server something unique so that the server will know which events
    // to send to this particular connection. E.g., the wallet name, an array of addresses to listen
    // for transactions on, etc. That way, the server can filter events for this connected client.
    // Probably a UUID that serves as the wallet name and is stored in some persisted local storage.
    // I don't think a transaction includes wallet name when it comes through, though. Hence addreses.
    if (addresses) {
      this.socket.emit('registerSocket', addresses, (error, message) => {
        console.info('Registering device with the following addresses: ', addresses);
        console.error('Response: ', message);
      });
    }
  }

  initializeWallet = async (restoreMnemonic) => {
    console.error('restoreMnemonic: ', restoreMnemonic);
    // Recall walletSettings (addresses, mnemonic, walletUUID) and persist to app state, if present.
    const { mnemonic, walletUUID } = await this.recallWalletSettings();
    console.error('Wallet Mnemonic: ', mnemonic);
    console.error('Wallet UUID: ', walletUUID);

    let newlyCreatedWallet;

    // If they're not there, create a mnemonic and walletUUID, derive addresses from the mnemonic
    // and persist all of that to the keychain and app state. Create the new wallet on BlockCypher.
    if (restoreMnemonic || !mnemonic || !walletUUID) {
      let generatedMnemonic;
      if (!restoreMnemonic) {
        generatedMnemonic = await generateMnemonic();
        console.error(`generatedMnemonic: ${generatedMnemonic}`);
      }
      const persistedSettings = await this.persistWalletSettings(generatedMnemonic || restoreMnemonic);
      newlyCreatedWallet = await this.createNewWallet(persistedSettings);
      console.error('New Wallet: ', newlyCreatedWallet);
    }

    // Get and persist wallet
    // const walletName = walletUUID || newlyCreatedWallet.name;
    const walletName = newlyCreatedWallet && newlyCreatedWallet.name || walletUUID;
    this.getWalletInfo(walletName, 'full', (message) => {
      console.error('Wallet Info: ', message);
      this.setState({
        balanceBTC: message.balance,
        transactionsBTC: message.txs,
        initialized: true,
      });
    });
  }

  createNewWallet = async ({ mnemonic, walletUUID }) => {
    const xpub = generateXpub(mnemonic);
    return this.app.service('hd-wallet')
      .create({ name: walletUUID, extended_public_key: xpub })
      .catch(err => console.error(err));
  }

  recallWalletSettings = async () => {
    try {
      const walletInfo = await Keychain.getGenericPassword();
      const mnemonic = walletInfo.password;
      const walletUUID = walletInfo.username;

      const addresses = generateWalletAddresses(walletInfo.password);
      this.setState({ addresses, mnemonic, walletUUID });
      return { walletUUID, mnemonic };
    } catch (e) {
      console.error('Error while recalling mnemonic: ', e);
      return { walletUUID: null, mnemonic: null };
    }
  }

  persistWalletSettings = async (mnemonic) => {
    const invalidMnemonic = !bip39.validateMnemonic(mnemonic);
    const hasTwelveWords = mnemonic.split(/\s+/g).length >= 12;
    if (!hasTwelveWords) {
      AlertIOS.prompt(
        'Invalid Phrase',
        'Make sure you entered at least twelve words. Please try again.'
      );
      return;
    }

    try {
      const walletUUID = await generateRandomHexString(12);
      await Keychain.setGenericPassword(walletUUID, mnemonic);
      const addresses = generateWalletAddresses(mnemonic);
      this.setState({ addresses, invalidMnemonic, mnemonic, walletUUID });
      console.error('Mnemonic saved successfully!');
      return { mnemonic, walletUUID };
    } catch (e) {
      console.error('Error while persisting mnemonic: ', e);
    }
  }

  getWalletInfo = (walletUUID, detail, cb) => {
    console.error('Getting wallet info for wallet ', walletUUID);
    this.socket.emit('hd-wallet::get', walletUUID, { tx_detail: detail }, (error, message) => {
      if (error) {
        console.error('Error getting wallet info: ', error);
      } else {
        cb(message);
      }
    });
  }

  resetWalletInfo = () => {
    Keychain
      .resetGenericPassword()
      .then(function() {
        console.error('Wallet info successfully deleted.');
      });
  }

  openTransactionLink = (url) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  resetSendStatus = () => this.setState({ sendResult: null });

  sendTransaction = (amount, toAddress) => {
    const { walletUUID } = this.state;
    this.setState({ sending: true });
    const txPayload = {
      inputs: [{
        wallet_name: walletUUID,
      }],
      outputs: [{
        addresses: [toAddress],
        value: amount,
      }],
    };

    _onSendSuccess = (sentTx) => {
      console.error('SEND SUCCESS: ', sentTx);
      this.setState({ sending: false, sendResult: 'success' });
    }

    _onSendError = (error) => {
      console.error('SEND ERROR: ', error);
      this.setState({ sending: false, sendResult: 'fail' });
    }

    _sendSignedTx = (signedTx) => {
      console.error('SENDING SIGNED TX: ', signedTx);
      this.socket.emit('send-transaction::create', signedTx, (error, sentTx) => {
        if (error) {
          _onSendError(error);
        } else {
          _onSendSuccess(sentTx);
        }
      });
    }

    this.socket.emit('send-transaction::create', txPayload, (error, txToSign) => {
      if (error) {
        _onSendError(error);
      } else {
        const signedTx = this.signTransaction(txToSign);
        _sendSignedTx(signedTx);
      }
    });
  }

  signTransaction = (txToSign, network = process.env.ASSET_NETWORK) => {
    const { mnemonic } = this.state;
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bitcoin.HDNode.fromSeedHex(seed, process.env.ASSET_NETWORK);

    // signing each of the hex-encoded string required to finalize the transaction
    txToSign.pubkeys = [];
    txToSign.signatures = txToSign.tosign.map((tosign, n) => {
      const pair = root.derivePath(txToSign.tx.inputs[n].hd_path);
      txToSign.pubkeys.push(pair.getPublicKeyBuffer().toString("hex"));
      return pair.sign(new Buffer(tosign, "hex")).toDER().toString("hex");
    });

    return txToSign;
  }

  _handleIndexChange = (index) => {
    const { routes } = this.state;
    const routeName = routes[index].name;
    this.setState({ index });
    // Not sure if we should scroll back to home for given coin onOut or onReturn.
    this[routeName].scrollView.scrollTo({ y: height + 1 });
  };

  _renderScene = ({ route }) => {
    const { addresses, index, balanceBTC, sending, sendResult, transactionsBTC } = this.state;
    switch (route.key) {
      case '1':
        return (
          <CoinDetail
            ref={ref => this.dash = ref}
            colorScheme="dash"
            coin="Dash"
            route={route}
            currentRouteIndex={index}
          />
        );
      case '2':
        return (
          <BitcoinDetail
            ref={ref => this.bitcoin = ref}
            colorScheme="bitcoin"
            coin="Bitcoin"
            route={route}
            currentRouteIndex={index}
            balanceBTC={balanceBTC}
            openDrawer={this.openDrawer}
            openTransactionLink={this.openTransactionLink}
            resetSendStatus={this.resetSendStatus}
            sending={sending}
            sendResult={sendResult}
            sendTransaction={this.sendTransaction}
            transactionsBTC={transactionsBTC}
            walletAddresses={addresses}
          />
        );
      case '3':
        return (
          <CoinDetail
            ref={ref => this.litecoin = ref}
            colorScheme="litecoin"
            coin="Litecoin"
            route={route}
            currentRouteIndex={index}
          />
        );
      default:
        return null;
    }
  };

  closeDrawer = () => {
    this._drawer.close();
    StatusBar.setBarStyle('light-content', true);
  };

  openDrawer = () => {
    this._drawer.open();
    StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    const { addresses, initialized, invalidMnemonic, mnemonic, transactionsBTC, walletUUID } = this.state;

    if (!initialized) {
      return (
        <View style={styles.container}>
          <Text>Initializing wallet...</Text>
          <TouchableOpacity onPress={this.resetWalletInfo}>
            <Text>
              <Text>Reset Wallet</Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Drawer
        captureGestures={false}
        content={
          <PreferencesDrawer
            closeDrawer={this.closeDrawer}
            initializeWallet={this.initializeWallet}
            invalidMnemonic={invalidMnemonic}
            mnemonic={mnemonic}
            openTransactionLink={this.openTransactionLink}
            resetWalletInfo={this.resetWalletInfo}
            transactionsBTC={transactionsBTC}
            walletAddresses={addresses}
            walletUUID={walletUUID}
          />
        }
        ref={ref => this._drawer = ref}
        side="right"
        type="overlay"
        tweenEasing={'easeInOutCubic'}
        tweenHandler={tweenHandler}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            onIndexChange={this._handleIndexChange}
          />
          <UserButton openDrawer={this.openDrawer} />
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const tweenHandler = (ratio) => ({
  mainOverlay: {
    backgroundColor: `rgba(71, 71, 71, ${ratio / 1.5})`,
  },
});
