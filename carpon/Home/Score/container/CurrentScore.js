import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from "react-redux";
import {navigationService} from "../../../services";
import LottieView from 'lottie-react-native';
import {changeTab} from "../../../common/actions/metadata";

@connect(state => ({
    userProfile: state.registration.userProfile,
    dataSurvey: state.answerSurvey.dataSurvey
}),
    dispatch => ({
        changeTab: (tab) => dispatch(changeTab(tab)),
    })
)
export default class CurrentScore extends Component {

    ShowRankUser() {
        const profile = this.props.userProfile.myProfile ? this.props.userProfile.myProfile : {};
        switch (profile.rank) {
            case 1:
                return SvgViews.IconRankRegular;
            case 2:
                return SvgViews.IconRankGold;
            case 3:
                return SvgViews.IconRankPlatinum;
            default :
                return SvgViews.IconRankRegular;
        }
    }

    render() {
        const {width} = Dimensions.get('window');
        const {groups_answer, groups_question} = this.props.dataSurvey;
        const percent_survey_answer = Math.round((groups_answer / groups_question) * 100);
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: 'white', height: '100%'}}>
                <View style={{backgroundColor: '#FFFFFF', paddingBottom: 100}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', zIndex: 20}}>
                        <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('ScoreRank')} style={{
                            paddingTop: 30,
                            paddingHorizontal: 15,
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <SvgImage fill={'#999999'} source={SvgViews.HelpIcon}/>
                            <Text style={{color: '#999999', fontSize: 12}}> ランクについて</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{position: 'absolute', width: width, height: (width)}}>
                        <LottieView
                            source={require('../../../../assets/Score-up_Ring.json')}
                            style={{width: width, height: (width)}}
                            autoPlay
                            loop
                        />
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: width,
                        height: (width),
                        position: 'absolute',
                    }}>
                        <View style={{height: '43%', justifyContent: 'center'}}>
                            <Text style={{fontSize: 12, color: '#CCCCCC', marginTop: (width / 3.5)}}>CAR LIFE
                                SCORE</Text>
                        </View>
                        <View style={{height: '57%', flexDirection: 'row'}}>
                            <Text style={{
                                fontSize: 50,
                                color: '#333333',
                                marginLeft: 15
                            }}>{this.props.userProfile.myProfile.total_score || 0}</Text>
                            <View style={{top: 50, marginLeft: -10}}>
                                <Text style={{fontSize: 16, color: '#333333'}}>pts</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{height: (width - width / 4.8)}}/>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => navigationService.navigate('ScoreRank')}
                        style={{
                            flexDirection: 'row',
                            borderTopColor: '#E5E5E5',
                            borderTopWidth: 1,
                            alignItems: 'center',
                            height: 75,
                            justifyContent: 'space-between',
                        }}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 15}}>
                            <SvgImage source={SvgViews.IconRank}/>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flex: 1,
                                alignItems: 'center'
                            }}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333333'}}>現在のランク</Text>
                            <View>
                                <SvgImage source={this.ShowRankUser()}/>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: 15, width: 45}}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                        onPress={() => this.props.changeTab(1)}
                        style={{
                            flexDirection: 'row',
                            borderTopColor: '#E5E5E5',
                            borderTopWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 75
                        }}>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 15}}>
                            <SvgImage source={SvgViews.IconAssessment}/>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flex: 1,
                                alignItems: 'center'
                            }}>
                            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333333'}}>スコアアップステータス</Text>
                            <View style={{alignItems: 'flex-end', flexDirection: 'row', height: 32}}>
                                <Text style={{fontSize: 30, color: '#666666'}}>{percent_survey_answer || 0}</Text>
                                <Text style={{lineHeight: 25, fontSize: 12, color: '#666666'}}>%</Text>
                            </View>
                        </View>
                        <View style={{paddingHorizontal: 15, width: 45}}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('ScoreHistory')}>
                        <View style={{
                            flexDirection: 'row',
                            borderTopColor: '#E5E5E5',
                            borderTopWidth: 1,
                            borderBottomColor: '#E5E5E5',
                            borderBottomWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 75
                        }}>
                            <View style={{alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 15}}>
                                <SvgImage source={SvgViews.ClockIcon}/>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                flex: 1,
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    color: '#333333',
                                    marginRight: 4
                                }}>スコアアップヒストリー</Text>
                            </View>
                            <View style={{paddingHorizontal: 15, width: 45}}>
                                <SvgImage source={SvgViews.ArrowLeft}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
