import React, { PureComponent } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import Drawer from 'react-native-drawer';
import CoinDetail from './CoinDetail';
import { UserButton } from './components';
import Icon from 'react-native-vector-icons/EvilIcons';
const { height, width } = Dimensions.get('window');


const UserDrawer = ({ closeDrawer }) => (
  <TouchableOpacity
    activeOpacity={1}
    style={[styles.container, {
      backgroundColor: 'blue',
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    }]}
    onPress={closeDrawer}
  >
    <Text style={{ color: 'white', fontSize: 40 }}>Profile</Text>
  </TouchableOpacity>
);

export default class SlideView extends PureComponent {

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
        backgroundColor="#55bbeb"
        coin="Dash"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
    '2': ({ route }) => (
      <CoinDetail
        ref={ref => this.bitcoin = ref}
        backgroundColor="#06b07d"
        coin="Bitcoin"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
    '3': ({ route }) => (
      <CoinDetail
        ref={ref => this.litecoin = ref}
        backgroundColor="#ffe14d"
        coin="Litecoin"
        route={route}
        currentRouteIndex={this.state.index}
      />
    ),
  });

  closeDrawer = () => this._drawer.close();
  openDrawer = () => this._drawer.open();

  render() {
    return (
      <Drawer
        content={<UserDrawer closeDrawer={this.closeDrawer} />}
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
