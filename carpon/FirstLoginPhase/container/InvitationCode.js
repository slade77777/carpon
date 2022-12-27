import React, {Component} from 'react';
import {screen} from "../../../navigation";
import stylesGeneral from '../../../style';
import {InputText, ButtonText, HeaderOnPress} from '../../../components/index';
import {Text, Keyboard, View} from 'react-native';
import {navigationService, userProfileService} from "../../services/index";

@screen('InvitationCode', {header: <HeaderOnPress/>})
export class InvitationCode extends Component {
    state = {
        code: '',
    };

    handleChangeText = (code) => {
        this.setState({
            code: code
        });
    };

    handleOnPress = () => {
        const data = {
            invited_code: this.state.code
        };
        userProfileService.postUserProfile(data);
        navigationService.navigate('CarType');
    };

    render() {
        return (
            <View style={stylesGeneral.bodyScreen} onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                <Text style={{marginTop: 60, color: 'black', fontSize: 16}}>
                    招待コードがある場合は入力してください。
                    無い方はそのまま次へお進みください。</Text>
                <View
                    style={{marginBottom: 140}}
                >
                    <InputText
                        placeholder={'1234'}
                        keyboardType={'numeric'}
                        onChangeText={this.handleChangeText}
                    />
                </View>
                <ButtonText disabled={this.state.disabled} title={'次へ'} onPress={() => this.handleOnPress()}/>
            </View>
        )
    }
}
