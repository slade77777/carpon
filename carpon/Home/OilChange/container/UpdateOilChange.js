import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, Keyboard, TouchableOpacity, View, SafeAreaView, Alert} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components/index';
import {connect} from 'react-redux';
import color from '../../../color';
import {SingleColumnLayout} from "../../../layouts";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import {getCar} from '../../MyCar/actions/getCar';
import {navigationService} from "../../../services/index";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {myCarService} from "../../../services/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import {addTrackerEvent, viewPage} from "../../../Tracker";

@screen('UpdateOilChange', {header: <HeaderOnPress title={'オイル交換（更新）'}/>})
@connect(
    state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        updateOilReady: state.getCar.updateOilReady
    }),
    dispatch => ({
        getCar: () => {
            dispatch(getCar())
        }
    })
)
export class UpdateOilChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change_date: props.carInfo.oil_last_change_date || null,
            mileage: props.carInfo.oil_last_change_km ? props.carInfo.oil_last_change_km.toString() : null,
            change_oil_filter: false,
            isDateTimePickerVisible: false,
            loading: false
        };
    }

    componentDidMount() {
        viewPage('submit_oil_exchange', 'オイル交換登録')
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({change_date: date});
        this._hideDateTimePicker();
    };

    handleUpdateOil() {
        this.setState({loading: true});
        const {change_date, mileage, change_oil_filter} = this.state;
        myCarService.updateOil({change_date, mileage, change_oil_filter})
            .then(response => {
                this.props.getCar();
                this.setState({loading: false});
                setTimeout(() => {
                    const carInfo = this.props.carInfo;
                    addTrackerEvent('car_oil_date_change', {
                        car_next_oil_change_date: (new Date(carInfo.oil_need_change_date).getTime())/1000
                    });
                }, 5000);
                Alert.alert(
                    '更新しました',
                    '',
                    [
                        {text: 'OK', onPress: () => {
                            navigationService.goBack();
                        }},
                    ],
                    {cancelable: false});
            }).catch(() => {
            Alert.alert(
                'エラー',
                '更新できませんでした',
                [
                    {text: 'OK', onPress: () => {
                        this.setState({loading: false});
                    }},
                ],
                {cancelable: false});
        });
    }

    render() {
        const inputAccessoryViewID ='inputAccessoryViewID';
        return (
            <View style={{flex : 1}}>
            <SingleColumnLayout
                backgroundColor='white'
                topContent={
                    <View style={{height: '100%', backgroundColor: 'white'}}
                          onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                        {this.state.loading && <LoadingComponent loadingSize={'large'} size={{w: '100%', h: '120%'}}/>}
                        <TouchableOpacity activeOpacity={1} onPress={this._showDateTimePicker}>
                            <View style={{
                                marginTop: 30,
                                marginHorizontal: 15,
                                marginBottom: 0,
                                borderBottomWidth: 0.5,
                                borderColor: '#CCCCCC',
                            }}>
                                <View style={{ height: 14}}>
                                    <Text style={{ color: color.active, fontSize: 11, fontWeight: 'bold'}}>{this.state.change_date && 'オイルを交換した日'}</Text>
                                </View>
                                {
                                    this.state.change_date ?
                                        <Text style={{ marginTop: 5, fontSize: 18, paddingBottom: 5, color: '#666666'}}>{moment(this.state.change_date).format('YYYY年M月D日')}</Text>
                                        :
                                        <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 5}}>
                                            <Text style={{
                                                fontSize: 18,
                                                marginTop: 0,
                                                color: '#CCCCCC',
                                                flex: 1
                                            }}>
                                                オイルの交換日
                                            </Text>
                                            <Icon
                                                name="angle-down"
                                                size={18}
                                                color={'#CCCCCC'}
                                                style={{textAlign: 'right', flex: 1}}
                                            />
                                        </View>
                                }

                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerVisible}
                                    confirmTextIOS={'設定'}
                                    cancelTextIOS={'キャンセル'}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this._hideDateTimePicker}
                                    headerTextIOS={'オイルを交換した日'}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{paddingHorizontal: 15, marginVertical: 20}}>
                            <InputText
                                inputAccessoryViewID={inputAccessoryViewID}
                                title='オイル交換時の走行距離'
                                placeholder='オイル交換時の走行距離'
                                keyboardType={'numeric'}
                                value={this.state.mileage}
                                onChangeText={(val) => this.setState({ mileage: val})}
                                maxLength={11}
                            />
                        </View>
                        <View style={{  flexDirection: 'row', paddingHorizontal: 30, alignItems: 'center', marginTop: 10, width: '100%', justifyContent: 'center'}}>
                            <CheckBox
                                style={{width: 30}}
                                checkBoxColor={color.active}
                                onClick={()=>{
                                    this.setState({
                                        change_oil_filter:!this.state.change_oil_filter
                                    })
                                }}
                                isChecked={this.state.change_oil_filter}
                            />
                            <Text>オイルフィルターも交換済み</Text>
                        </View>
                    </View>
                }
                bottomContent={
                         <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)' ,width: '100%', position:'absolute', bottom: 0, padding:(!this.state.change_date || !this.state.mileage) ? 0 : 15}}>
                            <ButtonText style={{backgroundColor: color.active}} disabled={!this.state.change_date || !this.state.mileage} title={'更新する'} onPress={() => this.handleUpdateOil()}/>
                        </View>
                }
            />
            </View>
        )
    }
}

