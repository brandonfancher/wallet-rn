import React from 'react';
import { Dimensions, Linking, ScrollView, Text, View, StyleSheet } from 'react-native';
import moment from 'moment';
import { AccentButton, CryptoIcon, H2 } from './components';
import PropTypes from 'prop-types';
const { height, width } = Dimensions.get('window');
import CONSTANTS from './constants';


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
  };

  static defaultProps = {
    transactionsBTC: [],
  };

  render() {
    const { balanceBTC, colorScheme, coin, openDrawer, openTransactionLink, sendTestTransaction, transactionsBTC } = this.props;
    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
    const charBTC = '';
    const numRecentTransactions = 3;
    return (
      <ScrollView
        contentContainerStyle={{ height: 4 * height, marginHorizontal: 12 }}
        directionalLockEnabled
        onContentSizeChange={(w, h) => this.scrollView.scrollTo({ y: height + 1, animated: false })}
        pagingEnabled
        ref={ref => this.scrollView = ref}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
        scrollsToTop={false}
      >
        <View style={styles.sectionView}>
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
            {transactionsBTC.slice(0, numRecentTransactions).map((tx, i) => (
              <View
                key={`${tx.tx_hash}-${tx.value}`}
                style={[styles.bodyGroup, i !== numRecentTransactions - 1 ? { borderBottomWidth: 0 } : null]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'white'}}>{(tx.value / 100000000)} BTC</Text>
                  {tx.confirmed && <Text style={{ color: 'white'}}>{moment(tx.confirmed).format('llll')}</Text>}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'white' }}>{tx.confirmations < 7 ? `${tx.confirmations} Confirmations` : 'Confirmed'}</Text>
                  <Text style={{ color: 'white' }} onPress={() => openTransactionLink(`https://live.blockcypher.com/bcy/tx/${tx.tx_hash}/`)}>Transaction Details</Text>
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
        </View>

        <View style={styles.sectionView}>
          <Text style={styles.placeholderText}>Scan?</Text>
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
