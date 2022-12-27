import React, {Component} from 'react';
import {Dimensions, View, Image, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {connect} from 'react-redux';
import {navigationService} from "../carpon/services/index";
import color from "../carpon/color";
import _ from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const {width, height} = Dimensions.get('window');
@connect(state => ({
    campaign: state.getCar ? state.getCar.campaign : null
}))
export default class Campaign extends Component {

    state = {
        campaigns: [],
        imageHeight: 0,
        images: [],
        activeSlide: 0
    };

    componentWillMount() {
        const allCampaigns = this.props.campaign;
        if (allCampaigns) {
            if (allCampaigns.campaigns && allCampaigns.campaigns.actives && allCampaigns.campaigns.actives.length > 0) {
                if (allCampaigns.campaigns.actives[0].campaign) {
                    Image.getSize(allCampaigns.campaigns.actives[0].campaign.banner, (actualWidth, actualHeight) => {
                        this.setState({imageHeight : (width - 72) * actualHeight/actualWidth, campaigns: allCampaigns.campaigns.actives})
                    });
                }
            } else {
                if (allCampaigns.default.campaign) {
                    Image.getSize(allCampaigns.default.campaign.banner, (actualWidth, actualHeight) => {
                        this.setState({imageHeight: (width - 72) * actualHeight/actualWidth, campaigns: [allCampaigns.default]})
                    });
                }
            }
        }
    }

    handleShowWeb(campaign) {
        if (campaign.campaign && campaign.campaign.entry) {
            if (campaign.campaign['in-app']) {
                navigationService.navigate('CampaignWebView', {campaignId: campaign.campaign['campaign-id']})
            } else {
                Linking.canOpenURL(campaign.campaign.entry).then(supported => {
                    if (supported) {
                        Linking.openURL(campaign.campaign.entry);
                    } else {
                        console.log("Don't know how to open URI: " + campaign.campaign.entry);
                    }
                });
            }
        }
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this.handleShowWeb(item)} key={index}>
                <Image source={{uri: item.campaign.banner}}
                   style={{
                       width: width - 72,
                       height: this.state.imageHeight,
                       marginTop: 15, marginBottom: 10
                   }}/>
            </TouchableOpacity>
        );
    };

    render() {
        const {campaigns, imageHeight, activeSlide} = this.state;
        if (this.props.isMyCar) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F8F8F8'}}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.campaigns}
                        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                        renderItem={this._renderItem}
                        sliderWidth={width}
                        loop={true}
                        itemWidth={width - 72}
                        itemHeight={imageHeight}
                        sliderHeight={imageHeight}
                    />
                    {
                        campaigns.length > 1 ?
                            <Pagination
                                dotsLength={campaigns.length}
                                activeDotIndex={activeSlide}
                                containerStyle={{ backgroundColor: '#F8F8F8', paddingTop: 0, paddingBottom: 15 }}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 0,
                                    backgroundColor: '#F37B7D'
                                }}
                                inactiveDotStyle={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor:'#CCCCCC'
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />
                            : <View style={{backgroundColor: '#F8F8F8', paddingTop: 0, paddingBottom: 15, height: 20, width, alignItems: 'center'}}>
                                <View style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 0,
                                    backgroundColor: '#F37B7D'
                                }}/>
                            </View>
                    }

                </View>
            )
        } else {
            const campaign = campaigns[0];
            return (
                <TouchableOpacity onPress={() => this.handleShowWeb(campaign)}
                                  style={{marginHorizontal: 35 , marginVertical: 15, borderWidth:1, borderColor: '#707070'}}>
                    {
                        campaign ?
                            <Image source={{uri: campaign.campaign ? campaign.campaign.banner : ''}} style={{width: width - 72, height: imageHeight}}/>
                            : <View/>
                    }
                </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
    },
    buttons: {
        height: 15,
        marginTop: -25,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        margin: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#CCCCCC',
        opacity: 0.9,
    },
    buttonSelected: {
        opacity: 1,
        backgroundColor: '#F37B7D',
    }
});
