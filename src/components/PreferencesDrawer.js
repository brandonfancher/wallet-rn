import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { H2, StaticNavBar } from './';
import CONSTANTS from '../constants';


export default class PreferencesDrawer extends React.Component {

  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
    transactionsBTC: PropTypes.array.isRequired,
  };

  openTransactionLink = (url) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  render() {
    const { closeDrawer, transactionsBTC } = this.props;
    console.log('Transactions:', transactionsBTC);
    return (
      <View style={styles.container}>
        <StaticNavBar label="Information" onBack={closeDrawer} />
        <ScrollView style={styles.scrollView}>

          <H2>Bitcoin Transactions</H2>
          {transactionsBTC.map(tx => (
            <View
              key={tx.tx_hash}
              style={[styles.bodyGroup, styles.centerContents, styles.borderBottom]}
            >
              <Text>Amount: {(tx.value / 100000000)} BTC</Text>
              {tx.confirmed
                ? <Text>Confirmed: {moment(tx.confirmed).format('llll')}</Text>
                : <Text>Confirmations: {tx.confirmations}</Text>
              }
              <Text>Received From: {}</Text>
              <Text onPress={() => this.openTransactionLink(`https://live.blockcypher.com/bcy/tx/${tx.tx_hash}/`)}>View Transaction Details</Text>
            </View>
          ))}

          <H2>Backup Phrase</H2>
          <View style={[styles.bodyGroup, styles.centerContents]}>
            <Text style={[styles.p, styles.textCenter]}>
              {process.env.TEST_MNEMONIC ? process.env.MNEMONIC : ''}
            </Text>
          </View>

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
