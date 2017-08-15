import React from 'react';
import { Dimensions, ScrollView, Text, View, StyleSheet } from 'react-native';
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
  };

  render() {
    const { balanceBTC, colorScheme, coin } = this.props;
    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
    const charBTC = '';
    return (
      <ScrollView
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
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <CryptoIcon name="bitcoin-alt" size={82} color="white" />
          </View>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: '94%', height: 200 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 200, height: '100%' }} numberOfLines={1} adjustsFontSizeToFit>
                {(balanceBTC / 100000000).toFixed(8)}
              </Text>
            </View>
          </View>

          <View style={{ position: 'absolute', bottom: 32 }}>
            <AccentButton label="View More" color={colors.primary} />
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
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 26,
  },
  balanceText: {
    color: 'white',
    fontSize: 108,
  },
});
