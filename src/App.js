import React, { PureComponent } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import CoinDetail from './CoinDetail';
const { height, width } = Dimensions.get('window');


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

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
