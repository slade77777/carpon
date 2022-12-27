import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {
    StyleSheet, SafeAreaView, Keyboard, View, Text, Platform, DeviceInfo, Alert,
    ActivityIndicator, Clipboard, TouchableOpacity, ToastAndroid, Dimensions, ScrollView, Image
} from 'react-native';
import {SingleColumnLayout} from "../../layouts";
import {navigationService} from "../../services";
import HeaderOnPress from "../../../components/HeaderOnPress";
import Icon from "react-native-vector-icons/FontAwesome";
import Dropdown from "../../common/Dropdown";
import color from "../../color";
import {InputText} from "../../../components";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";

const {width, height} = Dimensions.get('window');
@screen('CompanySetting', {header: null})
export class CompanySetting extends Component {

    state = {
        isChecked: true
    };

    render() {
        const companyImage = this.props.navigation.getParam('companyImage');
        const company = this.props.navigation.getParam('company');
        let title = null;
        let content = <View/>;
        if (company.id === '3G') {
            title = 'ここから先のページは個人総合自動車保険のお手続きとなります';
            content = <Text style={Styles.content}>
                SBI損保からお預かりしたお客様の仮ID＆パスワードを使ってCarponが自動ログインします。
                <Text style={{ fontWeight: 'bold'}}>自動ログイン後の画面でお客様独自のID/パスワードをご登録ください。</Text>
                自動ログインが不要の場合は「自動ログインを行う」のチェックを外して進み、下部のタブより認証情報を確認し、お客様ご自身でログインしてください。
            </Text>
        }
        if (company.id === '28') {
            title = 'ここから先のページは、三井ダイレクト損保Webサイトでのお手続きとなります。';
            content = <Text style={Styles.content}>
                三井ダイレクト損保からお預かりしたお客様のID＆パスワードを使ってCarponが自動ログインします。自動ログインが不要の場合は「自動ログインを行う」のチェックを外してログインページに進み、ブラウザ下部のタブより認証情報を確認し、お客様ご自身でログインしてください。
            </Text>
        }
        return (
            <SafeAreaView style={{backgroundColor : '#212121', flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{height: height - 120, backgroundColor: 'white'}}>
                            <ScrollView scrollIndicatorInsets={{right: 1}}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width, backgroundColor: color.active}}>
                                    <View style={{backgroundColor: 'white', width: 240, height: 90, justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                                        <Image source={companyImage} style={{ width: 150, height: 65}}/>
                                    </View>
                                    <Text style={{color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 10}}>個別見積・お申し込み</Text>
                                    {title && <Text style={{color: 'white', fontSize: 14, lineHeight: 21, marginTop: 5, paddingBottom: 20, textAlign: 'center', width: width - 40}}>{title}</Text>}
                                </View>
                                <View style={{ backgroundColor: 'white', alignItems: 'center'}}>
                                    <Text style={{ color: '#333333', fontSize: 16, fontWeight: 'bold', marginVertical: 15, textAlign: 'center'}}>＜Carpon自動ログイン＞</Text>
                                    {content}
                                    <SvgImage source={SvgViews.Instruction}/>
                                </View>
                                <View style={{ backgroundColor: 'white', height: 100}}/>
                            </ScrollView>
                        </View>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: color.active, position: 'absolute', bottom: 0, width: '100%', height: 120
                        }}>
                            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginTop: 20}}>
                                <TouchableOpacity activeOpacity={1}
                                                  onPress={() => {
                                                      this.setState({isChecked: !this.state.isChecked})
                                                  }}
                                                  style={{
                                                      width: 18,
                                                      height: 18,
                                                      backgroundColor: 'white',
                                                      justifyContent: 'center',
                                                      alignItems: 'center',
                                                      borderRadius: 2
                                                  }}>
                                    {
                                        this.state.isChecked && <Icon name={'check'} size={18} color={color.active}/>
                                    }
                                </TouchableOpacity>
                                <Text style={{ fontSize: 14, color: '#FFFFFF'}}>自動ログインを行う</Text>
                            </View>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#FFFFFF', height: 40, margin: 15, width: width - 30}}
                                          onPress={() => {
                                              navigationService.clear('InsuranceLogin', {...this.props.navigation.state.params, isAutoFill: this.state.isChecked});
                                          }}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: color.active
                                }}>ログインページに進む</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </SafeAreaView>
        )
    }
}

const Styles = StyleSheet.create({
    content: { color: '#333333', fontSize: 13, textAlign: 'center', width: width - 40, lineHeight: 19, marginBottom:20}
});
