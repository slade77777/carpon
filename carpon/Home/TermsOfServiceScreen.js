import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import UserAgent from 'react-native-user-agent';
import {WebView} from 'react-native-webview';
import {View, SafeAreaView, Platform} from 'react-native';
import WebViewLoading from "../../components/WebViewLoading";
import {viewPage} from "../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('TermsOfServiceScreen', {header: <HeaderOnPress title={'利用規約'}/>})
export default class TermsOfServiceScreen extends Component {

    componentDidMount() {
        viewPage('term', '利用規約');
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <WebView
                    source={{uri: 'https://carpon.jp/app/terms.php'}}
                    useWebKit={true}
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    showsVerticalScrollIndicator={false}
                    contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                    // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                />
            </View>
        );
    }
}
