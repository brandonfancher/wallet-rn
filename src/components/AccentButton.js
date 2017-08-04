import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


const AccentButton = ({ color, label }) => (
  <TouchableOpacity
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
    style={[styles.accentButtonContainer, { backgroundColor: color }]}
  >
    <Text style={styles.labelText}>{label}</Text>
  </TouchableOpacity>
);

AccentButton.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  accentButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    margin: 10,
  },
  labelText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AccentButton;
