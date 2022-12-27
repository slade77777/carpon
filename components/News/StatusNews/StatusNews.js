import React, {Component} from 'react';
import {Text, TouchableOpacity, View, ScrollView, StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import {updateTab} from "../../../carpon/Home/News/action/newsAction";

const statusDefault = [
    {
        type: 'all',
        text: 'すべて'
    }, {
        type: 'my',
        text: 'マイニュース'
    }
];

@connect((state) => ({
        tab: state.news.tab
    }),
    dispatch => ({
        updateTab: () => dispatch(updateTab())
    })
)
export default class StatusNews extends Component {
    state = {
        status: [],
        type: 'all'
    };

    onChangeScreenDefault(keyIndex) {
        let type = statusDefault[keyIndex].type;
        this.setState({type});
        this.props.onChangeType({type});
    }

    onChangeScreen(status) {
        this.setState({type: status['car_name']});
        this.props.onChangeType({
            type : 'car',
            maker_code: status['maker_code'],
            car_name_code : status['name_code']
        });
    }

    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.newsType) {
            const type = this.props.navigation.state.params.newsType;
            this.setState({type});
            this.props.onChangeType({type});
        }
        this.props.updateTab()
    }

    nextNavigate() {
        this.props.navigation.navigate('NewsVehicleList');
    }

    render() {
        const tab = this.props.tab;
        return (
            <View style={Styles.header}>
                <ScrollView horizontal={true}>
                    {
                        statusDefault.map((screen, index) =>
                            <TouchableOpacity activeOpacity={1} key={index} onPress={this.onChangeScreenDefault.bind(this, index)}>
                                <View style={this.state.type === screen.type ? Styles.buttonOnPress : Styles.buttonOffPress}>
                                    <Text style={this.state.type === screen.type ? Styles.textOnPress : Styles.textOffPress}>{screen.text}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    {
                        tab && tab.map((status, index) =>
                            <TouchableOpacity activeOpacity={1} key={index} onPress={this.onChangeScreen.bind(this, status)}>
                                <View style={status['car_name'] === this.state.type ? Styles.buttonOnPress : Styles.buttonOffPress}>
                                    <Text style={status['car_name'] === this.state.type ? Styles.textOnPress : Styles.textOffPress}>{status['car_name']}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity activeOpacity={1}
                        onPress={this.nextNavigate.bind(this)}>
                        <View style={Styles.buttonPlus}>
                            <Text style={Styles.textPlus}>+</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    header: {
        fontSize: 14,
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 60 : 0,
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8ec'
    },
    buttonPlus: {
        height: 40,
        alignContent : 'center',
        // backgroundColor : 'white',
        margin : 5,
        // borderRadius : 3,
        // borderWidth : 1,
        // borderColor : '#e8e8ec'
    },
    textPlus: {
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 30,
    },

    textOnPress: {
        textAlign: 'center', marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        color: 'white',
    },
    textOffPress: {
        textAlign: 'center', marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        color : 'black'
    },

    buttonOnPress: {
        height: 40,
        backgroundColor: '#83C0C5',
        margin : 5,
        borderRadius : 3,
        borderWidth : 1,
        borderColor : '#e8e8ec'
    },
    buttonOffPress: {
        borderRadius : 3,
        backgroundColor: 'white',
        height: 40,
        margin : 5,
        borderWidth : 1,
        borderColor : '#e8e8ec'
    }
});
