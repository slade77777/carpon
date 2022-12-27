import React, {Component} from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native'
import {connect} from 'react-redux';
import HeaderCarpon from "./HeaderCarpon";
import {navigationService} from "../carpon/services/index";
import {SvgImage, SvgViews} from "./Common/SvgImage";
import UserRankLogo from "./Common/UserRankLogo";

@connect(state => ({
    sizeMenu: state.sizeMenu,
    userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
    unreadNotificationNumber: state.notification ? state.notification.unreadNumber : 0,
}), dispatch => ({
    toggleSizeMenu: () => {
        dispatch({
            type: 'TOGGLE_SIZE_MENU'
        })
    }
}))
class SideMenuControl extends Component {

    renderMenuIcon() {
        const count = this.props.unreadNotificationNumber;
        return (
            <View style={{width: 50, height: 50}}>
                <SvgImage source={() => SvgViews.MenuIcon()}/>
                {
                    !!count && <View style={{
                        paddingHorizontal: count > 9 ? 4 : 5,
                        backgroundColor: '#FF0000',
                        justifyContent: 'center',
                        position: 'absolute',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderRadius: 7.5,
                        height: 15,
                        width: count === 1 ? 15: 'auto',
                        right: 6,
                        top: 7
                    }}>
                        <Text
                            style={{color: '#FFF', textAlign: 'center', fontSize: 7, fontWeight: 'bold'}}>{count}
                        </Text>
                    </View>
                }
            </View>
        );
    }

    render() {
        const MenuIcon = this.renderMenuIcon();

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigationService.navigate('MyPageScreen', {profile: this.props.userProfile})}
                    style={{padding: 10}}>
                    <Image source={{uri: this.props.userProfile ? this.props.userProfile.avatar : ''}} style={{
                        height: 30, width: 30,
                        borderRadius: 16, borderColor: '#666666', borderWidth: 1
                    }}/>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={this.props.toggleSizeMenu.bind(this)}>
                    {MenuIcon}
                </TouchableOpacity>
            </View>

        )
    }
}

export default class HeaderHome extends Component {

    render() {

        return (
            <HeaderCarpon
                leftComponent={<UserRankLogo onPressLeft={() => this.props.onPressLeft()}/>}
                rightComponent={<SideMenuControl/>}
            />
        );
    }
}
