import React, {Component} from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import color from "../../carpon/color";
import {connect} from "react-redux";
import {navigationService} from "../../carpon/services";


@connect(state => ({
    isScanByQr: state.registration.isScanByQr
}))
export default class RegistrationCompleted extends Component {

    state = {
        opacity: 0,
    };

    componentDidMount() {
        // : 'PlatformNumberMethod'
        this.changeOpacity()
    }

    changeOpacity() {
        let time = 1;
        setInterval(() => {
            this.state.opacity < 300 && this.setState({
                opacity: time++
            })
        }, 5);

    }

    // PrepareCarVerificationQR
    handleNavigate() {
        navigationService.clear('AuthenticationScreen');
    }

    render() {
        const {opacity} = this.state;
        return (
            <View style={{
                zIndex: 50,
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: `rgba(75,159,165,0.8)`,
                justifyContent: 'center'
            }}>
                {!(opacity === 300) &&
                <View style={{justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={'large'}
                                                                                                  color={color.loadingColor}/></View>}
                {
                    (opacity === 300) &&
                    <View style={{
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'space-between',
                        marginRight: 15,
                        marginLeft: 15
                    }}>
                        <View></View>
                        <View>
                            <Text style={{fontSize: 23, fontWeight: 'bold', color: '#fff', textAlign: 'center'}}>Completion
                                of car registration</Text>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                                marginTop: 5
                            }}>マイカー情報を登録しました</Text>
                        </View>
                        <View>
                            <TouchableOpacity activeOpacity={1}
                                onPress={() => this.handleNavigate()}
                                style={{
                                    backgroundColor: '#FFF',
                                    borderRadius: 25,
                                    height: 50,
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 15
                                }}>
                                <Text style={{fontSize: 20, color: '#4b9fa5', fontWeight: 'bold'}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

            </View>
        )
    }
}
