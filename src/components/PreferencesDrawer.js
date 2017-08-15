import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { H2, StaticNavBar } from './';
import CONSTANTS from '../constants';


export default class PreferencesDrawer extends React.Component {

  static propTypes = {
    closeDrawer: PropTypes.func.isRequired,
  };

  render() {
    const { closeDrawer } = this.props;
    return (
      <View style={styles.container}>
        <StaticNavBar label="Information" onBack={closeDrawer} />
        <ScrollView style={styles.scrollView}>

          <H2>Bitcoin Transactions</H2>
          <View style={[styles.bodyGroup, styles.centerContents]}>
            <Text style={[styles.p, styles.textCenter]}>
              {process.env.TEST_MNEMONIC ? process.env.MNEMONIC : ''}
            </Text>
          </View>

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
});
