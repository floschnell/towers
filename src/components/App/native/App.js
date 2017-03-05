import React from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Dimensions
} from 'react-native';
import firebase from 'firebase';
import LoginContainer from '../../Login/LoginContainer';
import DashboardContainer from '../../Dashboard/DashboardContainer';
import GameContainer from '../../Game/GameContainer';

export default class App extends React.Component {

    componentWillMount() {
        this.props.listenForAuthentication();
    }

    render() {
        return <Navigator
            initialRoute={{ id: 'login' }}
            renderScene={this.navigatorRenderScene.bind(this)} />;
    }

    navigatorRenderScene(route, navigator) {
        const windowDimensions = Dimensions.get('window');
        switch (route.id) {
            case 'login':
                if (this.props.user) {
                    if (this.props.game) {
                        return <GameContainer height={windowDimensions.height} width={windowDimensions.width} />;
                    } else {
                        return <DashboardContainer />;
                    }
                } else {
                    return <LoginContainer navigator={navigator} />;
                }
            default:
                return <View><Text>unknown</Text></View>;
        }
    }
}
