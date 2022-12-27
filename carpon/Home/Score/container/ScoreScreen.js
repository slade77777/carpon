import * as React from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';
import Benefits from "./Benefits";
import CurrentScore from "./CurrentScore";
import CarLifeScore from "./CarLifeScore";
import {connect} from "react-redux";
import {changeTab} from "../../../common/actions/metadata";

@connect(
    state => ({
        tabNumber: state.metadata.scoreScreenTabNumber
    }),
    dispatch => ({
        changeTab: (tab, rank) => dispatch(changeTab(tab, rank)),
    })
)

export default class ScoreScreen extends React.Component {

    _handleIndexChange = index => {
        this.props.changeTab(index);
    };

    _renderTabBar = props => {
        return (
            <View style={{
                height: 40,
                flexDirection: 'row',
                borderBottomColor: '#4B9FA5',
                borderBottomWidth: 1,
                backgroundColor: '#333333'
            }}>
                {props.navigationState.routes.map((route, i) => {
                    const textColor = this.props.tabNumber === i ? '#4B9FA5' : '#FFFFFF';
                    const borderColor = this.props.tabNumber === i ? '#4B9FA5' : '#333333';
                    return (
                        <TouchableOpacity activeOpacity={1}
                                          key={i}
                                          style={{
                                              width: i === 2 ? '30%' : '35%',
                                              height: '100%',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              borderBottomWidth: 2,
                                              borderBottomColor: borderColor
                                          }}
                                          onPress={() => this.props.changeTab(i)}>
                            <Animated.Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: textColor
                            }}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    _renderScene = SceneMap({
        'CurrentScore': () => <CurrentScore/>,
        'CarLifeScore': () => <CarLifeScore navigation={this.props.navigation}/>,
        'Benefits': () => <Benefits/>,
    });

    render() {
        let navigationState = {
            index: this.props.tabNumber,
            routes: [
                {
                    title: '現在のスコア',
                    key: 'CurrentScore',
                },
                {
                    title: 'スコアアップ',
                    key: 'CarLifeScore',
                },
                {
                    title: 'ランク特典',
                    key: 'Benefits',
                }
            ]
        };
        return (
            <View style={{
                height: '100%',
                alignContent: 'flex-start',
                backgroundColor: '#EFEFEF',
            }}>
                <TabView
                    navigationState={navigationState}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                />
            </View>
        );
    }
}
