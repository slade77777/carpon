import {View, Platform} from "react-native";
import {Dropdown as BaseDropdown} from 'react-native-material-dropdown';
import {SvgImage, SvgViews} from "../../components/Common/SvgImage";
import React, {Component} from 'react';
import color from "../color";
import Icon from 'react-native-vector-icons/FontAwesome';

class DropdownAccessory extends Component {
    render() {
        return (
            <View>
                {
                    this.props.unSelected ?
                        <SvgImage style={{
                            paddingTop: 10,
                            paddingBottom: 8,
                            paddingLeft: 4,
                            paddingRight: 12
                        }}
                          source={SvgViews.IconArrowDownPink}/> :
                        <Icon
                            name="angle-down"
                            size={18}
                            color={'#CCCCCC'}
                            style={{
                                paddingTop: 2,
                                paddingBottom: 8,
                                paddingLeft: 4,
                                paddingRight: 12
                            }}
                        />
                }
            </View>
        )
    }
}

export default class Dropdown extends Component {

    render() {
        const unSelectedColor = !!this.props.unSelected;
        const unSelected = this.props.unSelected;
        const textColor = this.props.textColor || '#666666';
        return (
            <View>
                {
                    unSelected ?

                        <BaseDropdown
                            containerStyle={{
                                backgroundColor: 'rgba(243, 123, 125, 0.05)',
                                height: Platform.OS === 'ios' ? 50 : 46
                            }}
                            selectedItemColor={'#666666'}
                            dropdownOffset={{top: Platform.OS === 'ios' ? 20 : 16, left: 0}}
                            renderAccessory={() => <DropdownAccessory unSelected={unSelected}/>}
                            baseColor={unSelectedColor ? '#f37b7d' : '#4B9FA5'}
                            labelFontSize={12}
                            labelTextStyle={{fontWeight: 'bold'}}
                            textColor={unSelectedColor ? '#f37b7d' : '#666666'}
                            {...this.props}
                            inputContainerStyle={{borderBottomWidth: 0.5, borderBottomColor: '#CCC'}}
                        />
                        :
                        <BaseDropdown
                            selectedItemColor={'#666666'}
                            renderAccessory={() => <DropdownAccessory unSelected={unSelected}/>}
                            baseColor={this.props.value ? color.active : '#cccccc'}
                            labelFontSize={12}
                            labelTextStyle={{fontWeight: this.props.value ? 'bold' : 'normal', fontSize: 18}}
                            textColor={this.props.value ? textColor : '#666666'}
                            {...this.props}
                            inputContainerStyle={{borderBottomWidth: 0.5}}
                        />
                }
            </View>
        )
    }
}
