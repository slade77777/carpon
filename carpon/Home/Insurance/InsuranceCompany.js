import React, {Component} from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    View, ScrollView,
    SafeAreaView, Image
} from 'react-native';
import {screen} from '../../../navigation';
import {SvgImage, SvgViews} from '../../../components/Common/SvgImage'
import {images} from "../../../assets/index";
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import color from "../../color";
import moment from 'moment';
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import {viewPage} from "../../Tracker";
import CarponRate from "../Review/container/CarponRate";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width} = Dimensions.get('window');
const companyImages = [ images.sbiCompany, images.mitsuiCompany, images.adultCompany];

@screen('InsuranceCompany', ({navigation}) => ({ header: <HeaderOnPress
        leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>}
        onPress={() => navigationService.clear('MainTab')}
        title={navigation.getParam('headerTitle') || '任意保険詳細見積'}/>
}))
@connect(
    state => ({
        insuranceInfo: state.insurance.insuranceInfo,
        insuranceCreateDate: state.insurance.createDate,
        myProfile: state.registration.userProfile.myProfile,
        bodyRequest: state.insurance.bodyRequest,
        answerList: state.metadata.answers,
        review: state.review
    }),
    ()=>({})
)
export class InsuranceCompany extends Component {

    state = {
        firstRate: true
    };

    handleUpdate(company, companyImage) {
        navigationService.navigate('InsuranceInformation', {company, companyImage, estimation_type: this.props.myProfile.estimation_type} );
    }

    componentDidMount() {
        viewPage('insurance_estimations_list', '任意保険見積結果_一覧');
    }

    renderCompanyNull(image, index, item) {
        let note = 'お見積もりできませんでした';
        let isCompany23 = false;
        if (item && item.response_data && item.response_data.id === '23') {
            const nextThreeMonths = moment().add(3, 'M').format('YYYY-MM-DD');
            const insurance_expired = moment(this.props.answerList.insurance_expiration_date);
            if (insurance_expired.diff(nextThreeMonths, 'days') > 0) {
                isCompany23 = true;
                note = '任意保険満期まで3ヶ月以上あるため、お見積りできません'
            }
        }
        return (
            <View key={index}>
                <View style={{
                    paddingHorizontal: 15,
                    height: 100,
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5E5',
                    alignItems: 'center'
                }}>
                    <View style={{justifyContent: 'center', alignItems: 'center', width: width/5, borderWidth: 1, borderColor: '#E5E5E5', height: width/5}}>
                        <Image source={image} style={{ width: width/5 - 10, height: width/5 - 10}}/>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        width: '70%',
                        paddingLeft: 20
                    }}>
                        <Text style={{ fontSize: 14, color: isCompany23 ? '#F37B7D' : '#666666'}}>{note}</Text>
                        <View style={{ flexDirection: 'row'}}>
                            <Text style={{ fontSize: 27}}>--,---</Text>
                            <Text style={{ fontSize: 17, marginTop: 11}}>円</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    handleTurnOffRateAlert() {
        this.setState({firstRate: false})
    }

    render() {
        let companyShow = [];
        let tripCompanyCost = null;
        if (this.props.insuranceInfo && this.props.insuranceInfo.length > 0) {
            tripCompanyCost = Math.min(...[this.props.insuranceInfo[0].response_data.estimation_cost || 100000000, this.props.insuranceInfo[1].response_data.estimation_cost || 100000000, this.props.insuranceInfo[2].response_data.estimation_cost || 100000000]);
        }
        if (this.props.insuranceInfo && this.props.insuranceInfo.length > 0) {
            this.props.insuranceInfo.map((item, index) => {
                if (item && item.response_data && item.response_data.status === '030000') {
                    const company = item.response_data;
                    const request = item.request_data;
                    companyShow.push(
                        <TouchableOpacity activeOpacity={1} onPress={() => this.handleUpdate(item, companyImages[index])} key={index}>
                            <View style={{
                                paddingHorizontal: 15,
                                height: 100,
                                flexDirection: 'row',
                                borderTopWidth: 1,
                                borderTopColor: '#E5E5E5',
                                alignItems: 'center'
                            }}>
                                <View style={{justifyContent: 'center', alignItems: 'center', width: width/5, borderWidth: 1, borderColor: '#E5E5E5', height: width/5}}>
                                    <Image source={companyImages[index]} style={{ width: width/5 - 10, height: width/5 - 10}}/>
                                </View>
                                <View style={{
                                    justifyContent: 'center',
                                    width: '70%',
                                    paddingLeft: 20
                                }}>
                                    <Text style={{ fontSize: 14}}>{company.name}</Text>
                                    <View style={{ flexDirection: 'row'}}>
                                        <Text style={{ fontSize: 27, color: company.estimation_cost == tripCompanyCost ? '#008833' : '#333333'}}>{company.estimation_cost && company.estimation_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        <Text style={{ fontSize: 17, marginTop: 11, color: company.estimation_cost == tripCompanyCost ? '#008833' : '#333333'}}>円</Text>
                                    </View>
                                    {(request.vehicle_insurance == 2 || request.vehicle_insurance == 3) && company.vehicle_insurance_amount == "0" &&
                                    <Text style={{ color: '#F37B7D', fontSize: 14, marginTop: 3, lineHeight: 17}}>車両保険は付けられません</Text>
                                    }
                                </View>
                                <View style={{justifyContent: 'center', alignItems: 'flex-end', width: '10%'}}>
                                    <SvgImage source={SvgViews.ArrowLeft}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                } else {
                    companyShow.push(
                        this.renderCompanyNull(companyImages[index], index, item)
                    )
                }
            });
        } else {
            for (let i = 0; i < 3; i++) {
                companyShow.push(
                    this.renderCompanyNull(companyImages[i], i)
                )
            }
        }

        return (
            <View style={{ flex : 1}}>
                {
                    (this.props.review.reviewAppStatus && this.state.firstRate) &&
                    <CarponRate handleTurnOffRateAlert={()=> this.handleTurnOffRateAlert()}/>
                }
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}>
                            <View style={{marginBottom: 15, height: 35, justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#333333', borderBottomWidth: 1, borderColor: color.active}}>
                                <Text style={{ color: '#F37B7D', fontSize: 14, fontWeight: 'bold'}}>
                                    お見積もり作成日：{moment(this.props.insuranceCreateDate || new Date()).format('YYYY/MM/DD')}
                                </Text>
                            </View>
                            <View style={{marginTop: 5, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}>
                                {companyShow}
                            </View>
                            {
                                this.props.myProfile.estimation_type === "easy" ?
                                    <View style={{ margin: 15}}>
                                        <Text style={Styles.infoText}>※セゾン自動車火災保険は現在準備中のため見積もりが表示されません。</Text>
                                        <Text style={Styles.infoText}>※簡易条件によるお見積もりです。</Text>
                                        <Text style={Styles.infoText}>※車両保険は含まれておりません。詳細見積り時に付帯することができます。</Text>

                                    </View>
                                    : <View style={{ margin: 15}}>
                                        <Text style={Styles.infoText}>※セゾン自動車火災保険は現在準備中のため見積もりが表示されません。</Text>
                                    </View>
                            }
                            <View style={{ margin: 15}}>
                                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333333'}}>【推奨方針】</Text>
                                <Text style={{marginTop: 5, fontSize: 12, lineHeight: 18, color: '#333333'}}>任意自動車保険に関してインターネット経由の加入インフラが整備されており、利便性が高いため、「SBI損害保険株式会社」「セゾン自動車火災保険株式会社」「三井ダイレクト損害保険株式会社」をお薦めしております。</Text>
                            </View>
                            <View style={{height:60}}/>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace() : 15, position: 'absolute', bottom: 0, width: '100%',

                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#F37B7D'}}
                                          onPress={() => navigationService.navigate('InsuranceSplash')}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>{this.props.myProfile.estimation_type === "easy" ? '詳しい条件で一括見積' : '条件を変更して再見積' }</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    infoText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#262626'
    },
});
