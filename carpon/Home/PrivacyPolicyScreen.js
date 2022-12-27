import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import {View, SafeAreaView, Platform} from 'react-native';
import UserAgent from 'react-native-user-agent';
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../components/WebViewLoading";
import {viewPage} from "../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('PrivacyPolicyScreen', {header: <HeaderOnPress title={'プライバシーポリシー'}/>})
export default class PrivacyPolicyScreen extends Component {

    componentDidMount() {
        viewPage('policy', 'プライバシーポリシー')
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <WebView
                    source={{uri: 'https://carpon.jp/app/privacypolicy.php'}}
                    useWebKit={true}
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                    showsVerticalScrollIndicator={false}
                    // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                />
            </View>
        );
    }
}
