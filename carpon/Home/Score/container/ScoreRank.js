import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform} from 'react-native';
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {SvgViews, SvgImage} from "../../../../components/Common/SvgImage";
import {navigationService} from "../../../services";
import {connect} from "react-redux";
import {viewPage} from "../../../Tracker";
import {changeTab} from "../../../common/actions/metadata";

class HeaderCloseIcon extends React.PureComponent {

    onClose = () => {
        navigationService.goBack(null);
    };

    render() {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                this.onClose();
            }} style={{
                alignItems: 'flex-start',
                flex: 1,
                justifyContent: 'center',
            }}>
                <SvgImage source={SvgViews.Remove}/>
            </TouchableOpacity>
        )
    }
}

class RankConditionList extends Component {
    render() {
        const rankConditionList = this.props.rankConditionList ? this.props.rankConditionList : [];
        return rankConditionList.map((element, index) => {
            return (
                <TouchableOpacity activeOpacity={1} key={index} style={{
                    height: 75,
                    backgroundColor: element.opacity ? '#F8F8F8' : '#FFF',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopWidth: index === 0 ? 0.5 : 0,
                    borderBottomWidth: 0.5,
                    borderColor: '#E5E5E5',
                    paddingHorizontal: 15,
                }}
                                  onPress={() => !element.opacity ? navigationService[element.action](element.nextScreen, element.param) : ''}
                >
                    <Text style={{fontSize: 16, color: '#333', lineHeight: 20}}>{element.title}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <SvgImage fill={element.checked ? '#008833' : '#EFEFEF'} style={{paddingHorizontal: 15}}
                                  source={SvgViews.CheckCircle}/>
                        <SvgImage fill={element.opacity ? '#C3DCDE' : '#4B9FA5'} source={SvgViews.ArrowLeft}/>
                    </View>
                </TouchableOpacity>

            )
        })
    }
}

@screen('ScoreRank', {header: <HeaderOnPress leftComponent={<HeaderCloseIcon/>} title="ランクについて"/>})
@connect(state => ({
        myProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        carProfile: state.registration.carProfile.profile
    }),
    dispatch => ({
        changeTabScoreScreen: (tab, rank) => dispatch(changeTab(tab, rank)),
    })
)

export class ScoreRank extends Component {

    state = {
        BenefitButton: false
    };

    handleNavigatePlatinumRank() {
        const {myProfile} = this.props;
        if (!myProfile.car_inspection) {
            return 'CarInspection'
        } else {
            return 'Sale'
        }
    }

    componentDidMount() {
        viewPage('about_rank', 'ランクについて');
        const profile = this.props.myProfile;
        setTimeout(() => {
            if (profile.rank === 2) {
                this.goldRank.measure((fx, fy, width, height, px, py) => {
                    this.myScroll.scrollTo({x: 0, y: Platform.OS === 'ios' ? fy : py - 50, animated: true})
                })
            }
            if (profile.rank === 3) {
                this.platinumRank.measure((fx, fy, width, height, px, py) => {
                    this.myScroll.scrollTo({x: 0, y: Platform.OS === 'ios' ? fy : py - 50, animated: true})
                })
            }
        }, 500)
    }

    handleCheckPlatinumRank() {
        const {myProfile} = this.props;
        let count = 0;
        if (myProfile.car_inspection) {
            count++
        }
        if (myProfile.car_selling) {
            count++
        }
        if (myProfile.has_individual_estimation) {
            count++
        }
        return count > 1
    }

    handleNavigate(rank) {
        this.props.changeTabScoreScreen(2, rank);
        return navigationService.goBack()
    }

    render() {
        const {myProfile} = this.props;
        const totalScore = myProfile.total_score ? myProfile.total_score : 0;
        const carProfile = this.props.carProfile ? this.props.carProfile : {};

        const RegularRankConditionList = [
            {
                title: 'カーライフスコアが500pts以上',
                checked: totalScore >= 500,
                opacity: totalScore >= 500,
                action: 'popToTop',
                nextScreen: '',
                param: ''
            },
            {
                title: '車検証登録',
                checked: !!carProfile.qr_code_1,
                opacity: !!carProfile.qr_code_1,
                action: 'navigate',
                nextScreen: 'PrepareCameraQR',
                param: {isAddQR: true}
            },
            {
                title: '車検申込み、任意保険個別見積、\n' +
                '買取査定のいずれか1つのご利用',
                checked: (myProfile.car_inspection || myProfile.car_selling || myProfile.has_individual_estimation),
                opacity: (myProfile.car_inspection || myProfile.car_selling || myProfile.has_individual_estimation),
                action: 'navigate',
                nextScreen: 'CarInspection',
                param: ''
            },
        ];

        const GoldRankConditionList = [
            {
                title: 'カーライフスコアが700pts以上',
                checked: totalScore >= 700,
                opacity: totalScore >= 700,
                action: 'popToTop',
                nextScreen: '',
                param: ''
            },
            {
                title: '車検申込み、任意保険個別見積、\n' +
                '買取査定のいずれか2つのご利用',
                checked: this.handleCheckPlatinumRank(),
                opacity: this.handleCheckPlatinumRank(),
                action: 'navigate',
                nextScreen: this.handleNavigatePlatinumRank(),
                param: ''
            },
        ];

        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFF'}} ref={(ref) => this.myScroll = ref}>
                    <View style={styles.wrapper}>
                        <Text style={styles.fontStyle1}>レギュラー
                            {myProfile.rank === 1 && <Text>（現在のランク）</Text>}
                        </Text>
                    </View>
                    <View style={{paddingTop: 40, paddingBottom: 25}}>
                        <SvgImage source={SvgViews.RegularIcon}/>
                    </View>
                    <Text style={styles.fontStyle2}>初期ランクです。レギュラーランク特典がご利用いただけます。ランクアップの条件を満たすとゴールドランクに昇格します。</Text>
                    <View style={{height: 5}}/>
                    <View style={{padding: 15}}>
                        <TouchableOpacity
                            onPress={() => this.handleNavigate(0)}
                            activeOpacity={0.3} style={styles.touchableStyle1}>
                            <Text style={styles.fontStyle3}>特典を見る</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewStyle1}>
                        <Text style={styles.fontStyle4}>ランクアップへの条件</Text>
                    </View>
                    <View style={{paddingVertical: 20}}>
                        <RankConditionList rankConditionList={RegularRankConditionList}/>
                    </View>
                    <View style={{...styles.wrapper, marginTop: 15}} ref={view => {
                        this.goldRank = view;
                    }}>
                        <Text style={styles.fontStyle1}>ゴールド
                            {myProfile.rank === 2 && <Text>（現在のランク）</Text>}
                        </Text>
                    </View>
                    <View style={{paddingTop: 40, paddingBottom: 25}}>
                        <SvgImage source={SvgViews.GoldIcon}/>
                    </View>
                    <Text
                        style={styles.fontStyle2}>レギュラー・ゴールドランク特典がご利用いただけます。ランクアップの条件を満たすとプラチナランクに昇格します。</Text>
                    <View style={{padding: 15}}>
                        <TouchableOpacity onPress={() => this.handleNavigate(1)} style={styles.touchableStyle1}>
                            <Text style={styles.fontStyle3}>特典を見る</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewStyle1}>
                        <Text style={styles.fontStyle4}>ランクアップへの条件</Text>
                    </View>
                    <View style={{paddingVertical: 20}}>
                        <RankConditionList rankConditionList={GoldRankConditionList}/>
                    </View>
                    <View style={{...styles.wrapper, marginTop: 15}} ref={view => {
                        this.platinumRank = view;
                    }}>
                        <Text style={styles.fontStyle1}>プラチナ
                            {myProfile.rank === 3 && <Text>（現在のランク）</Text>}
                        </Text>
                    </View>
                    <View style={{paddingTop: 40, paddingBottom: 25}}>
                        <SvgImage source={SvgViews.PlatinumIcon}/>
                    </View>
                    <Text
                        style={styles.fontStyle2}>最高ランクです。すべてのランク特典をご利用いただけます。</Text>
                    <View style={{padding: 15, marginVertical: 10}}>
                        <TouchableOpacity onPress={() => this.handleNavigate(2)} style={styles.touchableStyle1}>
                            <Text style={styles.fontStyle3}>特典を見る</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={styles.wrapper}>
                            <Text style={styles.fontStyle1}>その他</Text>
                        </View>
                        <View style={{height:15}}/>
                        <View style={styles.viewStyle1}>
                            <Text style={styles.fontStyle4}>Car Life Scoreを上げるには？</Text>
                        </View>
                        <View style={{padding: 15}}>
                            <Text style={{fontSize: 17, color: '#333'}}>車両情報やスコアアップ項目の充実度、ニュースコメントやレビューへのいいね数やフォローされている数などのコミュニティへの関与度合いなど複数の項目から算出しています。このアプリを日頃からご利用いただくことで、Car
                                Life Scoreが上がります。</Text>
                        </View>
                        <View style={styles.viewStyle1}>
                            <Text style={styles.fontStyle4}>ランクの維持について</Text>
                        </View>
                        <View style={{paddingHorizontal: 15, paddingTop: 15}}>
                            <Text style={{fontSize: 17, color: '#333'}}>
                                一度ランクに到達すると、以後、基礎点の増減に関わらずそのランクは維持されます。ただし3ヶ月以上ご利用のなかった場合にはランクの維持は解除されますのでご注意ください。
                            </Text>
                        </View>
                        <View style={{height: 30}}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderBottomColor: '#4B9FA5',
        padding: 15,
        borderBottomWidth: 2,
        backgroundColor: '#F8F8F8',
        borderTopWidth: 0.5,
        borderTopColor: '#e5e5e5'
    },

    fontStyle1: {fontSize: 15, fontWeight: 'bold'},
    fontStyle2: {
        fontSize: 17,
        paddingHorizontal: 15,
        lineHeight: 22
    },
    fontStyle3: {color: 'white', fontSize: 16, fontWeight: 'bold'},
    fontStyle4: {color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'},
    fontStyle5: {flex: 6, fontSize: 16, color: '#707070'},
    fontStyle6: {fontWeight: 'bold', fontSize: 17},
    fontStyle7: {fontSize: 16, color: '#333'},

    touchableStyle1: {
        backgroundColor: '#4b9fa5',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        height: 50,
    },
    touchableStyle2: {
        flex: 1, flexDirection: 'row', paddingVertical: 20, paddingRight: 10,
        borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
        borderTopColor: '#e5e5e5', borderTopWidth: 1
    },
    touchableStyle3: {
        flex: 1, flexDirection: 'row', paddingVertical: 20, paddingRight: 10,
        borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
    },

    viewStyle1: {padding: 18, backgroundColor: '#F2F8F9', marginTop: 5, borderBottomWidth: 1, borderColor: '#4b9fa5'},
    viewStyle2: {flex: 1, flexDirection: 'column', backgroundColor: '#F8F8F8'},
    viewStyle3: {flex: 7, flexDirection: 'row', alignItems: 'center', paddingRight: 50},
    viewStyle4: {flex: 1, flexDirection: 'row', alignItems: 'center'},
    viewStyle5: {flex: 1, flexDirection: 'column', backgroundColor: 'white'},
});
