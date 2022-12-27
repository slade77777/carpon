import React, {Component} from 'react';
import {screen} from "../../navigation";
import {Text, StyleSheet, View, Alert, Platform, InputAccessoryView, ScrollView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../components';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../layouts";
import {navigationService, commonService} from "../../carpon/services";
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {viewPage} from "../Tracker";

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@screen('Contact', {header: <HeaderOnPress title={'お問い合わせ'}/>})
@connect(
    state => ({
        userProfile: state.registration ? state.registration.userProfile.myProfile : {},
    }),
    () => ({})
)
export class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: (props.userProfile && Object.entries(props.userProfile).length > 0) ? props.userProfile.last_name + ' ' + props.userProfile.first_name : null,
            email: (props.userProfile && Object.entries(props.userProfile).length > 0) ? props.userProfile.email : null,
            content: null,
            loading: false,
            type: null
        };
    }

    componentDidMount() {
        viewPage('contact', 'お問い合わせ');
        let type = this.props.navigation.getParam('type');
        let move = this.props.navigation.getParam('move');
        this.setState({
            type: type,
            move: move
        })
    }

    handleUpdate() {
        this.setState({loading: true});
        const {name, email, content, type} = this.state;
        commonService.contactAdmin({
            name, email, content, type
        }).then(response => {
            Alert.alert(
                '送信完了',
                'お問い合わせ内容を送信しました。内容を確認後、担当者がご登録メールアドレスにご返信差し上げますので今しばらくお待ち下さい。',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.setState({loading: false});
                            !!this.state.move ? navigationService.clear('MainTab', {tabNumber: 3}) :
                                navigationService.goBack()
                        }
                    },
                ],
                {cancelable: false}
            );
        }).catch(error => {
                Alert.alert(
                    'APIエラー',
                    '',
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.setState({loading: false});
                            }
                        },
                    ],
                    {cancelable: false});
            }
        );
    }

    validateEmail() {
        return EMAIL_REGEXP.test(this.state.email);
    }

    handleFocus(val) {
        this.setState({content: val});
        if (Platform.OS === 'ios') {
            this.content.measure((fx, fy, width, height, px, py) => {
                this.myScroll.scrollTo({x: 0, y: Platform.OS === 'ios' ? fy : fy + 30, animated: true})
            })
        }
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryContactID';
        const isShow = !this.state.name || !this.validateEmail() || !this.state.content;
        return (
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{flex: 1, backgroundColor: 'white'}} ref={(ref) => this.myScroll = ref}>
                        <Spinner
                            visible={this.state.loading}
                            textContent={null}
                            textStyle={{color: 'white'}}
                        />
                        <View style={{paddingHorizontal: 15, marginBottom: 12, marginTop: 30}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='お名前'
                                value={this.state.name}
                                onChangeText={(val) => this.setState({name: val})}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginVertical: 12}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='メールアドレス'
                                autoCompleteType={'email'}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                value={this.state.email}
                                onChangeText={(val) => this.setState({email: val})}
                            />
                        </View>
                        <View style={{paddingHorizontal: 15, marginTop: 12}} ref={view => {
                            this.content = view;
                        }} renderToHardwareTextureAndroid={true} collapsable={false}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='お問い合わせ内容'
                                style={{textAlignVertical: 'top'}}
                                value={this.state.content}
                                multiline={true}
                                onChangeText={(val) => {
                                    this.handleFocus(val)
                                }}
                            />
                        </View>
                        <View style={{height: 10}}/>
                        <KeyboardSpacer/>
                    </ScrollView>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{
                                backgroundColor: isShow ? 'white' : 'rgba(112, 112, 112, 0.5)',
                                padding: isShow ? 0 : 10
                            }}>
                                <ButtonText disabled={isShow} title={'送信する'} onPress={() => this.handleUpdate()}/>
                            </View>
                        </InputAccessoryView>
                        : <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                            <ButtonText disabled={isShow} title={'送信する'} onPress={() => this.handleUpdate()}/>
                        </View>
                }
            />
        )
    }
}
