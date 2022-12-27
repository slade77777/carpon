import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, View, ScrollView, SafeAreaView, Dimensions, StyleSheet} from "react-native";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../components/WebViewLoading";
import color from "../../color";
import {navigationService} from "../../services/index";
import { isIphoneX  } from 'react-native-iphone-x-helper';
import {viewPage} from "../../Tracker";
import HeaderOnPress from "../../../components/HeaderOnPress";
import Icon from "react-native-vector-icons/Ionicons";

@screen('PrivacyPolicy', {header: <HeaderOnPress leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>} title='個人情報の取り扱い'/>})
export class PrivacyPolicy extends Component {

    componentDidMount() {
        viewPage('confirm_policy', 'プライバシーポリシーの確認');
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <WebView
                    renderLoading={() => (<WebViewLoading widthSpace={30} space={isIphoneX() ? 310 : 250}/>)}
                    startInLoadingState={true}
                    source={{uri: 'https://carpon.jp/app/privacypolicy2.php'}} useWebKit={true}
                    showsVerticalScrollIndicator={false}
                    // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                />
            </View>
        )
    }
}
