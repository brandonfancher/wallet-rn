import React, { PureComponent } from 'react';
import { Dimensions, Linking, StatusBar, StyleSheet, View } from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import Drawer from 'react-native-drawer';

import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';

import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';

import { generateWalletAddresses } from './helpers/coin';

import BitcoinDetail from './BitcoinDetail';
import CoinDetail from './CoinDetail';
import { PreferencesDrawer, UserButton } from './components';

const { height, width } = Dimensions.get('window');


export default class SlideView extends PureComponent {

  state = {
    index: 1,
    routes: [
      { key: '1', name: 'dash' },
      { key: '2', name: 'bitcoin' },
      { key: '3', name: 'litecoin' },
    ],
    balanceBTC: 0,
    transactionsBTC: [],
    mnemonic: process.env.TEST_MNEMONIC ? process.env.MNEMONIC : '',
    addresses: [],
  };

  componentWillMount = () => {
    const { mnemonic } = this.state;
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    console.log('API URL: ', process.env.API_URL);
    this.socket = io(process.env.API_URL, options);
    const addresses = generateWalletAddresses(mnemonic);

    this.app = feathers()
      .configure(socketio(this.socket))
      .configure(hooks());

    this.socket.on('connect', () => {
      console.info('Connecting socket.');
      // This event should give the server something unique so that the server will know which events
      // to send to this particular connection. E.g., the wallet name, an array of addresses to listen
      // for transactions on, etc. That way, the server can filter events for this connected client.
      // Probably a UUID that serves as the wallet name and is stored in some persisted local storage.

      this.socket.emit('registerSocket', addresses, (error, message) => {
        console.info('Registering device.');
        console.log('Response: ', message);
      });
    });

    this.getWalletInfo('full', (message) => {
      console.log('Wallet Info: ', message);
      this.setState({
        addresses,
        balanceBTC: message.balance,
        transactionsBTC: message.txs,
      });
    });

    this.socket.emit('webhook::create', { type: 'tx-confirmation', walletName: process.env.WALLET_NAME }, (error, message) => {
      console.log('Response: ', message);
    });

    this.app.service('confirmation').on('created', event => {
      console.log('Event: ', event);
      this.getWalletInfo('full', (message) => {
        console.log('Updating Balance: ', message.balance);
        this.setState({
          balanceBTC: message.balance,
          transactionsBTC: message.txs,
        });
      });
    });
  }

  getWalletInfo = (detail, cb) => {
    this.socket.emit('hd-wallet::get', process.env.WALLET_NAME, { tx_detail: detail }, (error, message) => {
      if (error) {
        console.error('Error getting wallet info: ', error);
      } else {
        cb(message);
      }
    });
  }

  openTransactionLink = (url) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  sendTransaction = (amount, toAddress) => {
    const walletName = process.env.WALLET_NAME;
    const txPayload = {
      inputs: [{
        wallet_name: walletName,
      }],
      outputs: [{
        addresses: [toAddress],
        value: amount,
      }],
    };

    this.socket.emit('send-transaction::create', txPayload, (error, txToSign) => {
      const signedTx = this.signTransaction(txToSign);
      console.log('Signed Transaction: ', signedTx);
      console.log(this.socket);

      this.socket.emit('send-transaction::create', signedTx, (error, sentTx) => {
        console.log('Transaction Send Response: ', sentTx);
      });
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
    const { addresses, index, balanceBTC, transactionsBTC } = this.state;
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
    const { addresses, transactionsBTC } = this.state;
    return (
      <Drawer
        captureGestures={false}
        content={
          <PreferencesDrawer
            closeDrawer={this.closeDrawer}
            openTransactionLink={this.openTransactionLink}
            transactionsBTC={transactionsBTC}
            walletAddresses={addresses}
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
