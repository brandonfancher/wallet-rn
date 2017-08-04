import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { StaticNavBar } from './';


const PreferencesDrawer = ({ closeDrawer }) => (
  <View style={styles.container}>
    <StaticNavBar label="Preferences" onBack={closeDrawer} />
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
});

export default PreferencesDrawer;
