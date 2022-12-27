import { Dimensions, Image, Linking, TouchableOpacity, View } from "react-native";
import React, { useState }                                    from "react";
import { navigationService }                                  from "../../carpon/services";
import { connect }                                            from "react-redux";

const { width } = Dimensions.get('window');

function SingleBanner({ campaign }) {
    const [ ratio, setRatio ] = useState(0);

    Image.getSize(campaign?.banner, (width, height) => {
        setRatio(height / width)
    })

    const handleShowWeb = () => {
        if (campaign['in-app']) {
            navigationService.navigate('CampaignWebView', { campaignId: campaign['campaign-id'] })
        } else {
            Linking.canOpenURL(campaign.entry).then(supported => {
                if (supported) {
                    Linking.openURL(campaign.entry);
                } else {
                    console.log("Don't know how to open URI: " + campaign.entry);
                }
            });
        }
    }

    return (
        <View style={ {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            width: '100%'
        } }>
            {
                campaign && <TouchableOpacity style={{paddingVertical: 1, marginTop: 15
                }} activeOpacity={ 1 } onPress={ () => handleShowWeb(campaign) }>
                    <Image
                        source={ { uri: campaign?.banner } }
                        style={ {
                            width: width - 30,
                            height: (width - 30) * ratio,
                            reSizeMode: 'contain',
                        } }
                    />
                </TouchableOpacity>
            }
        </View>
    )
}

export default connect(
    (state) => {
        const activeCampaigns = state.getCar.campaign?.campaigns?.actives || [];
        const defaultCampaign = state.getCar.campaign?.default;
        return {
            campaign: activeCampaigns.length ? activeCampaigns[0].campaign : defaultCampaign?.campaign,
        }
    },
    () => ({})
)(SingleBanner)
