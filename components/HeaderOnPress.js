import React, {Component} from 'react';
import {navigationService} from "../carpon/services";
import {TouchableOpacity, Text, Platform, Keyboard, View} from 'react-native'
import {SvgImage, SvgViews} from '../components/Common/SvgImage'
import HeaderCarpon from "./HeaderCarpon";

export default class HeaderOnPress extends Component {

    onPress() {
        if (this.props.navigation && this.props.navigation.getParam('pop')) {
            this.props.navigation.pop(this.props.navigation.getParam('pop'))
        }
        else {
            if(Platform.OS === 'ios') {
                Keyboard.dismiss();
                setTimeout(() => navigationService.goBack(null), 500);
            }
            else{
                navigationService.goBack(null);
            }
        }
    }

    render() {
        const rightContent = this.props.rightContent ? this.props.rightContent : false;
        const leftComponent = this.props.leftComponent ? this.props.leftComponent : false;
        const rightComponent = this.props.rightComponent ? this.props.rightComponent : false;
        return (
            <HeaderCarpon
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        this.props.onPress ? this.props.onPress() : this.onPress()
                    }} style={{
                        alignItems: 'flex-start',
                        flex: 1,
                        justifyContent: 'center',
                        width: 100,
                        height: 100
                    }}>
                        <View style={{paddingLeft: 15}} >
                        {
                            leftComponent ? leftComponent :
                                    <SvgImage source={SvgViews.ActionBarBack}/>
                        }
                        </View>
                    </TouchableOpacity>
                }
                centerComponent={
                    this.props.title ? <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: 15
                    }}>{this.props.title}</Text> : null
                }
                rightComponent={
                    rightComponent || (rightContent &&
                    <TouchableOpacity
                        style={{alignItems: 'flex-end', flex: 1, justifyContent: 'center', paddingRight: 15}}
                        onPress={() => navigationService.navigate(rightContent.nextScreen)}>
                        <SvgImage source={() => SvgViews[rightContent.icon]({fill: rightContent.color})}/>
                    </TouchableOpacity>)
                }
            />
        )
    }
}
