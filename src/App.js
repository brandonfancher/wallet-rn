import React, { PureComponent } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import Drawer from 'react-native-drawer';
import BitcoinDetail from './BitcoinDetail';
import CoinDetail from './CoinDetail';
import { PreferencesDrawer, UserButton } from './components';
const { height, width } = Dimensions.get('window');

import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';


export default class SlideView extends PureComponent {

  state = {
    index: 1,
    routes: [
      { key: '1', name: 'dash' },
      { key: '2', name: 'bitcoin' },
      { key: '3', name: 'litecoin' },
    ],
    balanceBTC: 0,
    transactionsBTC: [],
  };

  constructor() {
    super();
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    console.log('API URL: ', process.env.API_URL);
    this.socket = io(process.env.API_URL, options);

    this.app = feathers()
      .configure(socketio(this.socket))
      .configure(hooks());

    this.socket.emit('hd-wallet::get', process.env.WALLET_NAME, { tx_detail: 'concise' }, (error, message) => {
      console.log('Response: ', message);
      this.setState({
        balanceBTC: message.balance,
        transactionsBTC: message.txrefs,
      });
    });

    // this.app.service('block').on('created', newBlock => {
    //   console.log(newBlock);
    //   this.setState({ blocks: [...this.state.blocks, newBlock] })
    // });
  }

  _handleIndexChange = (index) => {
    const { routes } = this.state;
    const routeName = routes[index].name;
    this.setState({ index });
    // Not sure if we should scroll back to home for given coin onOut or onReturn.
    this[routeName].scrollView.scrollTo({ y: height + 1 });
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <CoinDetail
            ref={ref => this.dash = ref}
            colorScheme="dash"
            coin="Dash"
            route={route}
            currentRouteIndex={this.state.index}
          />
        );
      case '2':
        return (
          <BitcoinDetail
            ref={ref => this.bitcoin = ref}
            colorScheme="bitcoin"
            coin="Bitcoin"
            route={route}
            currentRouteIndex={this.state.index}
            balanceBTC={this.state.balanceBTC}
          />
        );
      case '3':
        return (
          <CoinDetail
            ref={ref => this.litecoin = ref}
            colorScheme="litecoin"
            coin="Litecoin"
            route={route}
            currentRouteIndex={this.state.index}
          />
        );
      default:
        return null;
    }
  };

  closeDrawer = () => {
    this._drawer.close();
    StatusBar.setBarStyle('light-content', true);
  };

  openDrawer = () => {
    this._drawer.open();
    StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    const { transactionsBTC } = this.state;
    return (
      <Drawer
        captureGestures={false}
        content={<PreferencesDrawer transactionsBTC={transactionsBTC} closeDrawer={this.closeDrawer} />}
        ref={ref => this._drawer = ref}
        side="right"
        type="overlay"
        tweenEasing={'easeInOutCubic'}
        tweenHandler={tweenHandler}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            onIndexChange={this._handleIndexChange}
          />
          <UserButton openDrawer={this.openDrawer} />
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const tweenHandler = (ratio) => ({
  mainOverlay: {
    backgroundColor: `rgba(71, 71, 71, ${ratio / 1.5})`,
  },
});
