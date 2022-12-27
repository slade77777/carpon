import React , {Component} from 'react';
import {View, Text} from 'react-native';
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import {screen} from "../../../navigation";
import {navigationService} from "../../services/index";

@screen('CarVerificationQRScreen', {header : null})
export default class CarVerificationQRScreen extends Component {

    componentDidMount() {
        setTimeout(() => {
            navigationService.clear('AuthenticationScreen')
        }, 2000)
    }
    render() {
        return (
            <View style={{justifyContent : 'center', height : '100%', backgroundColor : '#4B9FA5'}}>
                <SvgImage source={SvgViews.IconMMS}/>
                <Text style={{fontSize : 15, fontWeight: 'bold', color : 'white', textAlign : 'center', marginTop: 20}}>登録完了まで、あと少し!!</Text>
            </View>
        );
    }
}