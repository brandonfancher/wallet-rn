import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import bitcoin from 'react-native-bitcoinjs-lib';
import bip39 from 'react-native-bip39';
import networks from './helpers/networks';

// import io from 'socket.io-client';
// import feathers from 'feathers/client'
// import hooks from 'feathers-hooks';
// import socketio from 'feathers-socketio/client'


export default class App extends React.Component {

  // constructor() {
  //   super();
  //   const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
  //   const socket = io(process.env.API_URL, options);
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

  state = {
    // address: '',
    // blocks: [],
    mnemonic: process.env.TEST_MNEMONIC ? process.env.MNEMONIC : '',
    addresses: [],
    mnemonicIsValid: null,
    userSeed: null,
    xpub: '',
  };

  static generateMnemonic = async (bitsOfEntropy = 128) => {
    try {
      return await bip39.generateMnemonic(bitsOfEntropy);
    } catch (e) {
      console.error('Error while generating key: ', e);
      return false;
    }
  }

  setNewMnemonic = async () => {
    const words = await App.generateMnemonic();
    this.setState({ mnemonic: words });
  }

  validateUserMnemonic = () => {
    const { mnemonic } = this.state;
    const mnemonicIsValid = bip39.validateMnemonic(mnemonic);
    this.setState({ mnemonicIsValid });
  }

  generateSeed = () => {
    const { mnemonic } = this.state;
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    this.setState({ userSeed: seed });
  }

  generateAddressFromSeed = (network = process.env.ASSET_NETWORK) => {
    const { addresses, mnemonic } = this.state;

    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bitcoin.HDNode.fromSeedHex(seed, network);
    const xpub = root.neutered().toBase58();

    const seed1 = root.derivePath("m/0").getAddress();
    const seed2 = root.derivePath("m/1").getAddress();
    this.setState({ addresses: [...addresses, seed1, seed2], xpub });
  }

  render() {
    const { mnemonic, mnemonicIsValid, addresses, userSeed, xpub } = this.state;
    const buttonStyle = { padding: 5, borderColor: 'gray', borderWidth: 1, backgroundColor: '#CCC', borderRadius: 3 };

    const valid = () => {
      if (mnemonicIsValid) {
        return <Text>YES</Text>;
      } else if (mnemonicIsValid === false) {
        return <Text>NO</Text>;
      }
    }

    return (
      <View style={styles.container}>
        {/* <Text>Block Go Here</Text>
        {this.state.blocks.map((block, i) => <Text key={`block-${block.hash}`}>{block.hash}</Text>)} */}
        <TouchableOpacity onPress={this.setNewMnemonic} style={buttonStyle}>
          <Text>Generate Mnemonic</Text>
        </TouchableOpacity>
        <TextInput
          onChangeText={(mnemonic) => this.setState({ mnemonic })}
          multiline
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          value={mnemonic}
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
          {addresses.map(address => <Text key={address}>{address}</Text>)}
        </View>

        <View>
          <Text>xpub: {xpub}</Text>
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
