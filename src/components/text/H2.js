import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants';


export default class H2 extends React.Component {

  static propTypes = {
    children: PropTypes.string.isRequired,
    style: PropTypes.object,
  };

  render() {
    const { children, style } = this.props;
    return (
      <Text style={[styles.h2, style]}>{children.toUpperCase()}</Text>
    );
  }
}

const styles = StyleSheet.create({
  h2: {
    color: CONSTANTS.COLORS.grayText,
    fontWeight: '400',
    fontSize: 12,
    letterSpacing: 0.8,
    paddingTop: 36,
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
