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
    colorScheme: PropTypes.string.isRequired,
    coin: PropTypes.string.isRequired,
  };

  render() {
    const { colorScheme, coin } = this.props;
    const colors = CONSTANTS.COLORSCHEMES[colorScheme];
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
          <View style={{ position: 'absolute', top: 44 }}>
            <Text style={styles.placeholderText}>{coin}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white' }} adjustsFontSizeToFit>
              <CryptoIcon name="bitcoin" size={52} color="white" />
              <Text style={{ color: 'white', fontSize: 108 }}>1500</Text>
              <Text style={{ color: 'white', fontSize: 52 }}>00342</Text>
            </Text>
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
