import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions, TouchableWithoutFeedback} from 'react-native';
import {navigationService} from "../../../services";
import Rate, {AndroidMarket} from 'react-native-rate';
import Config from 'react-native-config';
import {connect} from "react-redux";

const {width, height} = Dimensions.get('window');

@connect(() => ({}),
    (dispatch) => ({
        reviewApp: () => dispatch({
            type: 'REVIEW_APP_STATUS',
            status: false
        }),
    })
)
export default class CarPonRate extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        turnOffAlert: false,
        AlertContent: {
            title: 'ご利用いただき、誠にありがとうございます。',
            message: 'Carponはお役に立っていますか？',
            buttons: [
                {
                    title: 'いいえ',
                    onPress: () => {
                        this.props.reviewApp();
                        this.handleTurnOffRateAlert();
                        navigationService.navigate('Contact', {type: 'Account', move: this.props.params ? this.props.params.move: false })
                    }
                },
                {
                    title: 'はい',
                    onPress: () => {
                        this.props.reviewApp();
                        this.handleRate()
                    }
                },

            ]
        },
    };

    handleTurnOffRateAlert() {
        this.props.handleTurnOffRateAlert()
    }

    handleRate() {
        const options = {
            AppleAppID: Config.Apple_App_ID,
            GooglePackageName: Config.Google_Package_Name,
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: true,
            inAppDelay: 5.0,
        };
        this.props.reviewApp();
        Rate.rate(options, success => {
            this.props.params && navigationService.clear('MainTab', {tabNumber: 3});
            return  this.handleTurnOffRateAlert();
        })
    }

    render() {
        const {AlertContent} = this.state;

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.reviewApp() }
                style={{ width: '100%', height: '100%', opacity: 0}}
            >
            <View
                style={{
                    width,
                    height: '100%',
                    zIndex: 10,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(4, 4, 15, 0.2)'
                }}
            >
                <View
                    style={{
                        width: 270,
                        height: 'auto',
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: '#E5E5E5',
                        backgroundColor: '#FFF',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text style={{
                        fontSize: 17,
                        color: '#000',
                        paddingTop: 15,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingHorizontal: 20
                    }}>
                        {AlertContent.title}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: '#000',
                            lineHeight: 15,
                            textAlign: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: AlertContent.message ? 10 : 0
                        }}
                    >
                        {AlertContent.message}
                    </Text>
                    <View
                        style={{
                            height: 44,
                            borderTopWidth: 0.5,
                            flexDirection: 'row',
                            borderColor: '#707070'
                        }}
                    >
                        {
                            AlertContent.buttons.map((button, index) => {
                                return <TouchableOpacity
                                    key={index}
                                    style={{
                                        width: AlertContent.buttons.length > 1 ? '50%' : '100%',
                                        borderRightColor: '#707070',
                                        borderRightWidth: (AlertContent.buttons.length > 1 && index === 0) ? 0.5 : 0,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        return button.onPress()
                                    }}
                                >
                                    <Text style={{color: '#007AFF', fontSize: 17}}>{button.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }
}
