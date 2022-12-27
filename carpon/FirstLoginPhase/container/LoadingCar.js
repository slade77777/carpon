import React, {Component} from 'react';
import color from "../../color";
import {screen} from "../../../navigation";
import {View, ActivityIndicator} from 'react-native'
import {navigationService} from "../../services/index";

@screen('LoadingCar', { header: null })
export class LoadingCar extends Component {

    componentDidMount() {
        setTimeout(() => {
            navigationService.navigate('ConfirmCarInfo')
        }, 1500)
    }

    render() {
        return (
            <View style={{backgroundColor: color.active, justifyContent: 'center',
                alignItems: 'center',height : '100%'}}>
                <ActivityIndicator
                    size="large" color="#fff"
                />
            </View>
        )
    }
}