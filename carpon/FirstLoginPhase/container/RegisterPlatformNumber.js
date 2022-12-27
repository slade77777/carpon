import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, Keyboard, View, SafeAreaView, Alert} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../components/index';
import {connect} from 'react-redux';
import {updatePlatform} from "../actions/registration";
import {SingleColumnLayout} from "../../layouts";
import _ from 'lodash';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import {navigationService} from "../../services/index";

@screen('RegisterPlatformNumber', {header: <HeaderOnPress/>})
@connect(
    state => ({
        profile: state.registration
    }),
    dispatch => ({
        updatePlatform: (data) => {
            dispatch(updatePlatform(data))
        }
    })
)
export class RegisterPlatformNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classicNumb: props.profile.carProfile ? props.profile.carProfile.platform_number : null,
            disabled: true,
            spaceBottom: 20,
            loading: false
        };
        this.handleNewClassic = _.debounce(this.handleNewClassic, 500, { leading: true, trailing: false });
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove()
    }

    keyboardWillShow(e) {
        this.setState({spaceBottom: e.endCoordinates.height - getBottomSpace()});
    }

    keyboardWillHide(e) {
        this.setState({spaceBottom: 20});

    }

    handleChangeText = (text) => {
        this.setState({
            classicNumb: text,
            disabled: text.length === 0
        });
    };

    handleNewClassic() {
        this.props.updatePlatform({
            id: this.props.profile.carProfile.id,
            platform_number: this.state.classicNumb
        });
        setTimeout(() => {
            navigationService.navigate('ConfirmCarQRInfo');
        }, 1000);

    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor : 'white', flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{height: '100%', backgroundColor: 'white'}}
                              onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                            <View style={{padding: 30}}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold'
                                }}>車検証の車台番号を入力する</Text>
                                <Text style={{
                                    fontSize: 14,
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>車検証に記載されている○桁の車台番号を入力してください</Text>
                            </View>
                            <View>
                                <View style={{padding: 30, paddingBottom: 40}}>
                                    <InputText
                                        title='車台番号'
                                        onChangeText={this.handleChangeText}
                                        value={this.state.classicNumb}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    bottomContent={
                        <View style={{paddingHorizontal: 20, marginBottom: this.state.spaceBottom}}>
                            <ButtonText disabled={this.state.disabled} title={'OK'}
                                        onPress={this.handleNewClassic.bind(this)}/>
                        </View>
                    }
                />
            </SafeAreaView>
        )
    }
}

