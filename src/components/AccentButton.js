import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


export default class AccentButton extends React.Component {

  static propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  render() {
    const { color, label, onPress } = this.props;
    return (
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
        onPress={onPress}
        style={[styles.accentButtonContainer, { backgroundColor: color }]}
      >
        <Text style={styles.labelText}>{label}</Text>
      </TouchableOpacity>
    );
  }
}

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
    fontSize: 16,
    fontWeight: 'bold',
  },
});
