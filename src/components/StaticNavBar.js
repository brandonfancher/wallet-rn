import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons';
import CONSTANTS from '../constants';


const StaticNavBar = ({ onBack, label }) => (
  <View style={styles.navBar}>
    <View style={styles.navIcon}>
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
        onPress={onBack}
      >
        <Icon
          name="chevron-left"
          size={54}
          style={{ color: CONSTANTS.COLORS.navIcon, marginTop: 2 }}
          color={CONSTANTS.COLORS.blackText}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.navLabelContainer}>
      <Text style={styles.navLabelText}>{label}</Text>
    </View>
    <View style={styles.navIcon} />
  </View>
);

StaticNavBar.propTypes = {
  onBack: PropTypes.func.isRequired,
  label: PropTypes.string,
};

const styles = StyleSheet.create({
  navBar: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: CONSTANTS.COLORS.borderColor,
    paddingTop: 20,
    flexDirection: 'row',
  },
  navLabelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabelText: {
    color: CONSTANTS.COLORS.blackText,
    fontSize: 23,
    fontWeight: '600',
  },
  navIcon: {
    width: 54,
  }
});

export default StaticNavBar;
