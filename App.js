import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  render() {
    const { mnemonic } = this.state;
    return (
      <View style={styles.container}>
        <Text>Block Go Here</Text>
        {this.state.blocks.map((block, i) => <Text key={`block-${block.hash}`}>{block.hash}</Text>)}
        <TouchableOpacity onPress={this.generateMnemonic}>
          <Text>Generate Mnemonic</Text>
        </TouchableOpacity>
        {mnemonic && <Text>{mnemonic.toString()}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
