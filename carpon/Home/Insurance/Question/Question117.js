import React, {Component} from 'react';
import {View, Alert, Text, FlatList, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from "../../../../navigation";
import WrapperQuestion from "./component/WrapperQuestion";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from 'react-redux';
import moment from "moment/moment";
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

import {navigationService} from "../../../services";
import {viewPage} from "../../../Tracker";
import {isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

@screen('Question117', {header:<HeaderOnPress
        title={'任意保険見積'}
        leftComponent={
            <View>
                <Icon name="md-close" size={30} color="#FFFFFF"/>
            </View>
        }
        onPress={() => Alert.alert(
              '詳細見積をキャンセルします',
              'ここまでの登録内容を保存し、見積作成を終了します。',
              [
                  {
                      text: 'はい',
                      onPress: () => {
                          navigationService.clear('InsuranceCompany', {reset: true});
                      },
                  },
                  {text: 'いいえ'},
              ],
              {cancelable: false}
          )}
    />})
@connect(state => ({
    answerList: state.metadata.answers,
    carInfo: state.getCar,
    companyList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
    userProfile: state.registration.userProfile.myProfile,
    optionsList: state.metadata.profileOptions ? state.metadata.profileOptions.purpose_of_use : [],
    accidentsList: state.metadata.profileOptions ? state.metadata.profileOptions.accident_coefficient_applied_term : [],
    colorList: state.metadata.profileOptions ? state.metadata.profileOptions.color_of_driver_license : [],
    yearly_mileage_plans: state.metadata.profileOptions ? state.metadata.profileOptions.yearly_mileage_plan : [],
    nonfleetGradeList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_nonfleet_grade : [],
    provinceList: state.metadata.profileOptions ? state.metadata.profileOptions.driving_area : [],
}))
export class Question117 extends Component {

    componentDidMount() {
        viewPage('insurance_confirm_condition', '任意保険_見積条件確認');
    }

    _renderItemContact({item, index}) {
        return (
            <TouchableOpacity
                onPress={() => item.nextScreen && this.props.navigation.push(item.nextScreen, {willGoBack: true, estimation_type: this.props.userProfile.estimation_type})}
                key={index} style={{
                    height: 75,
                    borderColor: '#E5E5E5',
                    borderWidth: 0.5,
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
            }}>
                <View style={{ width: (width - 30)/3}}>
                    <Text style={{fontSize: 14, color: '#333333', fontWeight: 'bold'}}>
                        {item.label}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: (width - 30)*2/3,
                }}>
                    <Text numberOfLines={1} style={{fontSize: 17, color: '#666666', textAlign: 'right'}}>
                        {item.value}
                    </Text>
                    {
                        item.edit ?
                            <View style={{marginLeft: 15}}>
                                <SvgImage fill={'#CCCCCC'} source={SvgViews.IconEditer}/>
                            </View> : null
                    }
                </View>
            </TouchableOpacity>
        )
    }

    renderListOtherDriver({item, index}) {
        if(item.visible) {
            return (
                <TouchableOpacity key={index} style={{
                    height: 75,
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
                            {item && item.label}
                        </Text>
                        <View style={{
                            flexDirection: item.values ? 'column': 'row',
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
                </TouchableOpacity>
            )
        }

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

    render() {
        const userProfile = this.props.userProfile;
        const answerList = this.props.answerList;
        const carInfo = this.props.carInfo.myCarInformation;
        const optionsList = this.props.optionsList;
        const yearly_mileage_plans = this.props.yearly_mileage_plans;
        const currentCompany = answerList.insurance_company || this.props.userProfile.insurance_company;
        const insurance = this.props.companyList.find((item) => item.value === currentCompany);
        const company = insurance ? insurance.name : '';
        const nonfleetGradeList = this.props.nonfleetGradeList;
        const provinceChoice = this.props.provinceList.find((item) => item.value === userProfile.province);
        userProfile.province_name = provinceChoice ? provinceChoice.label : null;
        let insuranceFleet = null;
        if (answerList.insurance_nonfleet_grade || userProfile.insurance_nonfleet_grade) {
            const fleetChoice = _.filter(nonfleetGradeList, {value: answerList.insurance_nonfleet_grade || userProfile.insurance_nonfleet_grade});
            if (fleetChoice && fleetChoice[0]) {
                insuranceFleet = fleetChoice[0].label;
            }
        }
        let accidentTerm = null;
        let accidentsList = this.props.accidentsList;
        let accidentChoice = null;
        if (answerList.accident_coefficient_applied_term || userProfile.accident_coefficient_applied_term) {
            accidentChoice = _.filter(accidentsList, {value: answerList.accident_coefficient_applied_term || userProfile.accident_coefficient_applied_term});
            if (accidentChoice && accidentChoice[0]) {
                accidentTerm = accidentChoice[0].label;
            }
        }
        let usePurpose = null;
        if (answerList.purpose_of_use || userProfile.purpose_of_use) {
            const purposeChoice = _.filter(optionsList, {value: answerList.purpose_of_use || userProfile.purpose_of_use});
            if (purposeChoice && purposeChoice[0]) {
                usePurpose = purposeChoice[0].label;
            }
        }
        let yearlyMileage = null;
        if (answerList.yearly_mileage_plan || userProfile.yearly_mileage_plan) {
            const mileageChoice = _.filter(yearly_mileage_plans, {value: answerList.yearly_mileage_plan || userProfile.yearly_mileage_plan});
            if (mileageChoice && mileageChoice[0]) {
                yearlyMileage = mileageChoice[0].label;
            }
        }
        let colorDriver = null;
        if (answerList.color_of_driver_license || userProfile.color_of_driver_license) {
            const colorChoice = _.filter(this.props.colorList, {value: answerList.color_of_driver_license || userProfile.color_of_driver_license});
            if (colorChoice && colorChoice[0]) {
                colorDriver = colorChoice[0].label;
            }
        }
        const Answers = {
            listCurrentContract: [
                {
                    label: '保険会社',
                    value: company,
                    edit: true,
                    nextScreen: 'Question89'
                }, {
                    label: '満期日',
                    value: (answerList.insurance_expiration_date || userProfile.insurance_expiration_date) ? moment(answerList.insurance_expiration_date || userProfile.insurance_expiration_date).format('YYYY年 MM月DD日') : '',
                    edit: true,
                    nextScreen: 'Question104'
                }, {
                    label: '等級',
                    value: insuranceFleet,
                    edit: true,
                    nextScreen: 'Question90'
                }, {
                    label: '事故有係数適用期間',
                    value: accidentTerm,
                    edit: true,
                    nextScreen: 'Question93'
                },
            ],
            listVehicleInformation: [
                {
                    label: '車名',
                    value: carInfo.car_name,
                    edit: false
                }, {
                    label: '型式',
                    value: carInfo.form,
                    edit: false
                }, {
                    label: '初度登録',
                    value:  carInfo.first_registration_date ? moment(carInfo.first_registration_date).format('YYYY年 MM月') : '',
                    edit: false
                }, {
                    label: 'ナンバー',
                    value: carInfo.number,
                    edit: false
                }, {
                    label: 'AEB装置',
                    value: carInfo.brakeAssistType ? '装備あり' : '装備なし',
                    edit: false
                }
            ],
            listContractor : [
                {
                    label: '氏名',
                    value: userProfile.last_name + ' ' + userProfile.first_name,
                    edit: false
                }, {
                    label: '性別',
                    value: userProfile.gender === 'm'? '男性': '女性',
                    edit: false
                }, {
                    label: '生年月日',
                    value: userProfile.birthday ? moment(userProfile.birthday).format('YYYY年 MM月DD日') : '',
                    edit: false
                }, {
                    label: '電話番号',
                    value: userProfile.phone,
                    edit: false
                }, {
                    label: 'メールアドレス',
                    value: userProfile.email,
                    edit: false
                }, {
                    label: '住所',
                    value: (userProfile.province_name || '') + ' ' + (userProfile.address || '') + ' ' + (userProfile.apartment_number || '') + ' ' + (userProfile.mansion_room_number || ''),
                    edit: false
                }, {
                    label: '住所（カナ）',
                    value: (userProfile.province_katakana || '') + ' ' + (userProfile.address_katakana || '') + ' ' + (userProfile.apartment_number_katakana || '') + ' ' + (userProfile.mansion_room_number_katakana || ''),
                    edit: false
                }
            ],
            listUseCars : [
                {
                    label: '使用目的',
                    value: usePurpose,
                    edit: true,
                    nextScreen: 'Question94'
                }, {
                    label: '記名被保険者',
                    value: '契約者と同じ',
                    edit: false
                }, {
                    label: '氏名',
                    value: '契約者と同じ',
                    edit: false
                }, {
                    label: '居住地',
                    value: '契約者と同じ',
                    edit: false
                }, {
                    label: '年間走行距離区分',
                    value: yearlyMileage,
                    edit: true,
                    nextScreen: 'Question23'
                }, {
                    label: '現契約の記名被保険者との関係',
                    value: '同じ',
                    edit: false
                }, {
                    label: '性別',
                    value: '契約者と同じ',
                    edit: false
                }, {
                    label: '生年月日',
                    value: '契約者と同じ',
                    edit: false
                }, {
                    label: '免許証の色',
                    value: colorDriver,
                    edit: true,
                    nextScreen: 'InsuranceColor'
                }
            ],
            listOtherDriver : [
                {
                    visible: answerList.spouse_birthday,
                    label: '配偶者',
                    age: answerList.spouse_birthday ? this.getAge(answerList.spouse_birthday) + '歳': '',
                    values: false
                },
                {
                    visible: answerList.first_child_driver_gender,
                    label: '子供',
                    gender: answerList.first_child_driver_gender ? (answerList.first_child_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.first_child_driver_birthday ? this.getAge(answerList.first_child_driver_birthday) + '歳': '',
                    living: answerList.first_child_driver_living ? (answerList.first_child_driver_living === 1 ? '同居': '別居') :'',
                    marital: answerList.first_child_driver_marital_status ? (answerList.first_child_driver_marital_status === 1 ? '既婚' : '未婚'): '',
                    livinghood: answerList.first_child_driver_livinghood ? (answerList.first_child_driver_livinghood === 1 ? '共にする' : '別にする'): '',
                    values: true
                },
                {
                    visible: answerList.second_child_driver_gender,
                    label: '子供',
                    gender: answerList.second_child_driver_gender ? (answerList.second_child_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.second_child_driver_birthday ? this.getAge(answerList.second_child_driver_birthday) + '歳': '',
                    living: answerList.second_child_driver_living ? (answerList.second_child_driver_living === 1 ? '同居': '別居') :'',
                    marital: answerList.second_child_driver_marital_status ? (answerList.second_child_driver_marital_status === 1 ? '既婚' : '未婚'): '',
                    livinghood: answerList.second_child_driver_livinghood ? (answerList.second_child_driver_livinghood === 1 ? '共にする' : '別にする'): '',
                    values: true
                },
                {
                    visible: answerList.third_child_driver_gender,
                    label: '子供',
                    gender: answerList.third_child_driver_gender ? (answerList.third_child_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.third_child_driver_birthday ? this.getAge(answerList.third_child_driver_birthday) + '歳': '',
                    living: answerList.third_child_driver_living ? (answerList.third_child_driver_living === 1 ? '同居': '別居') :'',
                    marital: answerList.third_child_driver_marital_status ? (answerList.third_child_driver_marital_status === 1 ? '既婚' : '未婚'): '',
                    livinghood: answerList.third_child_driver_livinghood ? (answerList.third_child_driver_livinghood === 1 ? '共にする' : '別にする'): '',
                    values: true
                },
                {
                    visible: answerList.fourth_child_driver_gender,
                    label: '子供',
                    gender: answerList.fourth_child_driver_gender ? (answerList.fourth_child_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.fourth_child_driver_birthday ? this.getAge(answerList.fourth_child_driver_birthday) + '歳': '',
                    living: answerList.fourth_child_driver_living ? (answerList.fourth_child_driver_living === 1 ? '同居': '別居') :'',
                    marital: answerList.fourth_child_driver_marital_status ? (answerList.fourth_child_driver_marital_status === 1 ? '既婚' : '未婚'): '',
                    livinghood: answerList.fourth_child_driver_livinghood ? (answerList.fourth_child_driver_livinghood === 1 ? '共にする' : '別にする'): '',
                    values: true
                },
                {
                    visible: answerList.first_family_driver_gender,
                    label: '親族',
                    gender: answerList.first_family_driver_gender  ? (answerList.first_family_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.first_family_driver_birthday ? this.getAge(answerList.first_family_driver_birthday) + '歳' : '',
                    type: answerList.first_family_driver_type ? (answerList.first_family_driver_type === 1 ? '兄弟' : (answerList.first_family_driver_type === 2 ? '父母': 'その他' )): '' ,
                    values: true
                },
                {
                    visible: answerList.second_family_driver_gender,
                    label: '親族',
                    gender: answerList.second_family_driver_gender  ? (answerList.second_family_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.second_family_driver_birthday ? this.getAge(answerList.second_family_driver_birthday) + '歳' : '',
                    type: answerList.second_family_driver_type ? (answerList.second_family_driver_type === 1 ? '兄弟' : (answerList.second_family_driver_type === 2 ? '父母': 'その他' )): '' ,
                    values: true
                },
                {
                    visible: answerList.third_family_driver_gender,
                    label: '親族',
                    gender: answerList.third_family_driver_gender  ? (answerList.third_family_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.third_family_driver_birthday ? this.getAge(answerList.third_family_driver_birthday) + '歳' : '',
                    type: answerList.third_family_driver_type ? (answerList.third_family_driver_type === 1 ? '兄弟' : (answerList.third_family_driver_type === 2 ? '父母': 'その他' )): '' ,
                    values: true
                },
                {
                    visible: answerList.fourth_family_driver_gender,
                    label: '親族',
                    gender: answerList.fourth_family_driver_gender  ? (answerList.fourth_family_driver_gender === 1  ? '男性' : '女性'): '',
                    age: answerList.fourth_family_driver_birthday ? this.getAge(answerList.fourth_family_driver_birthday) + '歳' : '',
                    type: answerList.fourth_family_driver_type ? (answerList.fourth_family_driver_type === 1 ? '兄弟' : (answerList.fourth_family_driver_type === 2 ? '父母': 'その他' )): '' ,
                    values: true
                },
                {
                    visible: answerList.youngest_driver_age,
                    label: '友人・知人等',
                    age: answerList.youngest_driver_age ? answerList.youngest_driver_age + '歳': '',
                    values: false
                }

            ]
        };
        return (
            <WrapperQuestion handleNextQuestion={() => this.handleNextQuestion()} textButton={'次へ'}>
                <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: isIphoneX() ? 30 : 0}}>
                    <View style={{paddingHorizontal: 15, paddingVertical: 20}}>
                        <Text style={{
                            fontSize: 16,
                            color: '#333333',
                            fontWeight: 'bold',
                            lineHeight: 20
                        }}>以下見積条件に誤りがないかご確認ください</Text>
                    </View>
                    <View style={{height: 37, backgroundColor: '#F2F8F9', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, paddingHorizontal: 15, fontWeight : 'bold'}}>現契約について</Text>
                    </View>
                    <View>
                        <FlatList
                            data={Answers.listCurrentContract}
                            renderItem={this._renderItemContact.bind(this)}
                        />
                    </View>
                    <View style={{height: 37, backgroundColor: '#F2F8F9', flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, paddingHorizontal: 15, fontWeight : 'bold'}}>車両情報</Text>
                    </View>
                    <View>
                        <FlatList
                            data={Answers.listVehicleInformation}
                            renderItem={this._renderItemContact.bind(this)}
                            onEndReachedThreshold={0.8}
                        />
                    </View>
                    <TouchableOpacity onPress={() => navigationService.navigate('AccountSetting')} style={{height: 37, backgroundColor: '#F2F8F9', flexDirection: 'row', alignItems: 'center', justifyContent : 'space-between', paddingHorizontal: 15}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight : 'bold'}}>あなた（契約者）について</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View>
                        <FlatList
                            data={Answers.listContractor}
                            renderItem={this._renderItemContact.bind(this)}
                            onEndReachedThreshold={0.8}
                        />
                    </View>
                    <View style={{height: 37, backgroundColor: '#F2F8F9', flexDirection: 'row', alignItems: 'center', justifyContent : 'space-between', paddingHorizontal: 15}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight : 'bold'}}>おクルマを主に使用される方について</Text>
                    </View>
                    <View>
                        <FlatList
                            data={Answers.listUseCars}
                            renderItem={this._renderItemContact.bind(this)}
                            onEndReachedThreshold={0.8}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.push('Question118')} style={{height: 37, backgroundColor: '#F2F8F9', flexDirection: 'row', alignItems: 'center', justifyContent : 'space-between', paddingHorizontal: 15}}>
                        <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight : 'bold'}}>その他の運転手</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View>
                        <FlatList
                            data={Answers.listOtherDriver}
                            renderItem={this.renderListOtherDriver.bind(this)}
                            onEndReachedThreshold={0.8}
                        />
                    </View>
                    <View style={{ height: 70}}/>
                </ScrollView>
            </WrapperQuestion>
        )
    }

    handleNextQuestion() {
        const company = this.props.answerList.insurance_company;
        const companyChoice = this.props.companyList.find((item) => item.value === company);
        if (companyChoice && companyChoice.nttif_code == '99') {
            Alert.alert('エラー', '現契約の保険会社が「その他」の場合、詳細見積もりはご利用いただけません');
        } else {
            if (this.props.navigation.getParam('doDetailAgain')) {
                navigationService.navigate('Question92');
            } else {
                navigationService.navigate('Question119');
            }
        }
    }
}
