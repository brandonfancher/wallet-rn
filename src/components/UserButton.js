import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';


const UserButton = ({ openDrawer }) => (
  <TouchableOpacity
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10}}
    onPress={openDrawer}
    style={styles.userIconContainer}
  >
    <Icon name="user" size={46} color="white" />
  </TouchableOpacity>
);

UserButton.propTypes = {
  openDrawer: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  userIconContainer: {
    position: 'absolute',
    top: 40,
    right: 22,
    backgroundColor: 'transparent',
  },
});

export default UserButton;
