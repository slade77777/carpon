import React, {Component} from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView
} from "react-native";
import {connect} from 'react-redux';
import moment from "moment";
import _ from "lodash";
import {updateCarProfile} from "../FirstLoginPhase/actions/registration";
import color from "../color";
import Dropdown from "../common/Dropdown";
import {navigationService, carInformationService} from "../services/index";
import ImageLoader from "../../components/ImageLoader";
import Era from "../common/Era"
import {screen} from "../../navigation";
import {getCar} from "./MyCar/actions/getCar";
import LoadingComponent from "../../components/Common/LoadingComponent";
import ButtonCarpon from "../../components/Common/ButtonCarpon";
import HeaderCarpon from "../../components/HeaderCarpon";
import Config from 'react-native-config';
import {getUserProfile} from "../Account/actions/accountAction";
import {viewPage} from "../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

@screen('UpdateCarPending', {header: <HeaderCarpon/>})
@connect(state => ({
        carProfile: state.registration.carProfile.profile,
        carId: state.registration.carProfile.profile ? state.registration.carProfile.profile.id : false,
        grade_list: state.registration.carProfile.profile.grade_list,
        car_name_list: state.registration.carProfile.profile.car_name_list || [],
        grade_code: state.registration.carProfile.profile['grade_code'],
        hoyu_id: state.registration.carProfile.profile.hoyu_id,
        loading: state.registration.carProfile.loading,
    }),
    dispatch => ({
        updateCarProfile: carInfo => dispatch(updateCarProfile(carInfo)),
        getCarInfo: () => dispatch(getCar()),
        getUserProfile: () => dispatch(getUserProfile())
    }))
export  class UpdateCarPending extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedMileage: '未選択',
            selectedColor: '',
            mileages: [],
            colors: [],
            language: '',
            selectedCarName: '',
            selectedGrade: '',
            firstTime: true,
            loading: true,
            check: true,
            grade_list: [],
            salesStart: ''
        }
    }

    handleMissionCode(code, display) {
        return display ? (code === '1' ? ' (オートマ)' : ' (マニュアル)') : '';
    }

    onChangeSalesStart(value, isFirstTime) {
        let newGrades = this.props.grade_list ? this.props.grade_list.map(grade => ({
            ...grade,
            value: `${grade['grade_name']}`
        })) : [];
        const carChoice = this.props.car_name_list.find((item) => item.car_name === this.state.selectedCarName);
        let grade_code = (carChoice && this.props.car_name_list.length > 1) ? newGrades.filter(grade => grade['sales_start'] === value && grade.maker_code === carChoice.maker_code)
            : newGrades.filter(grade => grade['sales_start'] === value);
        this.setState({
            grade_list: grade_code.map(item => {
                return {
                    value: item.hoyu_id,
                    label: item.value + this.handleMissionCode(item.automatic, item.active)
                }
            }),
            selectedGrade: grade_code[0] ? grade_code[0].hoyu_id : (newGrades[0] ? newGrades[0].hoyu_id : null),
            salesStart: value
        }, () => {
            if (isFirstTime && this.props.car_name_list[0]) {
                this.handleChangeCarName(this.props.car_name_list[0].car_name)
            }
        });
    }

    handleCheckDefaultGrade(date) {
        let defaultGrade = '';
        const registration_date = moment(this.props.carProfile.registration_date).format('YYYY-MM-DD');
        if (this.props.grade_list) this.props.grade_list.find(grade => {
            let dateCompare = moment(grade.sales_start + '01').format('YYYY-MM-DD');
            if (moment(dateCompare).diff(registration_date, "months") >= 0) {
                defaultGrade = grade.sales_start;
                return true;
            }
            return false
        });
        return defaultGrade || date;
    }

    formatDate(text) {
        if (text.length === 6) {
            const month = parseInt(text.substr(4, 2)) + '月';
            const year = text.substr(0, 4) + '年';
            return year + month;
        }
    }

    getColor() {
        let color_code = this.props.carProfile['color_code'];
        carInformationService.getCarColors().then(colors => {
            let selectedColor = colors.filter(result => result['color_code'] === color_code);
            this.setState({
                colors: colors,
                selectedColor: null,
            })
        });
    }

    getMileages() {
        carInformationService.getCarDistance().then(mileages => {
            let selectedMileage = mileages.filter(result => {
                return result.id === this.props.carProfile.mileage_id
            });
            this.setState({
                mileages: mileages,
                selectedMileage: selectedMileage[0] ? selectedMileage[0].value : '未選択',
            })
        });
    }

    componentDidMount() {
        viewPage('select_car_information_minicar_callback', '車両情報選択_軽自動車コールバック');
        this.props.getCarInfo();
        this.props.getUserProfile();
    }

    handleChangeCarName(value) {
        const carChoice = this.props.car_name_list.find((item) => item.car_name === value);
        if (carChoice) {
            const makerChoice = carChoice.maker_code;
            let newGrades = this.props.grade_list ? this.props.grade_list.map(grade => ({
                ...grade,
                value: `${grade['grade_name']}`
            })) : [];
            let grade_code = newGrades.filter(grade => grade.maker_code === makerChoice);
            const listSalesStart = _.uniqBy(grade_code, 'sales_start');
            const salesStart = grade_code[0] ? grade_code[0].sales_start : this.handleCheckDefaultGrade(listSalesStart[0] ? listSalesStart[listSalesStart.length - 1].sales_start : '');
            this.setState({
                listSalesStart: listSalesStart.map(item => ({
                    value: item.sales_start,
                    label: this.formatDate(item.sales_start) + '〜',
                })),
                selectedCarName: value,
                grade_list: grade_code.map(item => {
                    return {
                        value: item.hoyu_id,
                        label: item.value + this.handleMissionCode(item.automatic, item.active)
                    }
                }),
                selectedGrade: grade_code[0] ? grade_code[0].hoyu_id : (newGrades[0] ? newGrades[0].hoyu_id : ''),
                salesStart: salesStart
            });

        }
    }

    handleLoadCarInfo(props) {
        this.getColor();
        this.getMileages();
        const listSalesStart = _.uniqBy(props.grade_list, 'sales_start');
        let grade_code = props.grade_list.filter(grade => grade['grade_code'] === props.grade_code);
        this.setState({
            listSalesStart: listSalesStart.map(item => ({
                value: item.sales_start,
                label: this.formatDate(item.sales_start) + '〜',
            })),
            selectedCarName : props.car_name_list.length > 0 ? props.car_name_list[0].car_name : '',
            firstTime: false,
            loading: false
        }, () => {
            const salesStart = grade_code[0] ? grade_code[0].sales_start : this.handleCheckDefaultGrade(listSalesStart[0] ? listSalesStart[listSalesStart.length - 1].sales_start : '');
            this.onChangeSalesStart(salesStart, true)
        })
    }

    componentWillReceiveProps(props) {
        if(props.carProfile.id && this.state.firstTime) {
            this.handleLoadCarInfo(props)
        }
    }

    updateCarInformation() {
        const profile = {
            "hoyu_id": this.state.selectedGrade,
            "color_code": this.state.selectedColor,
            "mileage_id": this.state.selectedMileage,
        };
        this.setState({
            loading: true
        });
        this.props.updateCarProfile(profile);
    }

    render() {
        const {selectedCarName, selectedMileage, selectedColor, selectedGrade} = this.state;
        const maker_code = this.props.car_name_list[0] ? this.props.car_name_list[0].maker_code : '';
        const maker_name = this.props.car_name_list[0] ? this.props.car_name_list[0].maker_name : '';
        let mileageCheck = this.state.selectedMileage === '未選択';
        const eraDate = this.props.carProfile.first_registration_date ?
            <Era hiddenDay={true} date={this.props.carProfile.first_registration_date}/> : '';
        return (
            <View style={{flex: 1}}>
                {(this.props.loading || this.state.loading) && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '100%'}}/>}
                <View style={{
                    backgroundColor: '#FFFFFF',
                    justifyContent: 'space-between',
                    flex: 1
                }}>
                    <ScrollView scrollIndicatorInsets={{right: 1}}>
                        <View style={{paddingHorizontal: 15, paddingTop: 25, paddingBottom: 70}}>
                            <View style={{
                                borderWidth: 1,
                                borderColor: '#4B9FA5',
                                flexDirection: 'row',
                                backgroundColor: '#F8F8F8',
                                padding: 15
                            }}>
                                <View style={{flex: 0}}>
                                    <ImageLoader
                                        style={{width: 50, height: 40}}
                                        source={{uri: Config.MAKER_LOGO_URL + maker_code + '.png'}}
                                    />
                                </View>
                                <View style={{justifyContent: 'space-between', paddingLeft: 15}}>
                                    <Text style={{color: '#666666', fontSize: 12,}}>{maker_name}</Text>
                                    <Text style={{
                                        color: '#333333',
                                        fontSize: 18,
                                        fontWeight: 'bold'
                                    }}>{selectedCarName ? (selectedCarName.length > 8 ? selectedCarName.substring(0, 8) + '・・・' : selectedCarName) : 'ー'}</Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    marginVertical: 20,
                                    color: '#333333',
                                    lineHeight: 20
                                }}>空欄がある場合は、マイカーに該当する項目を選択してください。</Text>

                            {
                                this.props.car_name_list.length > 1 ?
                                    <Dropdown
                                        label={'車種'}
                                        data={this.props.car_name_list.map(item => ({
                                            value: item.car_name,
                                            label: item.car_name
                                        }))}
                                        value={this.state.selectedCarName}
                                        onChangeText={(value) => this.handleChangeCarName(value)}
                                    />
                                    : null
                            }
                            <View style={{
                                paddingBottom: this.state.check ? 10 : 0,
                                paddingTop: this.state.check ? 15 : 0
                            }}>
                                <Dropdown
                                    unSelected={this.state.check}
                                    label={'系統色'}
                                    data={this.state.colors}
                                    value={this.state.selectedColor || '選択してください'}
                                    onChangeText={(value) => {
                                        this.setState({selectedColor: value, check: false})
                                    }}
                                />
                            </View>
                            <View style={{paddingBottom: mileageCheck ? 10 : 0, paddingTop: mileageCheck ? 15 : 0}}>
                                <Dropdown
                                    unSelected={mileageCheck}
                                    label={'走行距離'}
                                    data={this.state.mileages}
                                    value={this.state.selectedMileage}
                                    onChangeText={(value) => {
                                        this.setState({selectedMileage: value})
                                    }}
                                />
                            </View>
                            <Dropdown
                                label={'モデル販売開始時期'}
                                data={this.state.listSalesStart}
                                value={this.state.salesStart}
                                onChangeText={this.onChangeSalesStart.bind(this)}
                            />
                            <View style={{
                                height: 60,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                borderBottomWidth: 1,
                                borderBottomColor: '#CCC',
                                marginTop: 15
                            }}>
                                <Text style={{color: '#4B9FA5', fontSize: 14, fontWeight: 'bold', marginBottom: 3}}>
                                    年式（初度検査年月）
                                </Text>
                                <View style={{
                                    paddingVertical: 5,
                                    backgroundColor: '#F8F8F8',
                                    justifyContent: 'center',
                                    marginTop: 5
                                }}>
                                    <Text style={{color: '#999', fontSize: 18, marginTop: 5}}>
                                        {eraDate}
                                    </Text>
                                </View>
                            </View>
                            <View style={{marginTop: 5}}>
                                <Dropdown
                                    label={'グレード'}
                                    data={this.state.grade_list}
                                    value={this.state.selectedGrade}
                                    onChangeText={(value) => {
                                        this.setState({selectedGrade: value})
                                    }}
                                />
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 10}}>
                                <Text style={{alignItems: 'flex-start', fontSize: 12, color: '#666666', marginTop: 3}}>
                                    ※
                                </Text>
                                <Text style={{
                                    fontSize: 13,
                                    color: '#666666',
                                    lineHeight: 18,
                                    marginLeft: 5
                                }}>グレードは後日変更可能です。</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <View>
                                    <Text style={{
                                        alignItems: 'flex-start',
                                        fontSize: 12,
                                        color: '#666666',
                                        marginTop: 3
                                    }}>
                                        ※
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: 5}}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: '#666666',
                                        lineHeight: 18
                                    }}>該当する選択肢がない場合は</Text>
                                    <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('Contact', {type: 'updateCar'})}>
                                        <Text style={{
                                            fontSize: 13,
                                            color: color.active,
                                            lineHeight: 18,
                                            textDecorationLine: 'underline'
                                        }}>こちら</Text>
                                    </TouchableOpacity>
                                    <Text style={{
                                        fontSize: 13,
                                        color: '#666666',
                                        lineHeight: 18
                                    }}>よりお問い</Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: '#666666',
                                        lineHeight: 18
                                    }}>合わせください。</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View>
                        {
                            (selectedMileage !== '未選択' && selectedColor && selectedCarName && selectedGrade) ?
                                <View style={{
                                    backgroundColor: 'rgba(112, 112, 112, 0.5)',
                                    paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace() : 15,
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%'
                                }}>
                                    <ButtonCarpon disabled={false}
                                                  style={{backgroundColor: '#F37B7D'}}
                                                  onPress={() => this.updateCarInformation()}>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                            color: '#FFFFFF'
                                        }}>OK</Text>
                                    </ButtonCarpon>
                                </View>
                                : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}
