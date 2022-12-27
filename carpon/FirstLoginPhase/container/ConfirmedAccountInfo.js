import React, {Component} from 'react';
import {View, Text, Animated, Dimensions} from 'react-native';
import {screen} from "../../../navigation";
import {navigationService} from "../../services";
import LottieView from 'lottie-react-native';
import color from "../../color";
import {images} from "../../../assets";
import {Swinging, Falling, FlippingImage} from '../../../components';
import {connect} from 'react-redux';
import {viewPage} from "../../Tracker";
import {submitAppFlyer} from "../../../App";
const {width, height} = Dimensions.get('window');

const FIREWORK_DIMENSIONS = {width: 49, height: 26};
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 20;

@screen('ConfirmedAccountInfo', {header: null})
@connect(state => ({
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    })
)
export class ConfirmedAccountInfo extends Component {
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(0.1);
        this._opacityAnimationValue = new Animated.Value(0);
        this.moveAnimation = new Animated.ValueXY({ x: width / 2 - 33.5, y: height/2 - (0.0655 * height) - 23 });
        this.state = {
            isShow: false
        };
        this.fadeAnimated();
    }

    componentDidMount() {
        const user = this.props.userProfile;
        if (user && user.id) {
            const id = user.id;
            submitAppFlyer('WIZ_USERINFO_COMP',
                {
                    user_id: id,
                    email: user.email
                },
                id
            )
        }
        viewPage('congratulate_registration', '登録完了');
        setTimeout(()=> {
            this.spring();
            this.moveCar();
            this.setState({isShow: true});
        }, 3000);
    }


    fadeAnimated() {
        Animated.stagger(2000, [
            Animated.timing(this._opacityAnimationValue, {
                toValue: 1,
                duration: 2000
            })
        ]).start(() => this.setState({isShowed: false}))
    }

    spring () {
        this.springValue.setValue(0.1);
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 20,
                tension: 95,
            }
        ).start(() => {
            setTimeout(() => navigationService.navigate('SplashNotificationScreen'), 1000);
        });

    }

    moveCar() {
        Animated.spring(this.moveAnimation, {
            speed: 6,
            toValue: {x: width / 2 - 42, y: height/2 - (0.0655 * height) - 8},
        }).start()
    };

    randomize = max => Math.random() * max;

    range = count => {
        const array = [];
        for (let i = 0; i < count; i++) {
            array.push(i);
        }
        return array;
    };

    render() {
        const {count = 15, duration = 3000} = this.props;
        return (
            <View>
                <Animated.View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 50}}>
                    <View >
                        {this.range(count)
                            .map(i => this.randomize(1000))
                            .map((flipDelay, i) => (
                                <Falling
                                    key={i}
                                    duration={duration}
                                    delay={i * (duration / count)}
                                    style={{
                                        position: 'absolute',
                                        paddingHorizontal: WIGGLE_ROOM,
                                        left: this.randomize(SCREEN_DIMENSIONS.width - FIREWORK_DIMENSIONS.width) - WIGGLE_ROOM,
                                    }}
                                >
                                    <Swinging amplitude={FIREWORK_DIMENSIONS.width / 5}
                                              delay={this.randomize(duration)}>
                                        <FlippingImage source={images.fireworkFront} delay={flipDelay}/>
                                        <FlippingImage
                                            source={images.fireworkBack}
                                            delay={flipDelay}
                                            back
                                            style={{position: 'absolute'}}
                                        />
                                    </Swinging>
                                </Falling>
                            ))}
                    </View>
                </Animated.View>
                <View style={{ backgroundColor: color.active, zIndex: 0, height, width}}>
                    <LottieView
                        source={require('../../../assets/Carpon_Regist_complete_User.json')}
                        autoPlay
                    />
                </View>
                {
                    this.state.isShow && <View style={{width, height, position: 'absolute',
                        zIndex: 10, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', opacity: 0.8}}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white'}}>CONGRATULATIONs!</Text>
                        <Text style={{ fontSize: 12, color: 'white', marginTop: 10}}>おつかれさまでした！</Text>
                        <Text style={{ fontSize: 12, color: 'white', marginTop: 10}}>すべての登録が完了しました。</Text>
                    </View>
                }
            </View>
        )
    }
}
