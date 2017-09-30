import React from 'react';
import { AlertIOS, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { H2, StaticNavBar } from './';
import CONSTANTS from '../constants';
import parseTransactions from '../helpers/parseTransactions';


export default class PreferencesDrawer extends React.Component {

  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    initializeWallet: PropTypes.func.isRequired,
    invalidMnemonic: PropTypes.bool,
    mnemonic: PropTypes.string,
    openTransactionLink: PropTypes.func.isRequired,
    resetWalletInfo: PropTypes.func.isRequired,
    transactionsBTC: PropTypes.array.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    walletUUID: PropTypes.string,
  };

  static defaultProps = {
    transactionsBTC: [],
  };

  promptForMnemonic = () => {
    AlertIOS.prompt('Enter Mnemonic', null, (text) => {
      const trimmedInput = text.trim();
      this.props.initializeWallet(trimmedInput);
    });
  }

  render() {
    const {
      closeDrawer,
      mnemonic,
      openTransactionLink,
      resetWalletInfo,
      transactionsBTC,
      walletAddresses,
      walletUUID
    } = this.props;
    const txs = parseTransactions(transactionsBTC, walletAddresses);

    return (
      <View style={styles.container}>
        <StaticNavBar label="Information" onBack={closeDrawer} />
        <ScrollView style={styles.scrollView}>

          <H2>Bitcoin Transactions</H2>
          {txs.map(tx => (
            <View
              key={`${tx.txHash}-${tx.value}`}
              style={[styles.bodyGroup, styles.centerContents, styles.borderBottom]}
            >
              <Text>Amount: {tx.io === 'INCOMING' ? '+' : '-'}{(tx.value / 100000000)} BTC</Text>
              {tx.confirmed && <Text>{moment(tx.receivedTime).format('llll')}</Text>}
              <Text>{tx.confirmed ? 'Confirmed' : `${tx.confirmations} Confirmations`}</Text>
              {/* <Text>Received From: {}</Text> */}
              <Text onPress={() => openTransactionLink(`https://live.blockcypher.com/bcy/tx/${tx.exploreUri}/`)}>
                Transaction Details
              </Text>
            </View>
          ))}

          <H2>Backup Phrase</H2>
          <View style={[styles.bodyGroup, styles.centerContents]}>
            <Text style={[styles.p, styles.textCenter]}>{mnemonic}</Text>
          </View>
          <TouchableOpacity style={[styles.bodyGroup, styles.centerContents]} onPress={this.promptForMnemonic}>
            <Text style={[styles.p, styles.textCenter]}>Restore Wallet from Mnemonic</Text>
          </TouchableOpacity>

          <H2>Development</H2>
          <View style={[styles.bodyGroup, styles.contents]}>
            <Text style={styles.p}>
              <Text>{walletUUID}</Text>
            </Text>
          </View>
          <TouchableOpacity style={[styles.bodyGroup, styles.contents]} onPress={resetWalletInfo}>
            <Text style={styles.p}>
              <Text>Reset Wallet</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bodyGroup: {
    backgroundColor: 'white',
    height: 80,
    paddingHorizontal: 20,
  },
  contents: {
    justifyContent: 'center',
  },
  centerContents: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: CONSTANTS.COLORS.background,
  },
  p: {
    color: CONSTANTS.COLORS.blackText,
    fontSize: 15,
  },
  textCenter: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '500',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: CONSTANTS.COLORS.borderColor,
    borderStyle: 'solid',
  },
});
