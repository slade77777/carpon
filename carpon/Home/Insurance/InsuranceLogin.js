import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {StyleSheet, SafeAreaView, Keyboard, View, Text, Platform, DeviceInfo, Alert,
    ActivityIndicator, Clipboard, TouchableOpacity, ToastAndroid, Dimensions} from 'react-native';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {SingleColumnLayout} from "../../layouts";
import {navigationService} from "../../services";
import Icon from 'react-native-vector-icons/Ionicons';
// import UserAgent from 'react-native-user-agent';
import {connect} from "react-redux";
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../components/WebViewLoading";
import {SvgImage} from "../../../components/Common/SvgImage";
import SvgViews from "../../../assets/svg/index";
import Toast, {DURATION} from 'react-native-easy-toast';
import {viewPage} from "../../Tracker";

const {width, height} = Dimensions.get('window');
@screen('InsuranceLogin', {header: <HeaderOnPress title={'個別見積・お申し込み'}
      leftComponent={
          <View>
              <Icon name="md-close" size={30} color="#FFFFFF"/>
          </View>
      }
      onPress={() => Alert.alert(
          'お申し込みをキャンセルします',
          'ここまでの登録内容は失われます。\n' +
          'キャンセルしてよろしいですか？',
          [
              {
                  text: 'はい',
                  onPress: () => {
                      navigationService.clear('InsuranceCompany');
                  },
              },
              {text: 'いいえ'},
          ],
          {cancelable: false}
      )}
    />
})
@connect(
    state => ({
        insuranceInfo: state.insurance.insuranceInfo,
    })
)
export class InsuranceLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spaceBottom: 0,
            isShowSuggest: !props.navigation.getParam('isAutoFill')
        };
    }

    componentWillMount() {
        const companyPast = this.props.navigation.getParam('company');
        const company = this.props.insuranceInfo.find((item) => item.response_data.id === companyPast.id);
        if (company.response_data.id === '23') this.setState({isShowSuggest: true});
        viewPage('individual_estimation_login_webview', '個別見積のログイン');
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow(e) {
        this.setState({spaceBottom: e.endCoordinates.height - getBottomSpace()});
    }

    keyboardWillHide(e) {
        this.setState({spaceBottom: 0});

    }

    _setContent(value) {
        Clipboard.setString(value);
        this.refs.toast.show('コピーしました', 3000);
    }

    renderInfo(company) {
        return (
            <View style={{ width }}>
                <TouchableOpacity onPress={() => this.setState({isShowSuggest: !this.state.isShowSuggest})} activeOpacity={1} style={{ alignItems: 'center'}}>
                    <SvgImage source={SvgViews.Collapse}/>
                </TouchableOpacity>
                {
                    this.state.isShowSuggest ? <View style={{borderTopWidth: 2, borderColor: '#4B9FA5', backgroundColor: '#F8F8F8'}}>
                        <View style={{margin: 15, marginBottom: 0}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#4B9FA5'}}>次の情報でログインできます</Text>
                        </View>
                        <View style={{ paddingHorizontal: 15, marginBottom: 15}}>
                            <TouchableOpacity style={Styles.titleBackGround} onPress={() => this._setContent(company.username)}>
                                <Text style={Styles.titleQuestion}>ID：{company.username}</Text>
                                <SvgImage source={SvgViews.CopyText}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={Styles.titleBackGround} onPress={() => this._setContent(company.password)}>
                                <Text style={Styles.titleQuestion}>パスワード：{company.password}</Text>
                                <SvgImage source={SvgViews.CopyText}/>
                            </TouchableOpacity>
                        </View>
                    </View> : <View/>
                }
            </View>
        )
    }

    render() {
        const companyPast = this.props.navigation.getParam('company');
        const company = this.props.insuranceInfo.find((item) => item.response_data.id === companyPast.id);
        // let userAgentValue = UserAgent.getUserAgent();
        // if (company && company.response_data && company && company.response_data.id === '28') {
        //     userAgentValue = 'Mozilla/5.0/' + userAgentValue;
        // }
        let injectJsContent = null;
        if (this.props.navigation.getParam('isAutoFill')) {
            console.log(company.response_data.id);
            if (company.response_data.id === '3G') injectJsContent = `document.getElementsByName("MYPAGE_ID")[0].defaultValue = "${company.response_data.username}";
                                                    document.getElementsByName("PWD")[0].defaultValue = "${company.response_data.password}"`;
            if (company.response_data.id === '23') injectJsContent = null;
            if (company.response_data.id === '28') injectJsContent = `document.getElementById("txtCustomNo").defaultValue = "${company.response_data.username}";
                                                    document.getElementById("pwdPassword").defaultValue = "${company.response_data.password}"`;

        }
        return (
            <View style={{ flex : 1}}>
                <View style={{flex: 1, paddingBottom: this.state.isShowSuggest ? 100 : 0}}>
                    <WebView
                        renderLoading={() => (<WebViewLoading/>)}
                        startInLoadingState={false}
                        source={{uri: (company && company.response_data) ? company.response_data.url : ''}}
                        // userAgent={userAgentValue}
                        useWebKit={true}
                        injectedJavaScript={injectJsContent}
                        showsVerticalScrollIndicator={false}
                    />
                    <Toast
                        ref="toast"
                        style={{backgroundColor:'#4B9FA5', width: 150, height: 50, justifyContent: 'center', alignItems: 'center'}}
                        position='top'
                        positionValue={height/3}
                        fadeInDuration={300}
                        fadeOutDuration={300}
                        opacity={1}
                        textStyle={{color:'white', fontSize: 16, fontWeight: 'bold'}}
                    />
                </View>
                <View style={{ position: 'absolute', bottom: isIphoneX() ? 25 : 0}}>
                    {company && this.renderInfo(company.response_data)}
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({

    titleBackGround: {height: 52,  borderWidth: 1, borderColor: '#E5E5E5',
        backgroundColor: 'white', justifyContent: 'space-between', marginTop: 10 ,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15
    },
    titleQuestion: {fontSize: 14, fontWeight: 'bold'},
});
