import React, {Component} from 'react';
import {Animated, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import News from "../../../../components/News/News";
import {updateTab} from "../action/newsAction";
import {connect} from 'react-redux';
import {SceneMap, TabView} from "react-native-tab-view";
import _ from 'lodash';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import NewsFlowCar from "../../../../components/News/NewsFlowCar";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/perf'
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";

@connect((state) => ({
    carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : {},
    tab: state.news.tab,
    updateTab: state.news.updateTab,
    userProfile: state.registration.userProfile
}), dispatch => ({
    updateNewTab: () => dispatch(updateTab())
}))
export default class AllNewsScreen extends Component {

    constructor(props) {
        super(props);
        this.scene = SceneMap(_.reduce(this.state.tabDefault.concat(this.props.tab), function (obj, value) {
            obj[value.name] = () => value.name === 'all' ? <News newsParameters={value}/> : <NewsFlowCar newsParameters={value}/>;
            return obj;
        }, {}));
    }

    state = {
        index: 0,
        tabDefault :  [
            {
                key: 'all',
                title: 'すべて',
                type : 'all',
                name : 'all'
            }, {
                key: 'my',
                title: 'マイニュース',
                type : 'my',
                name : 'my',
                myProfile: this.props.userProfile.myProfile.id
            }
        ]
    };


    _handleIndexChange = index => this.setState({index});

    _renderTabBar = props => {
        return (
            <View style={{flexDirection: 'row', width: '100%', height: 40, backgroundColor: '#333333', borderTopWidth: 1, borderTopColor : '#000000'}}>
                <ScrollView horizontal={true}>
                    {props.navigationState.routes.map((route, i) => {
                        const color = this.state.index === i ? '#4B9FA5' : '#FFFFFF';
                        const borderColor = this.state.index === i ? '#4B9FA5' : '#333333';
                        const title = route.title === this.props.carInfo.car_name ? 'マイカー' : route.title;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    paddingHorizontal: 15,
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#333333',
                                    borderBottomWidth: 3.5,
                                    borderBottomColor: borderColor
                                }}
                                onPress={() => this.setState({index: i})}>
                                <Animated.Text style={{
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color
                                }}>{(title && title.length >= 8) ? title.substring(0, 8) + '...' : title}</Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity
                    onPress={()=> navigationService.navigate('NewsVehicleList')}
                    style={Styles.buttonPlus}
                >
                    <View>
                        <SvgImage source={SvgViews.PlaylistAdd}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderScene() {
        return this.scene;
    }


    componentWillReceiveProps(nextProps) {
        if(this.props.updateTab !== nextProps.updateTab) {
            this.scene = SceneMap(_.reduce(this.state.tabDefault.concat(nextProps.tab), function (obj, value) {
                obj[value.name] = () => value.name === 'all' ? <News newsParameters={value}/> : <NewsFlowCar newsParameters={value}/>;
                return obj;
            }, {}));
        }
        nextProps.route.index === 3 && nextProps.route.index !== this.props.route.index && viewPage('news_posts', 'ニュース投稿');
    }

    componentDidMount() {
        this.trace = firebase.perf().newTrace('news');
        this.trace.start().then(
            () => {console.log('trace start')}
        );
        this.props.updateNewTab();
    }

    componentWillUnmount() {
        this.trace.stop().then(() => {
            console.log('trace end');
        });
    }

    render() {
        return (
            <View style={Styles.body} renderToHardwareTextureAndroid={true}>
                <TabView
                    useNativeDriver
                    navigationState={{...this.state, routes : this.state.tabDefault.concat(this.props.tab)}}
                    renderScene={this._renderScene()}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    body: {
        backgroundColor: '#F8F8F8',
        flexDirection: 'column',
        alignContent: 'flex-start',
        height: '100%'
    },
    buttonPlus: {
        width: 50,
        height : '100%',
        alignContent : 'center',
        justifyContent : 'center',
        borderLeftColor : '#000000',
        borderLeftWidth: 1
    },
});

