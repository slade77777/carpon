import React, {Component} from 'react';
import {navigationService, newsService} from "../carpon/services";
import {TouchableOpacity, Alert, View} from 'react-native'
import {SvgImage, SvgViews} from '../components/Common/SvgImage'
import HeaderCarpon from "./HeaderCarpon";

export default class HeaderNewsDetail extends Component {
    state = {
        visible: false
    };

    onPress() {
        if (this.props.screen) {
            navigationService.navigate(this.props.screen);
        } else {
            navigationService.goBack();
        }
    }

    render() {
        return (
            <HeaderCarpon
                leftComponent={<TouchableOpacity activeOpacity={1} onPress={this.onPress.bind(this)} style={{
                    alignItems: 'flex-start',
                    flex: 1,
                    justifyContent: 'center',
                    paddingLeft: 15
                }}>
                    <SvgImage source={SvgViews.ActionBarBack}/>
                </TouchableOpacity>}
                rightComponent={
                    <View style={{
                        flexDirection: 'row',
                        paddingRight: 15,
                        justifyContent: 'flex-end',
                        flex: 1,
                        alignItems: 'center'
                    }}>
                    </View>
                }
            />
        )
    }
}
