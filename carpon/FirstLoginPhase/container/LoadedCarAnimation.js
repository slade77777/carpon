import React, {Component} from 'react';
import {View, Text, Animated, Dimensions} from 'react-native';
import {screen} from "../../../navigation";
import {SvgViews, SvgImage} from "../../../components/Common/SvgImage";
import {navigationService} from "../../services";
import LottieView from 'lottie-react-native';
import color from "../../color";
import {connect} from 'react-redux'
import {outOfWorkingTime} from "../actions/registration";
import {viewPage} from "../../Tracker";

const {width, height} = Dimensions.get('window');
@screen('LoadedCarAnimation', {header: null})
@connect(() => ({}),
    dispatch => ({
        outOfWorkingTime: ()=> dispatch(outOfWorkingTime())
    })
)
export class LoadedCarAnimation extends Component {

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(0.6);
        this.state = {
            disabled: true,
            showSlogan: false
        }
    }

    spring() {
        this.springValue.setValue(0.6);
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start(() => this.setState({disabled: false}));
    }

    componentDidMount() {
        const outOfWorkingTime = this.props.navigation.getParam('outOfWorkingTime');
        this.spring();
        viewPage('complete_car_adding', '車両追加完了');
        setTimeout(() => {
            this.setState({showSlogan: true})
        }, 2000);
        setTimeout(() => {
            outOfWorkingTime ? this.props.outOfWorkingTime() : navigationService.navigate('ConfirmCarInfo');
        }, 3000)
    }

    render() {
        const ScreenSize ={
            width: width,
            height: height
        };
        return (
            <View style={{ backgroundColor: color.active, zIndex: 0, height, width}}>
                <LottieView
                    source={require('../../../assets/Small_Carpon_Regist_complete_Mycar.json')}
                    // style={{ width: 120, height: 50 }}
                    autoPlay
                    loop
                />
            </View>
        )
    }
}
