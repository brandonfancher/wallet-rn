import React from 'react';
import { AlertIOS, Dimensions, Linking, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
import moment from 'moment';
import bitcoin from 'react-native-bitcoinjs-lib';
import networks from './helpers/networks';
import { toSatoshi } from './helpers/coin';
import { AccentButton, CryptoIcon, H2, QRScan } from './components';
const { height, width } = Dimensions.get('window');
import CONSTANTS from './constants';
import parseTransactions from './helpers/parseTransactions';


// TODO: This will likely need to merge back into the CoinDetail component.
// Only separated it out for dev purposes, focusing on Bitcoin first.
export default class BitcoinDetail extends React.Component {

  static propTypes = {
    balanceBTC: PropTypes.number.isRequired,
    colorScheme: PropTypes.string.isRequired,
    coin: PropTypes.string.isRequired,
    openDrawer: PropTypes.func.isRequired,
    openTransactionLink: PropTypes.func.isRequired,
    resetSendStatus: PropTypes.func.isRequired,
    sending: PropTypes.bool.isRequired,
    sendResult: PropTypes.string,
    sendTransaction: PropTypes.func.isRequired,
    transactionsBTC: PropTypes.array.isRequired,
    walletAddresses: PropTypes.array.isRequired,
  };

  static defaultProps = {
    transactionsBTC: [],
  };

  state = {
    amountToSend: '',
    sendTo: '',
    scanMode: false,
  };

  _handleAmountInput = (amount) => this.setState({ amountToSend: amount });
  _handleSendToInput = (address) => this.setState({ sendTo: address });

  _onScanFail = (cb) => {
    AlertIOS.alert('Oops!', "We didn't quite get that. Check the QR code and try again.", cb);
  }

  _onScanSuccess = (paymentDetails) => {
    // TODO: Run checks on the non-address parts of the QR reading.
    const parsed = paymentDetails.split(/:|\?|=/);
    const address = parsed[1];
    const amount = parsed[3] || '0';

    if (this.validateAddress(address)) {
      this.setState({
        amountToSend: amount,
        scanMode: false,
        sendTo: address,
      });
    } else {
      AlertIOS.alert('Address not valid.');
    }
  }

  _onScanCancel = () => {
    this.setState({ scanMode: false });
  }

  validateAddress = (address) => {
    try {
      bitcoin.address.fromBase58Check(address);
      bitcoin.address.toOutputScript(address, networks.blockcypherTestChain);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  setScanMode = () => {
    this.setState({ scanMode: true });
  }

  renderSendScreen = () => {
    const { amountToSend, scanMode, sendTo } = this.state;
    const { colorScheme, sending, resetSendStatus, sendResult, sendTransaction, transactionsBTC, walletAddresses } = this.props;

    const colors = CONSTANTS.COLORSCHEMES[colorScheme];

    if (sending) {
      return <Text style={styles.placeholderText}>Sending...</Text>;
    } else if (sendResult === 'success') {
      return (
        <View>
          <Text style={styles.placeholderText}>Send Successful</Text>
          <AccentButton
            label="Okay"
            color={colors.primary}
            onPress={resetSendStatus}
          />
        </View>
      );
    } else if (sendResult === 'fail') {
      return (
        <View>
          <Text style={styles.placeholderText}>Send Failed</Text>
          <AccentButton
            label="Back"
            color={colors.primary}
            onPress={resetSendStatus}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.placeholderText}>Send</Text>
          {scanMode
            ? <View>
                <QRScan
                  colorScheme={colorScheme}
                  onCancel={this._onScanCancel}
                  onFail={this._onScanFail}
                  onSuccess={this._onScanSuccess}
                />
              </View>
            : <View style={{ width: 300, height: 150 }}>
                <TextInput
                  style={{ height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: 'white' }}
                  onChangeText={this._handleAmountInput}
                  keyboardType="numeric"
                  placeholder="BTC Amount To Send"
                  returnKeyType="next"
                  value={amountToSend}
                />
                <TextInput
                  style={{ height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: 'white' }}
                  onChangeText={this._handleSendToInput}
                  autoCorrect={false}
                  placeholder="Address"
                  returnKeyType="done"
                  value={sendTo}
                />
                <AccentButton label="Scan QR" color={colors.primary} onPress={this.setScanMode} />
              </View>
          }
          {sendTo && amountToSend && parseFloat(amountToSend) > 0
            ? <AccentButton
                label="Send"
                color={colors.primary}
                onPress={() => sendTransaction(toSatoshi(amountToSend), sendTo)}
              />
            : null
          }
        </View>
      );
    }
  }

  render() {
    const { balanceBTC, colorScheme, openDrawer, openTransactionLink, transactionsBTC, walletAddresses } = this.props;

    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
    const numRecentTransactions = 3;
    const txs = parseTransactions(transactionsBTC, walletAddresses);

    return (
      <ScrollView
        contentContainerStyle={{ height: 3 * height, marginHorizontal: 12 }}
        directionalLockEnabled
        onContentSizeChange={(w, h) => this.scrollView.scrollTo({ y: height + 1, animated: false })}
        pagingEnabled
        ref={ref => this.scrollView = ref}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
        scrollsToTop={false}
      >
        <View style={styles.sectionView}>
          <QRCode
            fgColor="white"
            bgColor="black"
            size={250}
            value={`bitcoin:${walletAddresses[0]}`}
          />
          <Text style={styles.placeholderText}>Receive</Text>
        </View>

        <View style={styles.sectionView}>
          <View style={{ flex: 1.9, justifyContent: 'center' }}>
            <CryptoIcon
              name="bitcoin-alt"
              size={82}
              color="white"
              style={{ marginTop: 50 }}
            />
          </View>

          <View style={{ height: 140, justifyContent: 'center', alignSelf: 'stretch', alignItems: 'stretch' }}>
            <Text style={{ color: 'white', fontSize: 200, height: '100%', textAlign: 'center' }} numberOfLines={1} adjustsFontSizeToFit>
              {(balanceBTC / 100000000).toFixed(8)}
            </Text>
          </View>

          <View style={{ flex: 1.1, alignSelf: 'stretch', alignItems: 'stretch' }}>
            <H2 style={{ color: 'white', paddingTop: 0, paddingLeft: 0 }}>Recent Transactions</H2>
            {txs.slice(0, numRecentTransactions).map((tx, i) => (
              <View
                key={`${tx.txHash}-${tx.value}`}
                style={[styles.bodyGroup, i !== numRecentTransactions - 1 ? { borderBottomWidth: 0 } : null]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'white'}}>{tx.io === 'INCOMING' ? '+' : '-'}{(tx.value / 100000000)} BTC</Text>
                  <Text style={{ color: 'white'}}>{moment(tx.receivedTime).format('llll')}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'white' }}>{tx.confirmed ? 'Confirmed' : `${tx.confirmations} Confirmations`}</Text>
                  <Text style={{ color: 'white' }} onPress={() => openTransactionLink(`https://live.blockcypher.com/bcy/tx/${tx.exploreUri}/`)}>Transaction Details</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginVertical: 32 }}>
            <AccentButton label="View More" color={colors.primary} onPress={openDrawer} />
          </View>
        </View>

        <View style={styles.sectionView}>
          {this.renderSendScreen()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sectionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
  },
  balanceText: {
    color: 'white',
    fontSize: 108,
  },
  bodyGroup: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'white',
    paddingVertical: 6,
  },
});
