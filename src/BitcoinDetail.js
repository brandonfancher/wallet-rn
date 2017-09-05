import React from 'react';
import { Dimensions, ScrollView, Text, View, StyleSheet } from 'react-native';
import moment from 'moment';
import { AccentButton, CryptoIcon } from './components';
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
    transactionsBTC: PropTypes.array.isRequired,
  };

  render() {
    const { balanceBTC, colorScheme, coin, openDrawer, transactionsBTC } = this.props;
    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
    const charBTC = '';
    const numRecentTransactions = 5;
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
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <CryptoIcon name="bitcoin-alt" size={82} color="white" style={{ marginTop: 50 }} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'stretch', alignItems: 'stretch' }}>
            <Text style={{ color: 'white', fontSize: 200, height: '100%', textAlign: 'center' }} numberOfLines={1} adjustsFontSizeToFit>
              {(balanceBTC / 100000000).toFixed(8)}
            </Text>
          </View>

          <View style={{ flex: 1, alignSelf: 'stretch', alignItems: 'stretch' }}>
            {transactionsBTC.slice(0, numRecentTransactions).map((tx, i) => (
              <View
                key={tx.tx_hash}
                style={[styles.bodyGroup, i !== numRecentTransactions - 1 ? { borderBottomWidth: 0 } : null]}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'white'}}>{(tx.value / 100000000)} BTC</Text>
                  {tx.confirmed
                    ? <Text style={{ color: 'white'}}>{moment(tx.confirmed).format('llll')}</Text>
                    : <Text style={{ color: 'white'}}>{tx.confirmations} Confirmations</Text>
                  }
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
    // height: height,
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
    // height: 80,
  },
});