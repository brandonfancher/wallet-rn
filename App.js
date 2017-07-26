import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Mnemonic from './src/lib/jsbip39';

import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
const API_URL = 'http://localhost:3030';


export default class App extends React.Component {

  state = {
    blocks: [],
    mnemonic: null,
    userMnemonic: '',
    userMnemonicIsValid: null,
  };

  constructor() {
    super();
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    const socket = io(API_URL, options);

    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks());

    this.app.service('block').on('created', newBlock => {
      console.log(newBlock);
      this.setState({ blocks: [...this.state.blocks, newBlock] })
    });
  }

  generateMnemonic = () => {
    const m = new Mnemonic();
    const words = m.generate();
    this.setState({ mnemonic: words });
  }

  validateUserMnemonic = () => {
    const { userMnemonic } = this.state;
    const m = new Mnemonic();
    this.setState({ userMnemonicIsValid: m.check(userMnemonic)});
  }

  generateSeed = () => {
    const { userMnemonic } = this.state;
    const m = new Mnemonic();
    this.setState({ userSeed: m.toSeed(userMnemonic) });
  }

  render() {
    const { mnemonic, userMnemonic, userMnemonicIsValid, userSeed } = this.state;
    const buttonStyle = { padding: 5, borderColor: 'gray', borderWidth: 1, backgroundColor: '#CCC', borderRadius: 3 };

    const valid = () => {
      if (userMnemonicIsValid) {
        return <Text>YES</Text>;
      } else if (userMnemonicIsValid === false) {
        return <Text>NO</Text>;
      }
    }

    return (
      <View style={styles.container}>
        {/* <Text>Block Go Here</Text>
        {this.state.blocks.map((block, i) => <Text key={`block-${block.hash}`}>{block.hash}</Text>)} */}
        <TouchableOpacity onPress={this.generateMnemonic} style={buttonStyle}>
          <Text>Generate Mnemonic</Text>
        </TouchableOpacity>
        {mnemonic && <Text>{mnemonic.toString()}</Text>}
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(userMnemonic) => this.setState({ userMnemonic })}
          value={userMnemonic}
        />
        <Text>{userMnemonic}</Text>

        <TouchableOpacity onPress={this.generateSeed} style={buttonStyle}>
          <Text>Generate BIP39 Seed</Text>
        </TouchableOpacity>
        <Text>{userSeed}</Text>

        <TouchableOpacity onPress={this.validateUserMnemonic} style={buttonStyle}>
          <Text>Is Valid?</Text>
        </TouchableOpacity>
        <Text>{valid()}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 64,
    // justifyContent: 'center',
  },
});
