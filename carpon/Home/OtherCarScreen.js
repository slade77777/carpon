import React, {Component} from 'react';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SvgImage, SvgViews} from "../../components/Common/SvgImage";
import ImageLoader from "../../components/ImageLoader";
import {images} from "../../assets";
import {navigationService} from "../services/index";
import {connect} from 'react-redux'
import Campaign from "../../components/Campaign";
import {viewPage} from "../Tracker";
import {changeTab} from "../common/actions/metadata";

@connect(state => ({
        profile: state.registration.userProfile.myProfile,
        carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : false,
        carProfile: state.registration.carProfile
    }),
    dispatch => ({
        changeTabScoreScreen: (tab, rank) => dispatch(changeTab(tab, rank)),
    })
)
export default class OtherCarScreen extends Component {
    constructor(props) {

        super(props);
    }

    faceArray(number) {
        let array = [];
        for (let i = 1; i <= number; i++) {
            array.push(i);
        }
        return array
    }

    handleNavigateBenefits() {
        this.props.changeTabScoreScreen(2, this.props.profile.rank - 1);
        this.props.onTabChange(1)
    }

    render() {
        const carInfo = this.props.carInfo.id;
        const profile = this.props.profile;
        const waitingCar = this.props.carProfile.waitingCarHOUY || this.props.carProfile.waitingCarCertification;
        const listSurvey = [
            {
                icon: 'NewIconOtherAccount',
                title: 'マイページ',
                onPress: () => {
                    navigationService.navigate('MyPageScreen', {profile})
                },
                active: true
            }, {
                icon: 'NewIconCar',
                title: '車両データ',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'MyCarProfile' : '')
                },
                active: !!carInfo

            }, {
                icon: 'NewIconSwapCallsOther',
                title: '走行距離',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'MileageChange' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconOil',
                title: 'オイル',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'OilChange' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherTireNew',
                title: 'タイヤ',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'Tire' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconRefueling',
                title: '給油',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'GasStation' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconBuild',
                title: '車検',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'CarInspection' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconCertificate',
                title: '車検証登録・乗り換え',
                onPress: () => {
                    !waitingCar &&
                    navigationService.navigate('UpdateCar')
                },
                active: !waitingCar
            }, {
                icon: 'NewOtherIconReview',
                title: 'レビュー',
                onPress: () => {
                    !!carInfo &&  this.props.onTabChange(3)
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconPostReview',
                title: 'レビュー投稿',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'MyPageScreen' : '', {profile: this.props.profile})
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconScoreUp',
                title: 'スコアアップ',
                onPress: () => {
                    !!carInfo ? this.props.onTabChange(1) : ''
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconBenefits',
                title: '特典',
                onPress: () => {
                    !!carInfo && this.handleNavigateBenefits();
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconRecall',
                title: 'リコール',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'Recall' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconCarInsurance',
                title: '任意保険',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'Insurance' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconLicense',
                title: '運転免許証',
                onPress: () => {
                    navigationService.navigate(carInfo ? 'License' : '')
                },
                active: !!carInfo
            }, {
                icon: 'NewOtherIconSettings',
                title: 'ユーザー設定',
                onPress: () => {
                    navigationService.navigate('AccountSetting')
                },
                active: true
            },
        ];
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{
                backgroundColor: '#FFFFFF',
                height: '100%', flex: 1
            }}>
                {
                    (!this.props.carInfo.qr_code_1 && !waitingCar) ?
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                width: '100%',
                                height: 50,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#F8ECED',
                                borderWidth: 1,
                                borderColor: '#CC0000',
                                paddingHorizontal: 15,
                                justifyContent: 'space-between'
                            }}

                            onPress={() => navigationService.navigate('UpdateCar')}
                        >
                            <View style={{flexDirection: 'row'}}>
                                <SvgImage source={SvgViews.IcInfo}/>
                                <Text style={{fontSize: 17, color: '#CC0000'}}> 車検証が未登録です</Text>
                            </View>
                            <View style={{
                                height: 30,
                                backgroundColor: '#CC0000',
                                justifyContent: 'center',
                                borderRadius: 3
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14,
                                    paddingHorizontal: 10,
                                    fontWeight: 'bold'
                                }}>登録する</Text>
                            </View>
                        </TouchableOpacity> : <View/>
                }
                <Campaign/>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    paddingHorizontal: 15,
                    zIndex: 2
                }}>
                    {
                        listSurvey.map((survey, index) => (
                            <TouchableOpacity activeOpacity={1}
                                              key={index}
                                              onPress={survey.onPress}
                                              style={{
                                                  marginTop: 16,
                                                  width: 84,
                                                  height: 84,
                                                  justifyContent: 'center', alignItems: 'center',
                                                  backgroundColor: 'white'
                                              }}>
                                <View style={{
                                    width: 84,
                                    height: 84,
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    borderColor: '#E5E5E5',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: '#F8F8F8',
                                    paddingVertical: 10
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: survey.active ? 1 : 0.3
                                    }}>
                                        <SvgImage source={SvgViews[survey.icon]}/>
                                    </View>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: survey.active ? 1 : 0.3
                                    }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: '#333333',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            width: 70
                                        }}>{survey.title}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={{
                    height: 150,
                    width: '100%',
                    position: 'absolute',
                    zIndex: 0,
                    top: (Dimensions.get('window').height - 150) / 2
                }}>
                    <SvgImage source={SvgViews.CarBackground}/>
                </View>
            </ScrollView>
        )
    }
}
