import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {navigationService} from "../../../services/index";
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {SvgViews, SvgImage} from "../../../../components/Common/SvgImage";

@screen('CertifiedMyCarInfo', {header: null})

export class CertifiedMyCarInfo extends Component {

    constructor() {
        super();
        this.springValue = new Animated.Value(0.3);
        this.spring();
        this.state = {disabled: true};
    }

    spring() {
        this.springValue.setValue(0.3);
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start(() => this.setState({disabled: false}));
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#4B9FA5', verticalAlign: 'flex-end'}}>
                <View style={{flex: 2}}>
                    <Animated.View style={{transform: [{scale: this.springValue}]}}>
                        <SvgImage source={SvgViews.CertifiedLogo} style={{width: '100%', height: '100%'}}/>
                    </Animated.View>
                </View>
                <View style={{flex: 1, marginHorizontal: 15}}>
                    <View>
                        <Text style={{
                            color: 'white',
                            borderColor: 'white',
                            borderWidth: 1.5,
                            textAlign: 'center',
                            fontSize: 15,
                            padding: 15
                        }}>トヨタ パッソ</Text>
                    </View>
                    <View>
                        <Text style={{
                            marginVertical: 15,
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 14
                        }}>マイカー認定しました</Text>
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {this.state.disabled ? null : <TouchableOpacity activeOpacity={1} style={{width: '100%',verticalAlign: 'flex-end',
                        }}>
                            <Text style={{
                                backgroundColor: 'white',
                                color: '#4B9FA5',
                                padding: 15,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>OK</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
        )
    }
}

