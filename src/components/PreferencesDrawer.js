import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import { H2, StaticNavBar } from './';
import CONSTANTS from '../constants';
import parseTransactions from '../helpers/parseTransactions';


export default class PreferencesDrawer extends React.Component {

  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    openTransactionLink: PropTypes.func.isRequired,
    transactionsBTC: PropTypes.array.isRequired,
    walletAddresses: PropTypes.array.isRequired,
  };

  static defaultProps = {
    transactionsBTC: [],
  };

  persistMnemonic = () => {
    Keychain
      .setGenericPassword('mnemonic', 'Brandon')
      .then(function() {
        console.log('Credentials saved successfully!');
      });
  }

  recallMnemonic = () => {
    Keychain
      .getGenericPassword()
      .then(function(credentials) {
        console.log('Credentials successfully loaded for user ' + credentials.password);
      }).catch(function(error) {
        console.log('Keychain couldn\'t be accessed! Maybe no value set?', error);
      });
  }

  render() {
    const { closeDrawer, openTransactionLink, transactionsBTC, walletAddresses } = this.props;
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
              <Text onPress={() => openTransactionLink(`https://live.blockcypher.com/bcy/tx/${tx.exploreUri}/`)}>Transaction Details</Text>
            </View>
          ))}

          <H2>Backup Phrase</H2>
          <View style={[styles.bodyGroup, styles.centerContents]}>
            <Text style={[styles.p, styles.textCenter]}>
              {process.env.TEST_MNEMONIC ? process.env.MNEMONIC : ''}
            </Text>
          </View>
          <TouchableOpacity style={[styles.bodyGroup, styles.centerContents]} onPress={this.persistMnemonic}>
            <Text style={[styles.p, styles.textCenter]}>
              Set to "Brandon"
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bodyGroup, styles.centerContents]} onPress={this.recallMnemonic}>
            <Text style={[styles.p, styles.textCenter]}>
              Recall Mnemonic
            </Text>
          </TouchableOpacity>

          <H2>Development</H2>
          <View style={[styles.bodyGroup, styles.contents]}>
            <Text style={styles.p}>
              <Text style={styles.bold}>Wallet Name: </Text>
              <Text>Test</Text>
            </Text>
          </View>
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
