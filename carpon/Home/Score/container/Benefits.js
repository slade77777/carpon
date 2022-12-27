import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image, Dimensions, Platform} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from "react-redux";
import {ScrollView} from "react-native-gesture-handler";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {navigationService} from "../../../services";
import {loadReward} from "../../../common/actions/metadata";

const {width} = Dimensions.get('window');

@connect(
    state => ({
        reward: state.metadata.reward,
        rank: state.metadata.rank,
        screenNumber: state.metadata.screenNumber,
        userRank: state.registration.userProfile.myProfile.rank
    }),
    dispatch => ({
        loadReward: () => dispatch(loadReward()),
    })
)

export default class Benefits extends Component {

    componentWillReceiveProps(nextProps, pevProps) {
        const configRank = {0: 'regular', 1: 'gold', 2: 'platinum'};
        const rankName = configRank[nextProps.rank];
        nextProps.screenNumber === 1 && this.handleScroll(rankName);
        if (nextProps.userRank !== this.props.userRank) {
            nextProps.userRank && this.props.loadReward();
        }

    }

    handleScroll(rank) {
        setTimeout(() => {
            if (this[rank]) {
                this[rank].measure((fx, fy, width, height, px, py) => {
                    this.myScroll.scrollTo({x: 0, y: Platform.OS === 'ios' ? fy : py - 50, animated: true})
                })
            }
        }, 500)
    }

    renderElementOfRank(element, rankName, index) {
        return (
            <TouchableOpacity
                key={index}
                style={{
                    justifyContent: 'space-between',
                    borderColor: '#e5e5e5',
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    width: '100%',
                    height: 104
                }}
                onPress={() => this.handleNavigate(element.reward.benefit_id, rankName)}
            >
                <View style={{width: width - 144, paddingTop: 15}}>
                    <Text style={{color: '#333', fontSize: 15, fontWeight: 'bold'}}>{element.reward.title}</Text>
                    <Text style={{color: '#333', fontSize: 13, lineHeight: 20}}>{element.reward.tagline}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 74, height: 74, marginHorizontal: 15}}
                           source={{uri: element.reward.icon}}/>
                    <SvgImage source={() => SvgViews.ArrowLeft({fill: '#4B9FA5'})}/>
                </View>
            </TouchableOpacity>
        )
    }

    renderRank(icon, size, rank, index) {
        const configRank = {0: 'regular', 1: 'gold', 2: 'platinum'};
        const rankName = configRank[index];

        return (
            <View key={index} ref={view => {
                this[rankName] = view;
            }}>
                <View style={{
                    borderBottomColor: '#4B9FA5',
                    backgroundColor: '#F8F8F8',
                    borderTopColor: '#E5E5E5',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    borderBottomWidth: 2,
                    borderTopWidth: 1,
                    width: '100%',
                    height: 45
                }}>
                    <SvgImage source={() => SvgViews[icon](size)}/>
                    <View style={{justifyContent: 'center', paddingLeft: 3}}>
                        <Text style={{
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: 17
                        }}>特典</Text>
                    </View>
                </View>
                {rank.map((element, index) => {
                    return this.renderElementOfRank(element, rankName, index)
                })}
                <View style={{height: 25}}/>
            </View>

        )
    }

    handleNavigate(benefit_id, rankName) {
        navigationService.navigate('BenefitsWebView', {benefit_id, rankName})
    }

    render() {
        const {reward} = this.props;
        const rewardList = [
            {
                icon: 'RegularIcon',
                iconSize: {h: 20, w: 106},
                rankContent: reward ? reward.regular : []
            },
            {
                icon: 'GoldIcon',
                iconSize: {h: 20, w: 70},
                rankContent: reward ? reward.gold : []
            },
            {
                icon: 'PlatinumIcon',
                iconSize: {h: 20, w: 118.5},
                rankContent: reward ? reward.platinum : []
            }
        ];

        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{height: '100%', backgroundColor: '#FFF'}} ref={(ref) => this.myScroll = ref}>
                {
                    rewardList.map((reward, index) => {
                        return this.renderRank(reward.icon, reward.iconSize, reward.rankContent, index);
                    })
                }
                <View style={{paddingHorizontal: 15, margin: 15, borderWidth: 1, borderColor: '#4B9FA5', marginTop: 5}}>

                    <Text style={{
                        color: '#4B9FA5',
                        textAlign: 'center',
                        fontSize: 17,
                        fontWeight: 'bold',
                        paddingVertical: 15
                    }}>特典パートナー募集</Text>
                    <Text style={{color: '#333', fontSize: 17, lineHeight: 20}}>Carponは特典に協賛いただけスポンサー様を募集しています。</Text>
                    <Text style={{color: '#333', fontSize: 17, lineHeight: 20}}>ご協賛いただくメリットの一例は以下の通りです。</Text>
                    <Text style={{color: '#333', fontSize: 17, lineHeight: 20}}>・Carponユーザーへの情報発信</Text>
                    <Text style={{color: '#333', fontSize: 17, lineHeight: 20}}>・協賛スポンサー様のサービスへの送客</Text>
                    <Text style={{
                        color: '#333',
                        fontSize: 17,
                        lineHeight: 20
                    }}>パートナー/協賛企業様毎に、特典内容についてはご相談させていただきます。 </Text>
                    <Text style={{color: '#333', fontSize: 17, lineHeight: 20}}>お気軽にお問い合わせください。</Text>
                    <ButtonCarpon
                        onPress={() => navigationService.navigate('Contact', {type: 'Account'})}
                        style={{borderRadius: 3, backgroundColor: '#F06A6D', height: 50, marginVertical: 20}}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>お問い合わせフォーム</Text>
                    </ButtonCarpon>

                </View>
            </ScrollView>
        )
    }
}
