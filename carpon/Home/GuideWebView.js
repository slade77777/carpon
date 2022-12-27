import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import {View, SafeAreaView, Platform} from 'react-native';
import UserAgent from 'react-native-user-agent';
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../components/WebViewLoading";
import {viewPage} from "../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";
// import { KarteTrackerJsUtil } from 'react-native-karte-tracker'

@screen('GuideWebView', {header: <HeaderOnPress title={'ご利用ガイド'}/>})
export default class GuideWebView extends Component {

    state = {
        entry: 'https://guide.carpon.jp',
    };

    componentDidMount() {
        viewPage('guide', 'ご利用ガイド');
        let entry = this.state.entry;
        // if (entry) {
        //     KarteTrackerJsUtil.appendUserSyncQueryParameter(entry).then(response => {
        //         this.setState({entry: response})
        //     })
        // }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <WebView
                    source={{uri: this.state.entry}}
                    useWebKit={true}
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    showsVerticalScrollIndicator={false}
                    contentInset={{bottom: isIphoneX() ? 25 : 0}}
                />
            </View>
        );
    }
}
