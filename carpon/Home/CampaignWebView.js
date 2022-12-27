import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import UserAgent from 'react-native-user-agent';
import { WebView } from 'react-native-webview';
import {View, SafeAreaView, Platform} from 'react-native';
import WebViewLoading from "../../components/WebViewLoading";
import {viewPage} from "../Tracker";
// import { KarteTrackerJsUtil } from 'react-native-karte-tracker'
import {connect} from 'react-redux';
import _ from 'lodash';

@screen('CampaignWebView', {header: <HeaderOnPress title={''}/>})
@connect(state => ({
    campaign: state.getCar ? state.getCar.campaign : null
}))
export default class CampaignWebView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campaign: {},
            entry: ''
        }
    }

    componentWillMount() {
        const allCampaigns = this.props.campaign;
        let campaign = {};
        const campaignId = this.props.navigation.getParam('campaignId');
        if (campaignId === 'campaign-default') {
            campaign = allCampaigns.default;
        } else {
            campaign = allCampaigns ? _.find(allCampaigns.campaigns.actives, (condition) => {
                return condition.campaign['campaign-id'] === campaignId
            }) : null;
        }
        if (campaign) {
            let entry = campaign.campaign ? campaign.campaign.entry : null;
            // if (entry) {
            //     KarteTrackerJsUtil.appendUserSyncQueryParameter(entry).then(response => {
            //         this.setState({entry: response, campaign})
            //     })
            // }
            viewPage('campaign_webview', `キャンペーン_WebView: ${campaign.campaign['campaign-id']}`);
        }
    }

    render() {
        const campaign = this.state.campaign;
        return (
            <View style={{flex: 1}}>
                {
                    this.state.entry ? <WebView
                        renderLoading={() => (<WebViewLoading/>)}
                        startInLoadingState={false}
                        showsVerticalScrollIndicator={false}
                        source={{uri: this.state.entry, headers: {Authorization: 'Bearer ' + campaign.authHeader}}} useWebKit={true}
                        // userAgent={UserAgent.getUserAgent() + " - Carpon - " + Platform.OS + " "}
                    /> : <View/>
                }
            </View>
        );
    }
}
