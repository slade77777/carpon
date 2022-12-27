import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {StyleSheet, SafeAreaView, Keyboard, View, Text, Platform, DeviceInfo, Alert} from 'react-native';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {SingleColumnLayout} from "../../layouts";
import Icon from 'react-native-vector-icons/Ionicons';
import UserAgent from 'react-native-user-agent';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../components/WebViewLoading";

@screen('CompanyView', {
    header: <HeaderOnPress title={'個別見積・お申し込み'}
               leftComponent={
                   <View>
                       <Icon name="md-close" size={30} color="#FFFFFF"/>
                   </View>
               }/>
})
export class CompanyView extends Component {

    state = {
        spaceBottom: 0
    };

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

    renderInfo(company) {
        return (
            <View style={{borderTopWidth: 2, borderColor: '#4B9FA5', backgroundColor: '#F8F8F8'}}>
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#4B9FA5'}}>以下情報を入力し、ログインしてください</Text>
                </View>
                <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                    <View style={{
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#E5E5E5'
                    }}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#F37B7D'}}>ID：{company.username}</Text>
                        <Text
                            style={{fontSize: 16, fontWeight: 'bold', color: '#F37B7D'}}>パスワード：{company.password}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const company = this.props.navigation.getParam('company');
        return (
            <SafeAreaView style={{backgroundColor: '#B7B7B7', flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{flex: 1}}>
                            <WebView
                                renderLoading={() => (<WebViewLoading/>)}
                                startInLoadingState={false}
                                source={{uri: company.url}} useWebKit={true}
                                showsVerticalScrollIndicator={false}
                                // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                            />
                        </View>
                    }
                    bottomContent={
                        Platform.OS === 'ios'
                            ?
                            <View style={{marginBottom: this.state.spaceBottom}}>
                                {this.renderInfo(company)}
                            </View>
                            : (
                                <View>
                                    {this.renderInfo(company)}
                                </View>
                            )

                    }
                />


            </SafeAreaView>
        )
    }
}
