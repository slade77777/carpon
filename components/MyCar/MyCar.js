import React, {Component} from 'react';
import {View, Text, Platform, Image, Dimensions} from 'react-native';
import {connect} from "react-redux";
import moment from 'moment';
import DateFormat from "../../carpon/Home/MyCar/components/DateFormat";
import {CarField} from "./CarField";
import {getShopType} from "../../carpon/Home/GasStation/container/GasStation";
import {images} from "../../assets/index";

const {width, height} = Dimensions.get('window');
const oneDay = 24 * 60 * 60 * 1000;
const currentDate = new Date();

function getOilChangeSuggestDayLeft(car) {
    let nextDay = getOilChangeSuggestDate(car);
    let diffDays = 0;
    if (nextDay > currentDate.getTime()) {
        diffDays = Math.round(Math.abs((nextDay - currentDate.getTime()) / (oneDay)));
    }
    if (diffDays === 0) {
        return '交換時期'
    } else if (diffDays <= 60 && diffDays > 0) {
        return `${diffDays}日後`;
    } else {
        return null;
    }
}

function getOilChangeSuggestDate(car) {
    const oldKiroDate = car.oil_last_change_date;
    const date = new Date(oldKiroDate);
    let nextDay = new Date();
    if (car.turbo) {
        nextDay = date.setMonth(date.getMonth() + 6);
    } else {
        nextDay = date.setFullYear(date.getFullYear() + 1);
    }
    return nextDay;
}

function getLicenseDayLeft(profile) {
    const nextDay = new Date(profile.license_expiration_date);
    let diffDays = 0;
    if (nextDay > currentDate.getTime()) {
        diffDays = Math.round(Math.abs((nextDay - currentDate.getTime()) / (oneDay)));
    }
    if (diffDays === 0) {
        return '期限切れ'
    } else if (diffDays <= 60 && diffDays > 0) {
        return `${diffDays}日後`;
    } else {
        return null;
    }
}

function getInsuranceDayLeft(profile) {
    const nextDay = new Date(profile.insurance_expiration_date);
    let diffDays = 0;
    if (nextDay > currentDate.getTime()) {
        diffDays = Math.round(Math.abs((nextDay - currentDate.getTime()) / (oneDay)));
    }
    if (diffDays === 0) {
        return '期限切れ'
    } else if (diffDays <= 60 && diffDays > 0) {
        return `${diffDays}日後`;
    } else {
        return null;
    }
}

function getEffectiveDayLeft(date) {
    const nextDay = new Date(date);
    let diffDays = 0;
    if (nextDay > currentDate.getTime()) {
        diffDays = Math.round(Math.abs((nextDay - currentDate.getTime()) / (oneDay)));
    }
    if (diffDays === 0) {
        return '期限切れ'
    } else if (diffDays <= 30 && diffDays > 0) {
        return `${diffDays}日後`;
    } else {
        return null;
    }
}

function getDayLeft(newDate, oldDate) {
    let diffDays = 0;
    if (newDate && oldDate && oldDate.getTime() < newDate.getTime()) {
        diffDays = Math.round(Math.abs((newDate.getTime() - oldDate.getTime()) / (oneDay)));
    }
    return diffDays;
}

export function getAverageMileage(car) {
    let dayDiff = getDayLeft(car.latest_mileage_kiro_date !== 0 ? new Date(car.latest_mileage_kiro_date) : new Date(), new Date(car.first_registration_date));
    return Math.round((car.latest_mileage_kiro || car.mileage_kiro) * 365 / dayDiff);
}

@connect(state => ({
    carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : {},
    myProfile: state.registration.userProfile.myProfile,
    insuranceInfo: state.insurance.insuranceInfo,
    lowestInsuranceCompany: state.insurance.lowestInsuranceCompany,
    carPrice: state.getCar ? state.getCar.carPriceEstimation : null,
    totalUnConfirm: state.getCar ? state.getCar.totalUnConfirm : null,
    stores: state.inspectionReducer.listStore,
    companyList: state.metadata.profileOptions ? state.metadata.profileOptions.insurance_company : [],
}))
export default class MyCar extends Component {

    constructor(props) {
        super(props);
    }

    getLastMonth(format) {
        const lastMonth = new Date(this.props.carInfo.effective_date).getMonth();
        const dayLastMonth = new Date(this.props.carInfo.effective_date).setMonth(lastMonth);
        return format ? moment(dayLastMonth).format('YYYY年MM月DD日') : dayLastMonth
    }

    render() {
        const car = this.props.carInfo;
        const myProfile = this.props.myProfile;
        let tripCompanyCost = this.props.lowestInsuranceCompany;
        let insurance = null;
        if (tripCompanyCost && this.props.companyList) {
            insurance = this.props.companyList.find((item) => item.nttif_code === tripCompanyCost.id);
        }
        const companyName = insurance ? insurance.name : '';
        const IndexPriceMini = this.props.carInfo.IndexPriceMin ? this.props.carInfo.IndexPriceMin : 0;
        const minStore = this.props.stores.length > 0 ? this.props.stores[IndexPriceMini] : {};
        const minStoreDetail = minStore.detail || {};
        const carProfile = {
            myCarComponents: {
                has_car_insurance: {
                    label: (!myProfile.estimation_type || !myProfile.has_car_insurance) ? 'おすすめの任意保険' : myProfile.estimation_type === 'easy' ? '任意保険簡易見積' : '任意保険詳細見積',
                    nextScreen: (this.props.insuranceInfo && this.props.insuranceInfo.length > 0 && !myProfile.need_make_insurance_for_new_car) ? 'InsuranceCompany' : 'RecommendInsurances',
                    params: {headerTitle: (myProfile.estimation_type === 'easy' || myProfile.need_make_insurance_for_new_car) ? '任意保険簡易見積' : '任意保険詳細見積'},
                    warning: !myProfile.has_car_insurance || myProfile.need_make_insurance_for_new_car,
                    leftStyle: {alignItems: 'flex-start', paddingTop: 5},
                    value:
                    <View>
                        {
                            myProfile.has_car_insurance && tripCompanyCost && tripCompanyCost.estimation_cost && !myProfile.need_make_insurance_for_new_car && <View style={{
                                flexDirection: 'row',
                                justifyContent: !myProfile.has_car_insurance ? 'flex-start' : 'flex-end',
                                marginTop: (tripCompanyCost && tripCompanyCost.estimation_cost > 1000 && Platform.OS === 'ios') ? 5 : 0
                            }}>
                                <Text style={{
                                    fontSize: 23,
                                    textAlign: 'right',
                                    color: '#008833'
                                }}>{tripCompanyCost.estimation_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '〜'}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    marginTop: 10,
                                    textAlign: 'right',
                                    color: '#008833'
                                }}>円</Text>
                            </View>
                        }
                    </View>,
                    bonusInformation: <View>
                        {
                            tripCompanyCost && tripCompanyCost.estimation_cost && !myProfile.need_make_insurance_for_new_car &&
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                                <Text style={{ color: '#666666', fontSize: 14, fontWeight: 'bold', lineHeight: 17, textAlign: 'right'}}>{companyName}</Text>
                                <View style={{ width: 40, height: 40, marginLeft: 10, borderWidth: 1, borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={tripCompanyCost.image} style={{ width: 32, height: 32}} />
                                </View>
                            </View>
                        }
                    </View>
                },
                insurance_expiration_date: {
                    label: '任意保険満期',
                    warning: myProfile.insurance_expiration_date ? getInsuranceDayLeft(myProfile) : null,
                    nextScreen: 'Insurance',
                    value: <View>
                        {
                            myProfile.insurance_expiration_date ?
                                <DateFormat date={moment(myProfile.insurance_expiration_date).format('YYYY年MM月DD日')}/>
                                : <Text style={{fontSize: 23, color: '#333333', textAlign: 'right'}}>未登録</Text>
                        }
                        {
                            (myProfile.insurance_expiration_date && getInsuranceDayLeft(myProfile)) ?
                            <Text style={{fontSize: 14, color: '#F37B7D', textAlign: 'right'}}>
                                {getInsuranceDayLeft(myProfile)}
                            </Text> : <View/>
                        }
                    </View>
                },
                latest_mileage_kiro: {
                    label: '年間走行距離目安',
                    nextScreen: 'MileageChange',
                    value:
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 23, color: '#333333', textAlign: 'right'}}>
                                {(car.latest_mileage_kiro || car.mileage_kiro) && getAverageMileage(car).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                <Text style={{
                                    fontSize: 14,
                                    color: '#333333',
                                    textAlign: 'right',
                                    marginTop: 12
                                }}>{(car.latest_mileage_kiro || car.mileage_kiro) ? 'km' : ''}</Text>
                            </Text>
                        </View>
                },
                car_name_code: {
                    label: '車検簡易見積',
                    warning: false,
                    nextScreen: 'CarInspection',
                    leftStyle: {alignItems: 'flex-start', paddingTop: 5},
                    value:
                        <Text style={{fontSize: 23, color: '#008833', textAlign: 'right'}}>
                            {(minStoreDetail.total ? (minStoreDetail.total - minStoreDetail.tax_discount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--')}
                            <Text style={{fontSize: 17, color: '#008833', marginTop: 15}}>〜円</Text>
                        </Text>,
                    bonusInformation: <View>
                        {
                            minStoreDetail && minStoreDetail.name &&
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                                <View>
                                    <Text style={{ color: '#666666', fontSize: 14, fontWeight: 'bold', lineHeight: 17, textAlign: 'right'}}>{minStoreDetail.name}</Text>
                                    <Text style={{fontSize: 13, color: '#333333', marginTop: 5, textAlign: 'right'}}>自宅からの距離: {minStore.distance && Math.round(minStore.distance * 10)/10}km</Text>
                                </View>
                                <View style={{ width: 40, height: 40, marginLeft: 10, borderWidth: 1, borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        minStoreDetail.image_url1 ? <Image style={{width: 38, height: 38}}
                                                                           source={{uri: minStore.end_point + minStoreDetail.image_url1}}
                                        /> : <Image
                                            style={{width: 38, height: 38}}
                                            source={images.noImage}
                                        />
                                    }
                                </View>
                            </View>
                        }
                    </View>
                },
                effective_date: {
                    label: '車検満了日',
                    warning: this.props.carInfo.effective_date ? getEffectiveDayLeft(this.getLastMonth(false)) : null,
                    nextScreen: 'UpdateCar',
                    value:
                        <View>
                            {
                                this.props.carInfo.effective_date ? <DateFormat date={this.getLastMonth(true)}/>
                                    : <Text style={{fontSize: 23, color: '#333333', textAlign: 'right'}}>未登録</Text>
                            }
                            {
                                this.props.carInfo.effective_date && getEffectiveDayLeft(this.getLastMonth(false)) &&
                                <Text style={{fontSize: 14, color: '#F37B7D', textAlign: 'right'}}>
                                    {getEffectiveDayLeft(this.getLastMonth(false))}
                                </Text>
                            }
                        </View>
                },
                oil_last_change_date: {
                    label: 'オイル交換',
                    warning: car.oil_last_change_date ? getOilChangeSuggestDayLeft(car) : null,
                    nextScreen: 'OilChange',
                    value: <View>
                        {
                            car.oil_last_change_date ?
                                <DateFormat date={moment(getOilChangeSuggestDate(car)).format('YYYY年MM月DD日')}/> :
                                <Text style={{fontSize: 23, color: '#333333', textAlign: 'right'}}>未登録</Text>
                        }
                        {
                            car.oil_last_change_date && getOilChangeSuggestDayLeft(car) &&
                            <Text style={{fontSize: 14, color: '#F37B7D', textAlign: 'right'}}>
                                {getOilChangeSuggestDayLeft(car)}
                            </Text>
                        }
                    </View>
                },
                form: {
                    label: 'リコール情報',
                    disabled: !car.platform_number,
                    warning: this.props.totalUnConfirm > 0 || !car.platform_number,
                    nextScreen: 'Recall',
                    value: car.platform_number ? <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                        <Text
                            style={{fontSize: 23, color: '#333333'}}>{this.props.totalUnConfirm > 0 ? this.props.totalUnConfirm : 0}</Text>件
                    </Text> : <View/>
                },
                license_expiration_date: {
                    label: '運転免許証期限',
                    warning: myProfile.license_expiration_date ? getLicenseDayLeft(myProfile) : null,
                    nextScreen: 'License',
                    value: <View>
                        {
                            myProfile.license_expiration_date ?
                                <DateFormat date={moment(myProfile.license_expiration_date).format('YYYY年MM月DD日')}/>
                                : <Text style={{fontSize: 23, color: '#333333', textAlign: 'right'}}>未登録</Text>
                        }
                        {
                            myProfile.license_expiration_date && getLicenseDayLeft(myProfile) &&
                            <Text style={{fontSize: 14, color: '#F37B7D', textAlign: 'right'}}>
                                {getLicenseDayLeft(myProfile)}
                            </Text>
                        }
                    </View>
                },
                tank_capacity: {
                    label: 'タンク容量',
                    value:
                        <Text style={{fontSize: 23, color: '#333'}}>{car.tank_capacity || '-'}
                        <Text style={{fontSize: 14, color: '#333'}}>L</Text></Text>
                },
                tire_size_front: {
                    label: 'タイヤサイズ',
                    nextScreen: 'Tire',
                    value:
                        <View>
                            {
                                (car.tire_front_json && car.tire_rear_json && car.tire_front_json.TireString === car.tire_rear_json.TireString) ?
                                <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                                    両：{car.tire_front_json.TireString || '-'}
                                </Text>
                                    :
                                <View>
                                    {
                                        car.tire_front_json ? <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                                            前：{car.tire_front_json.TireString || '-'}
                                        </Text> : <View/>
                                    }
                                    {
                                        car.tire_rear_json ? <Text style={{fontSize: 14, color: '#333333', textAlign: 'right'}}>
                                            後：{car.tire_rear_json.TireString || '-'}
                                        </Text> : <View/>
                                    }
                                </View>
                            }
                        </View>
                }
            }
        };
        const carInfo = this.props.carInfo;
        const components = carProfile.myCarComponents;
        return (
            <View style={{height: '100%', width}}>
                <View style={{borderTopWidth: 1, borderColor: '#E5E5E5', width}}/>
                {
                    carInfo && Object.keys(components).map(function (key, index) {
                        if (carInfo.hasOwnProperty(key) || myProfile.hasOwnProperty(key)) {
                            return (<CarField fieldInfo={components[key]} key={index} car={carInfo}/>)
                        }
                    })
                }
            </View>
        )
    }
}
