import React, { PureComponent } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import Drawer from 'react-native-drawer';
import BitcoinDetail from './BitcoinDetail';
import CoinDetail from './CoinDetail';
import { PreferencesDrawer, UserButton } from './components';
const { height, width } = Dimensions.get('window');


export default class SlideView extends PureComponent {
// export default class SlideView extends React.Component {

  state = {
    index: 1,
    routes: [
      { key: '1', name: 'dash' },
      { key: '2', name: 'bitcoin' },
      { key: '3', name: 'litecoin' },
    ],
  };

  _handleIndexChange = (index) => {
    const { routes } = this.state;
    const routeName = routes[index].name;
    this.setState({ index });
    // Not sure if we should scroll back to home for given coin onOut or onReturn.
    this[routeName].scrollView.scrollTo({ y: height + 1 });
  };

  _renderScene = SceneMap({
    '1': ({ route }) => (
      <CoinDetail
        ref={ref => this.dash = ref}
        colorScheme="dash"
        coin="Dash"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
    '2': ({ route }) => (
      <BitcoinDetail
        ref={ref => this.bitcoin = ref}
        colorScheme="bitcoin"
        coin="Bitcoin"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
    '3': ({ route }) => (
      <CoinDetail
        ref={ref => this.litecoin = ref}
        colorScheme="litecoin"
        coin="Litecoin"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
  });

  closeDrawer = () => {
    this._drawer.close();
    StatusBar.setBarStyle('light-content', true);
  };

  openDrawer = () => {
    this._drawer.open();
    StatusBar.setBarStyle('dark-content', true);
  }

  render() {
    return (
      <Drawer
        captureGestures={false}
        content={<PreferencesDrawer closeDrawer={this.closeDrawer} />}
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
