import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants';


const H2 = ({ children }) => (
  <Text style={styles.h2}>{children.toUpperCase()}</Text>
);

H2.propTypes = {
  children: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  h2: {
    color: CONSTANTS.COLORS.grayText,
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 0.8,
    paddingTop: 36,
    paddingLeft: 20,
    paddingBottom: 10,
  },
});

export default H2;
