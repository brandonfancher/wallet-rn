import React, { Component } from 'react';
import { StatusBar, StyleSheet, VibrationIOS, View } from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';
import { AccentButton } from './';
import CONSTANTS from '../constants';

const device = DeviceInfo.getModel();


export default class QRCodeScreen extends Component {

  static propTypes = {
    buttonTitle: PropTypes.string,
    colorScheme: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    onFail: PropTypes.func,
    onSuccess: PropTypes.func,
  }

  static defaultProps = {
    buttonTitle: 'Cancel',
  }

  state = {
    readyForScan: true,
  }

  _onPressCancel = () => {
    requestAnimationFrame(() => {
      this.props.navigator.pop();
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    });
  }

  _onPressMock = () => {
    const paymentDetails = `bitcoin:C29ZLvrz9WzBZ2MagUReu475Mr38N2CNza`;
    this._onSuccess(paymentDetails);
  }

  _onSuccess = (paymentDetails) => {
    const { onSuccess } = this.props;
    setTimeout(() => {
      VibrationIOS.vibrate();
      onSuccess(paymentDetails);
    }, 800);
  }

  _onFail = () => {
    VibrationIOS.vibrate();
    this.props.onFail(() => this.setState({ readyForScan: true }));
  }

  _onBarCodeRead = (code) => {
    if (this.state.readyForScan) {
      this.setState({ readyForScan: false })
      let qr = code.data;
      try {
        this._onSuccess(qr);
      } catch(e) {
        console.error(e); // TODO: Log this properly.
        this._onFail();
      }
    }
  }

  render() {
    const { buttonTitle, colorScheme } = this.props;
    const colors = CONSTANTS.COLORSCHEMES[colorScheme];

    return (
      <View style={styles.cameraContainer}>
        <StatusBar hidden />
        <Camera onBarCodeRead={this._onBarCodeRead} captureAudio={false} style={styles.camera}>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}/>
          </View>
        </Camera>
        <View style={styles.buttonContainer}>
          {device === "Simulator" ? <AccentButton onPress={this._onPressMock} color={colors.primary} label="Mock" /> : null}
          <AccentButton label={buttonTitle} onPress={this._onPressCancel} color={colors.primary} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
