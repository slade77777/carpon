import React, {Component} from 'react';
import {Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {screen} from '../../../navigation';
import stylesCommon from '../../../style';
import {connect} from 'react-redux';
import {SingleColumnLayout} from "../../layouts";
import color from "../../color";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {navigationService} from "../../services/index";
import moment from 'moment';
import {SvgImage} from "../../../components/Common/SvgImage";
import SvgViews from "../../../assets/svg/index";
import _ from 'lodash';
import {viewPage} from "../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width} = Dimensions.get('window');

function getAge(date) {
    const currentDate = new Date();
    const registerDate = new Date(date);
    let months = currentDate.getMonth() - registerDate.getMonth();
    let years = currentDate.getFullYear() - registerDate.getFullYear();
    if (months < 0) {
        years -= 1;
    }
    return years;
}


function formatInsuranceAmount(amount) {
    if (amount.toString() === '0') {
        return '付帯なし';
    } else {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '万円'
    }
}

function formatInsuranceCompensate(value) {
    const _value = parseInt(value);
    if(_value === 0){
        return '不担保'
    }if(_value >= 99999){
        return '無制限'
    }else {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '万円'
    }
}

@screen('InsuranceInformation', ({navigation}) => {
    return {
        header: <HeaderOnPress
            title={(navigation.getParam('estimation_type') === 'detail' || navigation.getParam('estimation_type') === 'individual') ? '任意保険詳細見積' : '任意保険簡易見積'}
            navigation={navigation}/>
    }
})
@connect(state => ({
    carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : [],
    answer: state.metadata.answers,
    InterpersonalList: state.metadata.profileOptions ? state.metadata.profileOptions.対人賠償保険 : [],
    ObjectiveList: state.metadata.profileOptions ? state.metadata.profileOptions.対物賠償保険 : [],
    PersonalList: state.metadata.profileOptions ? state.metadata.profileOptions.人身傷害保険 : [],
    vehicleList: state.metadata.profileOptions ? state.metadata.profileOptions.車両保険 : [],
    optionsList: state.metadata.profileOptions,
    provinceList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
    myProfile: state.registration.userProfile.myProfile,
    companyList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
}))
export class InsuranceInformation extends Component {
    constructor(props) {
        super(props);
        const companyInfo = this.props.navigation.getParam('company').response_data;
        const companyRequest = this.props.navigation.getParam('company').request_data;
        const myProfile = this.props.myProfile;
        let vehicle_insurance = null;
        if ((companyRequest.vehicle_insurance == 2 || companyRequest.vehicle_insurance == 3) && companyInfo.vehicle_insurance_amount == "0") {
            vehicle_insurance = '車両保険は付けられません';
        } else {
            if (companyRequest) {
                vehicle_insurance = this.getAnswerQuestion(this.props.vehicleList, companyRequest.vehicle_insurance);
            } else {
                vehicle_insurance = '';
            }
        }
        let province = '';
        const provinceChoice = _.filter(this.props.provinceList, {value: myProfile.province});
        if (provinceChoice && provinceChoice[0]) {
            province = provinceChoice[0].label;
        }
        this.state = {
            tabContent: 1,
            quotation: [
                {
                    title: '基本情報（新しい契約）',
                    part: [
                        {
                            name: '保険始期日',
                            value: companyInfo ? moment(companyInfo.insurance_start_date).format('YYYY年MM月DD日') : ''
                        },
                        {
                            name: '保険期間',
                            value: companyInfo ? companyInfo.period_of_insurance + '年' : ''
                        },
                        {
                            name: '適用ノンフリート等級',
                            value: companyInfo ? this.getAnswerQuestion(this.props.optionsList.insurance_nonfleet_grade, companyInfo.insurance_nonfleet_grade) : ''
                        }
                    ]
                },
                {
                    title: '記名被保険者（主に運転する人）',
                    part: [
                        {
                            name: '年齢',
                            value: companyRequest ? getAge(companyRequest.birthday) + '歳' : ''
                        },
                        {
                            name: '住所（都道府県）',
                            value: province
                        },
                        {
                            name: '運転免許証の色',
                            value: companyRequest ? this.getAnswerQuestion(this.props.optionsList.color_of_driver_license, companyRequest.color_of_driver_license) : ''
                        }
                    ]
                },
                {
                    title: '被保険自動車（マイカー）',
                    part: [
                        {
                            name: '車名',
                            value: companyRequest ? companyRequest.car_name : ''
                        },
                        {
                            name: '型式',
                            value: companyRequest ? companyRequest.form : ''
                        },
                        {
                            name: '用途車種',
                            value: companyRequest ? companyRequest.use_class : ''
                        },
                        {
                            name: '年間走行距離区分',
                            value: companyRequest ? this.getAnswerQuestion(this.props.optionsList.yearly_mileage_plan, companyRequest.yearly_mileage_plan) : ''
                        },
                        {
                            name: '使用目的',
                            value: companyRequest ? this.getAnswerQuestion(this.props.optionsList.purpose_of_use, companyRequest.purpose_of_use) : ''
                        }
                    ]
                },
                {
                    title: '現在のご契約',
                    part: [
                        {
                            name: '保険期間',
                            value: '1年間'
                        },
                        {
                            name: 'ノンフリート等級',
                            value: companyRequest ? this.getAnswerQuestion(this.props.optionsList.insurance_nonfleet_grade, companyRequest.insurance_nonfleet_grade) : ''
                        },
                        {
                            name: '事故有係数適用期間',
                            value: companyRequest ? this.getAnswerQuestion(this.props.optionsList.accident_coefficient_applied_term, companyRequest.accident_coefficient_applied_term) : ''
                        }
                    ]
                }
            ],
            compensateContent: [
                {
                    name: 'interpersonal_compensation_insurance',
                    keyword: '対人賠償保険',
                    value: companyInfo && formatInsuranceCompensate(companyInfo.interpersonal_compensation_insurance)
                },
                {
                    name: 'objective_compensation_insurance',
                    keyword: '対物賠償保険（免責金額0円）',
                    value: companyInfo && formatInsuranceCompensate(companyInfo.objective_compensation_insurance)
                },
                {
                    name: 'personal_injury_insurance',
                    keyword: '人身傷害保険',
                    value: companyInfo && formatInsuranceCompensate(companyInfo.personal_injury_insurance)
                },
                {
                    name: 'passenger_injury_insurance',
                    keyword: '搭乗者傷害保険',
                    value: companyInfo && formatInsuranceCompensate(companyInfo.passenger_injury_insurance)
                },
                ...companyInfo.accompanying_special_contract.map(item => {
                    return {
                        name: '',
                        keyword: item,
                        value: ''
                    }
                }),
            ],
            carInfo: [
                {
                    name: 'vehicle_insurance',
                    keyword: '車両保険',
                    value: vehicle_insurance
                },
                {
                    name: 'vehicle_insurance_amount',
                    keyword: '車両保険金額',
                    value: companyInfo ? (
                        formatInsuranceAmount(companyInfo.vehicle_insurance_amount)
                    ) : ''
                },
                {
                    name: 'personal_contract',
                    keyword: '免責金額',
                    value: companyInfo ? (
                        formatInsuranceAmount(companyInfo.disclaimer1) + ' ・ ' +
                        formatInsuranceAmount(companyInfo.disclaimer2)
                    ) : ''
                },
            ],
            listOtherDriver: [
                {
                    visible: myProfile.spouse_birthday,
                    label: '配偶者',
                    age: myProfile.spouse_birthday ? this.getAge(myProfile.spouse_birthday) + '歳' : '',
                    values: false
                },
                {
                    visible: myProfile.first_child_driver_gender,
                    label: '子供',
                    gender: myProfile.first_child_driver_gender ? (myProfile.first_child_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.first_child_driver_birthday ? this.getAge(myProfile.first_child_driver_birthday) + '歳' : '',
                    living: myProfile.first_child_driver_living ? (myProfile.first_child_driver_living === 1 ? '同居' : '別居') : '',
                    marital: myProfile.first_child_driver_marital_status ? (myProfile.first_child_driver_marital_status === 1 ? '既婚' : '未婚') : '',
                    livinghood: myProfile.first_child_driver_livinghood ? (myProfile.first_child_driver_livinghood === 1 ? '共にする' : '別にする') : '',
                    values: true
                },
                {
                    visible: myProfile.second_child_driver_gender,
                    label: '子供',
                    gender: myProfile.second_child_driver_gender ? (myProfile.second_child_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.second_child_driver_birthday ? this.getAge(myProfile.second_child_driver_birthday) + '歳' : '',
                    living: myProfile.second_child_driver_living ? (myProfile.second_child_driver_living === 1 ? '同居' : '別居') : '',
                    marital: myProfile.second_child_driver_marital_status ? (myProfile.second_child_driver_marital_status === 1 ? '既婚' : '未婚') : '',
                    livinghood: myProfile.second_child_driver_livinghood ? (myProfile.second_child_driver_livinghood === 1 ? '共にする' : '別にする') : '',
                    values: true
                },
                {
                    visible: myProfile.third_child_driver_gender,
                    label: '子供',
                    gender: myProfile.third_child_driver_gender ? (myProfile.third_child_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.third_child_driver_birthday ? this.getAge(myProfile.third_child_driver_birthday) + '歳' : '',
                    living: myProfile.third_child_driver_living ? (myProfile.third_child_driver_living === 1 ? '同居' : '別居') : '',
                    marital: myProfile.third_child_driver_marital_status ? (myProfile.third_child_driver_marital_status === 1 ? '既婚' : '未婚') : '',
                    livinghood: myProfile.third_child_driver_livinghood ? (myProfile.third_child_driver_livinghood === 1 ? '共にする' : '別にする') : '',
                    values: true
                },
                {
                    visible: myProfile.fourth_child_driver_gender,
                    label: '子供',
                    gender: myProfile.fourth_child_driver_gender ? (myProfile.fourth_child_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.fourth_child_driver_birthday ? this.getAge(myProfile.fourth_child_driver_birthday) + '歳' : '',
                    living: myProfile.fourth_child_driver_living ? (myProfile.fourth_child_driver_living === 1 ? '同居' : '別居') : '',
                    marital: myProfile.fourth_child_driver_marital_status ? (myProfile.fourth_child_driver_marital_status === 1 ? '既婚' : '未婚') : '',
                    livinghood: myProfile.fourth_child_driver_livinghood ? (myProfile.fourth_child_driver_livinghood === 1 ? '共にする' : '別にする') : '',
                    values: true
                },
                {
                    visible: myProfile.first_family_driver_gender,
                    label: '親族',
                    gender: myProfile.first_family_driver_gender ? (myProfile.first_family_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.first_family_driver_birthday ? this.getAge(myProfile.first_family_driver_birthday) + '歳' : '',
                    type: myProfile.first_family_driver_type ? (myProfile.first_family_driver_type === 1 ? '兄弟' : (myProfile.first_family_driver_type === 2 ? '父母' : 'その他')) : '',
                    values: true
                },
                {
                    visible: myProfile.second_family_driver_gender,
                    label: '親族',
                    gender: myProfile.second_family_driver_gender ? (myProfile.second_family_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.second_family_driver_birthday ? this.getAge(myProfile.second_family_driver_birthday) + '歳' : '',
                    type: myProfile.second_family_driver_type ? (myProfile.second_family_driver_type === 1 ? '兄弟' : (myProfile.second_family_driver_type === 2 ? '父母' : 'その他')) : '',
                    values: true
                },
                {
                    visible: myProfile.third_family_driver_gender,
                    label: '親族',
                    gender: myProfile.third_family_driver_gender ? (myProfile.third_family_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.third_family_driver_birthday ? this.getAge(myProfile.third_family_driver_birthday) + '歳' : '',
                    type: myProfile.third_family_driver_type ? (myProfile.third_family_driver_type === 1 ? '兄弟' : (myProfile.third_family_driver_type === 2 ? '父母' : 'その他')) : '',
                    values: true
                },
                {
                    visible: myProfile.fourth_family_driver_gender,
                    label: '親族',
                    gender: myProfile.fourth_family_driver_gender ? (myProfile.fourth_family_driver_gender === 1 ? '男性' : '女性') : '',
                    age: myProfile.fourth_family_driver_birthday ? this.getAge(myProfile.fourth_family_driver_birthday) + '歳' : '',
                    type: myProfile.fourth_family_driver_type ? (myProfile.fourth_family_driver_type === 1 ? '兄弟' : (myProfile.fourth_family_driver_type === 2 ? '父母' : 'その他')) : '',
                    values: true
                },
                {
                    visible: myProfile.youngest_driver_age,
                    label: '友人・知人等',
                    age: myProfile.youngest_driver_age ? myProfile.youngest_driver_age + '歳' : '',
                    values: false
                }

            ]
        };
    }

    componentDidMount() {
        const companyInfo = this.props.navigation.getParam('company').response_data;
        const insurance = this.props.companyList.find((item) => item.nttif_code === companyInfo.id);
        const companyName = insurance ? insurance.name : '';
        viewPage('insurance_estimation_detail', `任意保険見積結果_詳細： ${companyInfo.id}(${companyName}) `)
    }

    getAnswerQuestion(list, value) {
        const choice = list.find((item) => item.value == value);
        return choice ? (choice.label || choice.name) : null;
    }

    getAge(date) {
        const currentDate = new Date();
        const registerDate = new Date(date);
        let months = currentDate.getMonth() - registerDate.getMonth();
        let years = currentDate.getFullYear() - registerDate.getFullYear();
        if (months < 0) {
            years -= 1;
        }
        return years;
    }

    handleUpdate() {
        navigationService.clear('MainTab');
    }

    render() {
        const estimationType = this.props.myProfile.estimation_type;
        const company = this.props.navigation.getParam('company').response_data;
        const companyImage = this.props.navigation.getParam('companyImage');
        let compensateContent = [];
        let userInfo = [];
        let quotation = [];
        let family = [];
        this.state.listOtherDriver.map((item, index) => {
            if (item.visible) {
                family.push(
                    <View key={index} style={{
                        height: 50,
                        borderColor: '#E5E5E5',
                        borderWidth: 0.5,
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            paddingHorizontal: 15, flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{fontSize: 14, color: '#333333', fontWeight: 'bold'}}>
                                {item.label}
                            </Text>
                            <View style={{
                                flexDirection: item.values ? 'column' : 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <Text style={{fontSize: 17, color: '#666666', justifyContent: 'space-between'}}>
                                    {item.age ? (item.values ? item.gender + ' : ' + item.age : item.age) : ''}
                                </Text>
                                {
                                    item.values ?
                                        <Text style={{fontSize: 17, color: '#666666'}}>
                                            {item.living ? (item.living + ' ' + item.marital + ' ' + item.livinghood) : item.type}
                                        </Text> : null
                                }

                            </View>
                        </View>
                    </View>
                )
            }
        });
        this.state.compensateContent.map((item, index) => {
            compensateContent.push(
                <View key={index} style={{
                    height: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E5E5',
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.keyword}</Text>
                    <Text style={{fontSize: 16, color: '#666666'}}>{item.value}</Text>
                </View>
            )
        });
        this.state.carInfo.map((item, index) => {
            userInfo.push(
                <View key={index} style={{
                    height: 50,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5E5',
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>{item.keyword}</Text>
                    <Text style={{fontSize: 16, color: item.value === '車両保険は付けられません' ? '#F37B7D' : '#666666', textAlign: 'right'}}>{item.value}</Text>
                </View>
            )
        });
        this.state.quotation.map((item, index) => {
            let info = [];
            item.part.map((part, key) => {
                info.push(
                    <View key={key} style={{
                        height: 50,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E5E5',
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', width: width/2 - 20}}>{part.name}</Text>
                        <Text numberOfLines={1} style={{fontSize: 16, color: '#666666', textAlign: 'right', width: width/2 - 20}}>{part.value}</Text>
                    </View>
                )
            });
            quotation.push(
                <View key={index}>
                    <View
                        style={{height: 50, paddingVertical: 5, backgroundColor: '#F2F8F9', justifyContent: 'center'}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold', paddingLeft: 20}}>
                            {item.title}
                        </Text>
                    </View>
                    {info}
                </View>
            )
        });
        return (
            <View style={{flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: 40}} style={styles.body}>
                            <View style={{padding: 20}}>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={companyImage} style={{width: width * 0.6, height: width * 0.3}}/>
                                </View>
                                <View style={{
                                    borderWidth: 2,
                                    borderColor: '#4B9FA5',
                                    marginTop: 20
                                }}>
                                    <View style={{
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: '#4B9FA5',
                                            fontWeight: 'bold',
                                            padding: 10
                                        }}>{company.name}（一括払）</Text>
                                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                                            <Text style={{
                                                fontSize: 40,
                                                fontWeight: 'bold'
                                            }}>{company.estimation_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            <Text style={{marginTop: 16, fontSize: 24}}>円</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {userInfo}
                                    </View>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <ButtonCarpon disabled={false}
                                                  style={{backgroundColor: '#007FEB', height: 50, display: 'flex'}}
                                                  onPress={() => {
                                                      estimationType === 'easy' ?
                                                          navigationService.navigate('InsuranceSplash') :
                                                          navigationService.navigate('InsuranceQuestionList', {
                                                              companyImage,
                                                              company
                                                          });
                                                  }
                                                  }>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 5}}>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                color: '#FFFFFF'
                                            }}>{estimationType === 'easy' ? "詳しい条件で一括見積" : company.name + 'で個別見積'}</Text>
                                        </View>
                                        <View style={{flex: 1}}>
                                            <SvgImage source={() => SvgViews.MoveNext({fill: 'white'})}/>
                                        </View>
                                    </ButtonCarpon>
                                </View>
                            </View>
                            <View style={styles.g2}>
                                <TouchableOpacity activeOpacity={1} style={{
                                    flex: 1,
                                    backgroundColor: this.state.tabContent === 1 ? color.active : 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={() => this.setState({tabContent: 1})}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: this.state.tabContent === 1 ? 'white' : 'black'
                                        }}>見積条件</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1}
                                    style={{
                                        flex: 1,
                                        backgroundColor: this.state.tabContent === 2 ? color.active : 'white',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => this.setState({tabContent: 2})}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: this.state.tabContent === 2 ? 'white' : 'black'
                                    }}>主な補償内容</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                {this.state.tabContent === 1 ? quotation : compensateContent}
                            </View>
                            <View>
                                {this.state.tabContent === 1 && family}
                            </View>
                            <View style={{
                                borderTopWidth: 1,
                                borderTopColor: '#E5E5E5',
                                paddingHorizontal: 15,
                                paddingBottom: 100,
                                paddingTop: 15
                            }}>
                                <Text style={styles.inforText}>
                                    ご契約にあたっては、必ず「重要事項説明書」をよくお読みください。ご不明な点についてはお問合せください。
                                </Text>
                                <Text style={styles.inforText}>
                                    ・本内容については保険商品の内容の全てが記載されているものではありません。
                                </Text>
                                <Text style={styles.inforText}>
                                    ・保険商品の内容については、必ず「契約概要」やパンフレットにおいて全般的に確認ください。
                                </Text>
                                <Text style={styles.inforText}>
                                    ・保険料だけではなく補償内容等の他の要素も考慮に入れた上で比較・検討することが必要です。必要に応じて、保険会社ホームページて商品情報をご確認ください。
                                </Text>
                                <Text style={styles.inforText}>
                                    ・前提条件の相違により保険料が異なる場合があります。実際に適用される保険料については、保険会社WEBサイトで再度ご確認の上、お手続ください。
                                </Text>
                                <Text style={styles.inforText}>
                                    ・各保険会社のお支払い方法につきましては保険会社WEBサイトにてご確認ください。
                                </Text>
                                {
                                    company.id === '23' && <Text style={styles.inforText}>株式会社ファブリカコミュニケーションズは、セゾン自動車火災保険株式会社の保険契約締結の媒介を行うもので、保険契約締結の代理権・保険料領収権および告知受領権はありません。</Text>
                                }
                                {
                                    company.id === '3G' && <Text style={styles.inforText}>株式会社ファブリカコミュニケーションズは、SBI損害保険株式会社の保険契約締結の媒介を行うもので、保険契約締結の代理権・保険料領収権および告知受領権はありません。</Text>
                                }
                                {
                                    company.id === '28' && <Text style={styles.inforText}>株式会社ファブリカコミュニケーションズは、三井ダイレクト損害保険株式会社の保険契約締結の媒介を行うもので、保険契約締結の代理権・保険料領収権および告知受領権はありません。</Text>
                                }
                            </View>
                        </ScrollView>
                    }
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)',
                            paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15,
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                        }}>
                            <ButtonCarpon disabled={false}
                                          style={{backgroundColor: '#007FEB', height: 50, display: 'flex'}}
                                          onPress={() => {
                                              estimationType === 'easy' ?
                                                  navigationService.navigate('InsuranceSplash') :
                                                  navigationService.navigate('InsuranceQuestionList', {
                                                      companyImage,
                                                      company
                                                  });
                                          }
                                          }>
                                <View style={{flex: 1}}/>
                                <View style={{flex: 5}}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        color: '#FFFFFF'
                                    }}>{estimationType === 'easy' ? "詳しい条件で一括見積" : company.name + 'で個別見積'}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <SvgImage source={() => SvgViews.MoveNext({fill: 'white'})}/>
                                </View>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center'
    },
    g2: {
        marginTop: 10,
        backgroundColor: '#F8F8F8',
        borderTopWidth: 0.5,
        borderTopColor: '#E5E5E5',
        borderBottomWidth: 2,
        borderBottomColor: '#4B9FA5',
        flexDirection: 'row',
        height: 50
    },
    button: {
        height: 60,
        backgroundColor: '#CCCCCC',
        borderRadius: 3
    },
    width30: {
        width: '40%',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        backgroundColor: '#F8F8F8'
    },
    width70: {
        width: '60%',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
        paddingLeft: 10
    },
    value: {
        paddingLeft: 10
    },
    inforText: {
        fontSize: 13,
        color: '#666666',
        lineHeight: 20
    }
});
