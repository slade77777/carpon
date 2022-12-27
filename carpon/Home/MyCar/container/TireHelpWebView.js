import React, {Component} from 'react';
import {View} from 'react-native';
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../../components/WebViewLoading";

@screen('TireHelpWebView', {header: <HeaderOnPress/>})
export class TireHelpWebView extends Component{
    render(){

        return(
            <View style={{flex: 1}}>
                <WebView
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    source={{uri: 'https://carpon.jp/app/tire-sizecheck.php'}} useWebKit={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}
