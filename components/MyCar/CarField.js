import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {SvgImage, SvgViews} from "../Common/SvgImage";
import {navigationService} from "../../carpon/services";
import color from "../../carpon/color";

const {width, height} = Dimensions.get('window');

export class CarField extends Component {

    renderCard() {
        const {fieldInfo} = this.props;
        return (
            <View style={{
                backgroundColor: '#FFFFFF',
                paddingVertical: 20,
                flexDirection: 'row',
                marginHorizontal: 15,
                width: width - 30
            }}>
                <View style={{width: width - 65}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{alignItems: 'center', flexDirection: 'row', ...fieldInfo.leftStyle}}>
                            <Text style={{fontSize: 16, color: fieldInfo.disabled ? '#CCCCCC' : 'black', fontWeight: 'bold'}}>
                                {fieldInfo.label}
                            </Text>
                            {
                                fieldInfo.warning && <View style={{paddingHorizontal: 5}}><SvgImage fill={color.active} source={SvgViews.Required}/></View>
                            }
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                            <View>
                                {fieldInfo.value}
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end'}}>{fieldInfo.bonusInformation}</View>
                </View>
                <View style={{ width: 35, alignItems: 'flex-end', justifyContent: 'center'}}>
                    {
                        fieldInfo.nextScreen ?
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <SvgImage source={SvgViews.ArrowCircle}/>
                            </View> : <View style={{width: 25}}/>
                    }
                </View>
            </View>
        )
    }

    render() {
        const {fieldInfo} = this.props;
        return (
            <View>
                {
                    (fieldInfo.nextScreen && fieldInfo.nextScreen.length > 0) ?
                        <TouchableOpacity activeOpacity={1}
                                          onPress={() => navigationService.navigate(fieldInfo.nextScreen, fieldInfo.params)}>
                            {this.renderCard()}
                        </TouchableOpacity>
                        :
                        <View>
                            {this.renderCard()}
                        </View>
                }
                <View style={{borderTopWidth: 1, borderColor: '#E5E5E5'}}/>
            </View>
        )

    }
}
