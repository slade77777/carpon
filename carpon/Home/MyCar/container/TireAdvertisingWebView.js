import React, {Component} from 'react';
import {View} from 'react-native';
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../../components/WebViewLoading";
import {viewPage} from "../../../Tracker";

@screen('TireAdvertisingWebView', {header: <HeaderOnPress/>})
export class TireAdvertisingWebView extends Component{

    componentDidMount() {
        viewPage('tire_affliate_detail', 'タイヤアフィリエイト_詳細');
    }
    handleTireRaw(tire) {
        let tireArray = tire.split('/');
        let tireURI = tire ? tireArray[0] + '%2F'+ tireArray[1]: 'tire';
        return `https://www.amazon.co.jp/s?k=${tireURI}&i=automotive&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&ref=nb_sb_noss_2`
    }
    render(){
        let tire = this.props.navigation.getParam('tire') ;
        let url = this.props.navigation.getParam('url') ;
        const link  = tire ? this.handleTireRaw(tire) : url;
        return(
            <View style={{flex: 1}}>
                <WebView
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    source={{uri: link}} useWebKit={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}
