import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import UserAgent from 'react-native-user-agent';
import { WebView } from 'react-native-webview';
import {View, SafeAreaView, Platform} from 'react-native';
import WebViewLoading from "../../components/WebViewLoading";
import {viewPage} from "../Tracker";
import VersionNumber from 'react-native-version-number';
import {isIphoneX} from "react-native-iphone-x-helper";

function calculateAppVersion(appVersion) {
    return `${parseInt(appVersion.substring(0, appVersion.indexOf('.')) - 1)}.${appVersion.substring(appVersion.indexOf('.') + 1).replace('.', '')}`
}
@screen('AboutUsScreen', {header: <HeaderOnPress title={`このアプリについて (ver${calculateAppVersion(VersionNumber.appVersion)})`}/>})
export default class AboutUsScreen extends Component {

    componentWillMount() {
        viewPage('about', `このアプリについて (ver${calculateAppVersion(VersionNumber.appVersion)})`);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <WebView
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    source={{uri: 'https://carpon.jp/app/about.php'}}
                    useWebKit={true}
                    contentInset={{bottom: isIphoneX() ? 35 : 0}}
                    showsVerticalScrollIndicator={false}
                    // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                />
            </View>
        );
    }
}
