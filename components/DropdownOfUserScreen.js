import {View, Platform} from "react-native";
import {Dropdown as BaseDropdown} from 'react-native-material-dropdown';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from "../carpon/color";

class DropdownAccessory extends Component {
    render() {
        return (
            <View style={{bottom: 27}}>
                {
                    this.props.validate && <Icon name='check-circle' color='#4B9FA5' size={16}/>
                }
            </View>
        )
    }
}

export class DropdownOfUserScreen extends Component {

    render() {
        return (
            <View>
                <BaseDropdown
                    selectedItemColor={'#666666'}
                    renderAccessory={() => <DropdownAccessory validate={this.props.validate}/>}
                    baseColor={this.props.value ? color.active : '#cccccc'}
                    labelFontSize={12}
                    labelTextStyle={{fontWeight: this.props.value ? 'bold' : 'normal', fontSize: 18}}
                    textColor={'#666666'}
                    {...this.props}
                    inputContainerStyle={{borderBottomWidth: this.props.value ? 0.7 : 1, borderBottomColor: this.props.value ? color.active : '#f37b7d'}}
                />
            </View>
        )
    }
}
