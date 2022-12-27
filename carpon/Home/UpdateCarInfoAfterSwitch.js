import React, {Component} from 'react';
import {screen} from "../../navigation";
import {navigationService} from "../services/index";
import HeaderOnPress from "../../components/HeaderOnPress";
import {UpdateCarInfoComponent} from "../FirstLoginPhase/components/UpdateCarInfoComponent";
import {viewPage} from "../Tracker";

@screen('UpdateCarInfoAfterSwitch', ({navigation}) => ({
    header: <HeaderOnPress onPress={() =>{
        let switchCar = navigation.getParam('switchCar');
        switchCar ? navigationService.pop(2) : navigationService.clear('CarType')
    }} title={'マイカーについて'}/>
}))

export class UpdateCarInfoAfterSwitch extends Component {

    componentDidMount() {
        viewPage('select_car_information_changing_car', '車両情報選択_車両変更')
    }

    render() {
        return (
            <UpdateCarInfoComponent navigation={this.props.navigation}/>
        )
    }
}
