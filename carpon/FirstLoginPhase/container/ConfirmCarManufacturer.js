import React, { Component } from 'react';
import { Text, View, Alert, BackHandler } from 'react-native';
import { screen } from '../../../navigation';
import {ManufacturerList} from "../../../components/ManufacturerList/index";
import {navigationService} from "../../services/index";
import HeaderOnPress from "../../../components/HeaderOnPress";

@screen('ConfirmCarManufacturer', { header: <HeaderOnPress title={'メーカー選択'}/> })
export class ConfirmCarManufacturer extends Component {

    onPressView(data) {
        return navigationService.navigate('ConfirmCarModel', { maker_code: data['maker_code'], maker_name: data['maker_name'] });
    }

    render() {
        return (
            <ManufacturerList onPress={this.onPressView.bind(this)}/>
        )
    }
}


