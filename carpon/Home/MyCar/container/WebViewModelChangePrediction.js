import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import UserAgent from 'react-native-user-agent';
import { WebView } from 'react-native-webview';
import { View , SafeAreaView, Platform } from 'react-native';
import WebViewLoading from "../../../../components/WebViewLoading";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('WebViewModelChangePrediction', {header: <HeaderOnPress title={'モデルチェンジ予測'}/>})
export default class WebViewModelChangePrediction extends Component {

    componentDidMount() {
        viewPage('model_change_prediction', 'モデルチェンジ予測');
    }

    render() {
        return (
            <View style={{ flex: 1}}>
                <WebView
                    renderLoading={() => (<WebViewLoading/>)}
                    startInLoadingState={false}
                    source={{uri: this.props.navigation.getParam('uri')}} useWebKit={true}
                    // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                    showsVerticalScrollIndicator={false}
                    contentInset={{bottom: isIphoneX() ? getBottomSpace() : 0}}
                />
            </View>
        );
    }
}
