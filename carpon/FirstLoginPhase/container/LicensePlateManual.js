import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {View, Text, Alert, StyleSheet, Keyboard, SafeAreaView} from 'react-native';
import {HeaderOnPress} from '../../../components/index';
import stylesGeneral from '../../../style';
import {connect} from "react-redux";
import Area from "../../../area"
import Dropdown from '../../common/Dropdown';
import {loadCarProfileFromPlate} from "../actions/registration";
import _ from 'lodash';
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {InputText} from "../components/InputText";
import {addTrackerEvent, viewPage} from "../../Tracker";

const A_REGEX = /^[1-9][0-9][0-9ACFHKLMPXYacfhklmpxy]?$/;
const B_REGEX = /^[1-9][0-9]{0,3}$/;

@screen('LicensePlateManual', ({navigation}) => {
    return {header: <HeaderOnPress title='ナンバーを手入力' navigation={navigation}/>}
})
@connect((state) => ({
    carInformation: state.getCar,
    ready: state.registration ? state.registration.loadingFinish : true
}), dispatch => ({
    loadCarProfileFromPlate: plateNumber => dispatch(loadCarProfileFromPlate(plateNumber))
}))

export class LicensePlateManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number1: null,
            number2: null,
            hiragana: Area.hiragana,
            province: Area.province,
            selectedProvince: '東京',
            areas: Area.areas,
            selectedCity: null,
            selectedHiragana: null,
        };
        this.onPressView = _.debounce(this.onPressView, 500, {leading: true, trailing: false});
    }

    componentWillMount() {
        viewPage('input_numberplate', 'ナンバープレート入力');
        let infoPlate = this.props.navigation.getParam('infoPlate');
        if (infoPlate) {
            let selectedProvince = null;
            Object.keys(Area.areas).map(function (key, index) {
                Area.areas[key].map(city => {
                    if (city.value === infoPlate.region.trim()) {
                        selectedProvince = key
                    }
                });
            });
            this.setState({
                number1: infoPlate.number1,
                number2: infoPlate.number2,
                selectedHiragana: infoPlate.hiragana,
                selectedCity: infoPlate.region,
                selectedProvince: selectedProvince
            })
        }
    }

    onPressView() {
        if (this.state.number1 && this.state.number2) {
            return Alert.alert(
                'ご確認ください',
                `「${this.buildPlate()}」` +
                'で車両情報を登録します。',
                [
                    {
                        text: 'このまま登録',
                        style: 'destructive',
                        onPress: () => {
                            this.props.loadCarProfileFromPlate(this.buildPlate());
                            addTrackerEvent('wiz_regist_method', {method: 'number'})
                        },
                    },
                    {text: '入力内容を確認する'},
                ],
                {cancelable: false})
        } else return Alert.alert(
            'メッセージ',
            'すべてのフィールドに入力してください（必須）',
            [
                {text: 'やり直す', style: 'cancel'},
            ],
            {cancelable: false}
        );
    }

    handleOnSelectedProvince(value) {
        this.setState({selectedProvince: value, selectedCity: null});
    };

    handleOnSelectedCity(value) {
        this.setState({selectedCity: value});
        setTimeout(() => {
            this.child1.focus();
        }, 500)
    };

    handleSelectedHiragana = (value) => {
        this.setState({selectedHiragana: value});
        setTimeout(() => {
            this.child2.focus();
        }, 500)
    };

    handleChangeNumber(number, numberName) {
        this.setState({[numberName]: number});
    };

    handleShowNumber(number) {
        const numberLength = number ? number.length : 0;
        const PLATE_REGEX = /^(\d{2})(\d{2})$/;
        const THREE_DIGITS_REGEX = /^(\d)(\d{2})$/;
        let createSpace = ('' + number).replace(/\D/g, '');
        let cleaned = ('' + number).replace(/\D/g, '');
        switch (numberLength) {
            case 0:
                return " ・・・・ ";
            case 1:
                return " ・・・" + number;
            case 2:
                return " ・・ " + number;
            case 3:
                let matchedNumber = createSpace.match(THREE_DIGITS_REGEX);
                if (matchedNumber) {
                    return " ・" + matchedNumber[1] + ' ' + matchedNumber[2];
                } else {
                    return number;
                }
            case 4:
                let match = cleaned.match(PLATE_REGEX);
                if (match) {
                    return match[1] + '-' + match[2];
                }
                return number;
        }
    }

    buildSpace = (value) => {
        switch (value.length) {
            case 1:
                return '   ';
            case 2:
                return '  ';
            case 3:
                return ' ';
            case 4:
                return '';
            default:
                return '';
        }
    };

    buildSpaceNumber1 = (value) => {
        switch (value.length) {
            case 1:
                return '  ';
            case 2:
                return ' ';
            case 3:
                return '';
            default:
                return '';
        }
    };

    buildSpaceNumber2 = (value) => {
        switch (value.length) {
            case 1:
                return '   ';
            case 2:
                return '  ';
            case 3:
                return ' ';
            default:
                return '';
        }
    };

    buildPlate = () => {
        const {selectedProvince, province, areas, selectedCity} = this.state;
        const SelectedProvince = selectedProvince ? selectedProvince : province[0].value;
        const city = areas[SelectedProvince];
        const SelectedCity = selectedCity ? selectedCity : city[0].value;
        const hiragana = this.state.selectedHiragana ? this.state.selectedHiragana : this.state.hiragana[0].value;
        return SelectedCity + this.buildSpace(SelectedCity) + this.state.number1 + this.buildSpaceNumber1(this.state.number1) + hiragana + this.buildSpaceNumber2(this.state.number2) + this.state.number2;
    };

    render() {
        const {selectedProvince, province, areas, selectedCity} = this.state;
        const SelectedProvince = selectedProvince ? selectedProvince : province[0].value;
        const city = areas[SelectedProvince];
        const SelectedCity = selectedCity ? selectedCity : city[0].value;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <View style={Styles.body} onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                    <View>
                        <View style={Styles.group}>
                            <View style={Styles.dropDown}>
                                <Dropdown
                                    baseColor={'#4B9FA5'}
                                    fontSize={18}
                                    label={'都道府県'}
                                    data={this.state.province}
                                    value={SelectedProvince}
                                    onChangeText={(value) => this.handleOnSelectedProvince(value)}
                                />
                            </View>
                            <View style={Styles.dropDown}>
                                <Dropdown
                                    baseColor={'#4B9FA5'}
                                    fontSize={18}
                                    label={'地域名'}
                                    data={city}
                                    value={SelectedCity}
                                    onChangeText={(value) => this.handleOnSelectedCity(value)}
                                />
                            </View>
                            <View style={{width: '30%', paddingBottom: 15, marginTop: 15}}>
                                <InputText
                                    maxLength={3}
                                    title={'分類番号'}
                                    placeholder={'123'}
                                    lineNumber={1}
                                    ref={child => {
                                        this.child1 = child
                                    }}
                                    value={`${this.state.number1 || ''}`}
                                    onChangeText={(number) => this.handleChangeNumber(number, 'number1')}
                                    validateMark={A_REGEX.test(this.state.number1)}
                                    style={{fontSize: 17, color: '#777'}}
                                />
                            </View>
                        </View>

                        <View style={Styles.groupLicensePlates}>
                            <Text style={{
                                fontSize: 19,
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{SelectedCity} {this.state.number1}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                    {this.state.selectedHiragana ? this.state.selectedHiragana : this.state.hiragana[0].value}
                                </Text>
                                <Text style={{fontSize: 41, fontWeight: 'bold', marginLeft: 6}}>
                                    {this.handleShowNumber(this.state.number2)}
                                </Text>
                            </View>
                        </View>
                        <View style={Styles.group}>
                            <View style={Styles.dropDown}>
                                <Dropdown
                                    baseColor={'#4B9FA5'}
                                    fontSize={18}
                                    label={'ひらがな'}
                                    data={this.state.hiragana}
                                    value={this.state.selectedHiragana ? this.state.selectedHiragana : this.state.hiragana[0].value}
                                    onChangeText={(value) => this.handleSelectedHiragana(value)}
                                />
                            </View>
                            <View style={{width: '65%', paddingBottom: 15, marginTop: 15}}>
                                <InputText
                                    lineNumber={1}
                                    validateMark={B_REGEX.test(this.state.number2)}
                                    title={'一連指定番号'}
                                    value={`${this.state.number2 || ''}`}
                                    placeholder={'1234'}
                                    ref={child => {
                                        this.child2 = child
                                    }}
                                    keyboardType={'numeric'}
                                    maxLength={4}
                                    onChangeText={(number) => this.handleChangeNumber(number, 'number2')}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{marginBottom: 15}}>
                        <ButtonCarpon style={{backgroundColor: '#F06A6D', height: 50}}
                                      disabled={!A_REGEX.test(this.state.number1) || !B_REGEX.test(this.state.number2) || !this.props.ready}
                                      onPress={() => this.onPressView()}>
                            <Text style={{
                                fontSize: 14,
                                color: '#FFF',
                                fontWeight: 'bold'
                            }}>OK</Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const Styles = StyleSheet.create({
    value: {
        fontSize: 16
    },
    title: {
        fontSize: 15,
        textAlign: 'center',
    },
    text: {
        fontSize: 21,
        textAlign: 'center',
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15
    },
    groupLicensePlates: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 5,
        borderColor: '#DADADA',
        borderWidth: 1,
        marginHorizontal: 50
    },
    dropDown: {
        width: '30%',
        borderColor: '#4B9FA5',
    },
    header: {
        marginTop: 30,
        textAlign: 'center',
        marginBottom: 10,
    },
    body: {
        height: '100%',
        backgroundColor: stylesGeneral.backgroundColor,
        paddingHorizontal: 20
    },
});
