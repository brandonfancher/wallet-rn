import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { H2, StaticNavBar } from './';
import CONSTANTS from '../constants';


const PreferencesDrawer = ({ closeDrawer }) => (
  <View style={styles.container}>
    <StaticNavBar label="Preferences" onBack={closeDrawer} />
    <ScrollView style={styles.scrollView}>

      <H2>Backup Phrase</H2>
      <View style={[styles.bodyGroup, styles.centerContents]}>
        <Text style={styles.backupPhrase}>
          {process.env.TEST_MNEMONIC ? process.env.MNEMONIC : ''}
        </Text>
      </View>

      <H2>Development</H2>
      <View style={[styles.bodyGroup, styles.centerContents]}>

      </View>
    </ScrollView>
  </View>
);

PreferencesDrawer.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
};

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
  centerContents: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: CONSTANTS.COLORS.background,
  },
  backupPhrase: {
    color: CONSTANTS.COLORS.blackText,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PreferencesDrawer;
