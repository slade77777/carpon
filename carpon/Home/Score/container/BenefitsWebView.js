import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import WebView from "react-native-webview";
import WebViewLoading from "../../../../components/WebViewLoading";
import {connect} from "react-redux";
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import _ from 'lodash';
import {viewPage} from "../../../Tracker";
// import { KarteTrackerJsUtil } from 'react-native-karte-tracker'

@screen('BenefitsWebView',({navigation}) => {
    const {params = {}} = navigation.state;
    return {header: <HeaderOnPress title={params.title}/>}
})
@connect(
    state => ({
        reward: state.metadata.reward
    }),
    () => ({})
)

export default class BenefitsWebView extends Component {

    state = {
        authHeader: '',
        reward: {},
        entry: ''
    };

    componentDidMount() {
        const benefit_id = this.props.navigation.getParam('benefit_id');
        const rankName = this.props.navigation.getParam('rankName');
        const {reward} = this.props;
        let rankReward = _.find(reward[rankName], (condition) => {
            return condition.reward.benefit_id == benefit_id
        });
        if (rankReward && rankReward.reward) {
            this.props.navigation.setParams({
                title: rankReward.reward.title
            });
            viewPage('benefits_detail', `特典詳細 : (${rankReward.reward.title})`);
            let entry = rankReward.reward ? rankReward.reward.entry : null;
            this.setState({entry,...rankReward})
            // if (entry) {
            //     KarteTrackerJsUtil.appendUserSyncQueryParameter(entry).then(response => {
            //         this.setState({entry: response,...rankReward})
            //     })
            // }
        } else {
            this.setState({...rankReward})
        }
    }

    render() {
        const {authHeader, entry} = this.state;
        return (
            <View style={{flex: 1}}>
                {
                    entry ? <WebView
                        renderLoading={() => (<WebViewLoading/>)}
                        startInLoadingState={false}
                        source={{uri: entry, headers: {Authorization: 'Bearer ' + authHeader}}} useWebKit={true}
                        showsVerticalScrollIndicator={false}
                    /> : <View/>
                }
            </View>
        )
    }
}
