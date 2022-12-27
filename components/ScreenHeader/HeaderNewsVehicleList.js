import React, {Component} from 'react';
import {TouchableOpacity, View} from "react-native";
import {navigationService} from "../../carpon/services";
import HeaderCarpon from "../HeaderCarpon";
import Icon from 'react-native-vector-icons/Ionicons';

export default class HeaderNewsVehicleList extends Component {

    onPress() {
        navigationService.goBack();
    }

    handleAddVehicle() {
        navigationService.navigate('NewsAddModelManufacturerList');
    }

    render() {
        return (
            <HeaderCarpon
                leftComponent={
                    <TouchableOpacity activeOpacity={1} onPress={this.onPress.bind(this)} style={{
                        alignItems: 'flex-start',
                        flex: 1,
                        justifyContent: 'center',
                        paddingLeft: 15
                    }}>
                        <Icon name="md-close" size={30} color="#FFFFFF"/>
                    </TouchableOpacity>}
                rightComponent={
                    <TouchableOpacity activeOpacity={1} onPress={this.handleAddVehicle.bind(this)} style={{
                        alignItems: 'flex-end',
                        flex: 1,
                        justifyContent: 'center',
                        paddingRight: 15
                    }}>
                        <Icon name="md-add" size={30} color="#FFFFFF"/>
                    </TouchableOpacity>}
            />
        )
    }
}
