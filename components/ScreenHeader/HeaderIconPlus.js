import React, {Component} from 'react';
import {navigationService} from "../../carpon/services";
import HeaderCarpon from "../HeaderCarpon";
import {TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class HeaderIconPlus extends Component {

    onPress() {
        navigationService.goBack();
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
                    </TouchableOpacity>
                }
                centerComponent={
                    this.props.title ? <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: 16
                    }}>{this.props.title}</Text> : null
                }
            />
        )
    }
}
