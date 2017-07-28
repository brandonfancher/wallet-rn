import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';
// const bitcoin = require('bitcoinjs-lib');
import Mnemonic from './src/lib/jsbip39';

// import io from 'socket.io-client';
// import feathers from 'feathers/client'
// import hooks from 'feathers-hooks';
// import socketio from 'feathers-socketio/client'
// const API_URL = 'http://localhost:3030';


export default class App extends React.Component {

  state = {
    address: '',
    blocks: [],
    mnemonic: null,
    userAddresses: [],
    userMnemonic: 'praise you muffin lion enable neck grocery crumble super myself license ghost',
    userMnemonicIsValid: null,
    userSeed: null,
  };

  // constructor() {
  //   super();
  //   const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
  //   const socket = io(API_URL, options);
  //
  //   this.app = feathers()
  //     .configure(socketio(socket))
  //     .configure(hooks());
  //
  //   this.app.service('block').on('created', newBlock => {
  //     console.log(newBlock);
  //     this.setState({ blocks: [...this.state.blocks, newBlock] })
  //   });
  // }

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

  fillInSeed = () => {
    const { mnemonic } = this.state;
    const newMnemonic = mnemonic.toString();
    this.setState({ userMnemonic: newMnemonic });
  }

  // genBCAddress = () => {
  //   // for testing only
  //   function rng () { return new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }
  //
  //   // generate random keyPair
  //   var keyPair = bitcoin.ECPair.makeRandom({ rng: rng });
  //   var address = keyPair.getAddress();
  //
  //   this.setState({ address });
  // }

  generateAddressFromSeed = () => {
    const { userAddresses, userMnemonic } = this.state;

    const seed = bip39.mnemonicToSeed(userMnemonic);
    const root = bitcoin.HDNode.fromSeedHex(seed);

    const seed1 = root.derivePath("m/0'/0/0").getAddress();
    const seed2 = root.derivePath("m/0'/1/0").getAddress();
    this.setState({ userSeed: 'done', userAddresses: [...userAddresses, seed1, seed2]});
  }

  render() {
    const { address, mnemonic, userMnemonic, userMnemonicIsValid, userAddresses, userSeed } = this.state;
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
        {mnemonic &&
          <TouchableOpacity onPress={this.fillInSeed}>
            <Text>{mnemonic.toString()}</Text>
          </TouchableOpacity>
        }
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(userMnemonic) => this.setState({ userMnemonic })}
          value={userMnemonic}
        />

        <TouchableOpacity onPress={this.generateSeed} style={buttonStyle}>
          <Text>Generate BIP39 Seed</Text>
        </TouchableOpacity>
        <Text>{userSeed}</Text>

        <TouchableOpacity onPress={this.validateUserMnemonic} style={buttonStyle}>
          <Text>Is Valid?</Text>
        </TouchableOpacity>
        <Text>{valid()}</Text>

        <TouchableOpacity onPress={this.generateAddressFromSeed} style={buttonStyle}>
          <Text>Generate Address from Seed</Text>
        </TouchableOpacity>

        <View>
          {userAddresses.map(address => <Text key={address}>{address}</Text>)}
        </View>

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
