import React from 'react';
import { AlertIOS, Dimensions, Linking, ScrollView, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import QRCode from 'react-native-qrcode';
// import Camera from 'react-native-camera';
import moment from 'moment';
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
    transactionsBTC: PropTypes.array.isRequired,
    walletAddresses: PropTypes.array.isRequired,
  };

  static defaultProps = {
    transactionsBTC: [],
  };

  state = {
    scanMode: false,
  };

  _onScanFail = (cb) => {
    AlertIOS.alert('Oops!', "We didn't quite get that. Check the QR code and try again.", cb);
  }

  _onScanSuccess = (paymentDetails) => {
    this.setState({ scanMode: false }, AlertIOS.alert('Booyah!', paymentDetails));
  }

  _onScanCancel = () => {
    this.setState({ scanMode: false });
  }

  scanMode = () => {
    this.setState({ scanMode: true });
  }

  render() {
    const { scanMode } = this.state;
    const {
      balanceBTC,
      colorScheme,
      coin,
      openDrawer,
      openTransactionLink,
      sendTestTransaction,
      transactionsBTC,
      walletAddresses
    } = this.props;

    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
    const charBTC = '';
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
            bgColor="white"
            fgColor={CONSTANTS.COLORSCHEMES[colorScheme].background}
            size={250}
            value={`bitcoin:${walletAddresses[0]}`}
          />
          <Text style={styles.placeholderText}>Receive</Text>
        </View>

        <View style={styles.sectionView}>
          <View style={{ flex: 1.9, justifyContent: 'center' }}>
            <CryptoIcon
              onPress={() => sendTestTransaction('C29ZLvrz9WzBZ2MagUReu475Mr38N2CNza')}
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
          <Text style={styles.placeholderText}>Send</Text>
          <AccentButton label="Scan QR" color={colors.primary} onPress={this.scanMode} />
          {scanMode && (
            <QRScan
              colorScheme={colorScheme}
              onCancel={this._onScanCancel}
              onFail={this._onScanFail}
              onSuccess={this._onScanSuccess}
            />
          )}
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
