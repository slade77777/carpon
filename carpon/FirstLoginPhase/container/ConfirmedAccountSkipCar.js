import React, {Component} from 'react';
import {View, Text, ImageBackground, Animated} from 'react-native';
import {screen} from "../../../navigation";
import {images} from "../../../assets";
import {navigationService} from "../../services";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {viewPage} from "../../Tracker";

@screen('ConfirmedAccountSkipCar', {header: null})


export class ConfirmedAccountSkipCar extends Component {

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(0.1);
        this.state = {
            showHumanIcon: false
        };
    }

    spring () {
        this.springValue.setValue(0.1);
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 5,
                tension: 300,
            }
        ).start(() => {
            setTimeout(() => navigationService.navigate('LoadingMetaData'), 500);
        });

    }

    componentDidMount() {
        viewPage('complete_user_registration', 'ユーザ登録完了');
        setTimeout(()=> {
            this.spring()
        }, 1000);

    }

    render() {
        return (
            <ImageBackground source={images.confirmedBackground} style={{width: '100%', height: '100%'}}>
                <View style={{position: 'absolute', bottom: '51%',  left: '50%'}}>
                    <View style={{alignItems: 'center', width: 100, marginLeft: -50}}>
                        <Animated.View
                            style={{ width: 54, height: 66, transform: [{scale: this.springValue}] }}>
                            <SvgImage source={SvgViews.HumanIcon}/>
                        </Animated.View>
                    </View>
                </View>
                <View style={{position: 'absolute', bottom: '25%', left: '50%'}}>
                    <View style={{alignItems: 'center', width: 500, marginLeft: -250}}>
                        <Text style={{fontSize: 30, color: 'white', letterSpacing: 5}}>REGISTRATION!</Text>
                        <Text style={{marginTop: 10, fontSize: 15, color: 'white'}}>ユーザー登録が完了しました</Text>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
