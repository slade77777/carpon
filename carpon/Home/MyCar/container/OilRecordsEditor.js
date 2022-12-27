import React, {Component} from 'react';
import {View, Text, Platform, InputAccessoryView, TouchableOpacity} from 'react-native';
import {screen} from "../../../../navigation";
import HeaderOnPress from "../../../../components/HeaderOnPress";
import UpdateInputText from '../../../../components/UpdateInputText';
import Icon from "../../../Account/container/UpdateName";
import {SingleColumnLayout} from "../../../layouts";
import {ButtonText} from "../../../../components";
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {updateOilRecords} from "../actions/myCarAction";
import moment from "moment";
import color from "../../../color";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {navigationService} from "../../../services";


@screen('OilRecordsEditor', {header: <HeaderOnPress title="給油記録の更新"/>})
@connect(state => ({
        myCarInfo: state.getCar ? state.getCar.myCarInformation : null,
    }),
    /*dispatch => ({
        updateOilRecords: (records) => {
            dispatch(updateOilRecords(records));
        }
    })*/)

export class OilRecordsEditor extends Component {

    state = {
        oil_last_change_date: this.props.myCarInfo.oil_last_change_date,
        oil_change_capacity: this.props.myCarInfo.old_mileage_kiro,//add data
        oil_change_fee: this.props.myCarInfo.oil_last_km_with_filter,//add data
        oil_change_distance: this.props.myCarInfo.oil_last_change_km,
        isDateTimePickerVisible: false
    };


    handleUpdateOilRecords = () => {
        navigationService.goBack();
        // let records = Object.assign({}, this.state);
        // this.props.updateOilRecords(records);
    };

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({
            oil_last_change_date: date
        });
        this._hideDateTimePicker();
    };

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <SingleColumnLayout
                backgroundColor='#212121'
                topContent={
                    <View style={{height: '100%', backgroundColor: 'white'}}>
                        {/*<Spinner*/}
                        {/*visible={this.state.loading}*/}
                        {/*textContent={null}*/}
                        {/*textStyle={{color: 'white'}}*/}
                        {/*/>*/}
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <Text style={{
                                    marginBottom: '2%',
                                    fontWeight: 'bold',
                                    color: color.active
                                }}>{this.state.oil_last_change_date && '給油日'}</Text>
                                <View style={{
                                    borderRadius: 5,
                                    backgroundColor: 'white'
                                }}>
                                    <View style={{
                                        borderBottomWidth: 0.5,
                                        borderColor: '#CCCCCC',
                                        width: '90%',
                                        height: 40,
                                        justifyContent: 'center'
                                    }}>
                                        <TouchableOpacity onPress={this._showDateTimePicker}>
                                            {
                                                this.state.oil_last_change_date ?
                                                    <Text style={{
                                                        fontSize: 16,
                                                        paddingLeft: 10,
                                                        color: 'black',
                                                    }}>
                                                        {moment(this.state.oil_last_change_date).format('YYYY年M月D日')}
                                                    </Text>
                                                    :
                                                    <Text style={{
                                                        fontSize: 13,
                                                        paddingLeft: 10,
                                                        marginTop: 0,
                                                        color: '#CCCCCC'
                                                    }}>
                                                        生年月日（19800101）
                                                    </Text>
                                            }

                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePicker
                                        isVisible={this.state.isDateTimePickerVisible}
                                        confirmTextIOS={'設定'}
                                        cancelTextIOS={'キャンセル'}
                                        onConfirm={this._handleDatePicked}
                                        onCancel={this._hideDateTimePicker}
                                        headerTextIOS={'給油日'}
                                        date={new Date(this.state.oil_last_change_date)}
                                    />
                                </View>
                            </View>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='給油量'
                                    value={this.state.oil_change_capacity}
                                    onChangeText={(val) => this.setState({oil_change_capacity: val})}
                                    autoFocus={true}
                                    keyboardType={'numeric'}
                                    // validationIcon={last_name && formatValue.lastName ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    //     : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='給油額'
                                    value={this.state.oil_change_fee}
                                    onChangeText={(val) => this.setState({oil_change_fee: val})}
                                    keyboardType={'numeric'}
                                    // validationIcon={first_name_katakana && formatValue.firstNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    //     : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                            <View style={{paddingHorizontal: 15, marginVertical: 20, width: '50%'}}>
                                <UpdateInputText
                                    inputAccessoryViewID={inputAccessoryViewID}
                                    title='給油時の走行距離'
                                    value={this.state.oil_change_distance}
                                    onChangeText={(val) => this.setState({oil_change_distance: val})}
                                    keyboardType={'numeric'}
                                    // validationIcon={last_name_katakana && formatValue.lastNameKatakana ? <Icon name='check-circle' color='#4B9FA5' size={16}/>
                                    //     : <Icon name='exclamation-circle' color='#F37B7D' size={16}/>}
                                />
                            </View>
                        </View>
                    </View>
                }
                bottomContent={
                    Platform.OS === 'ios' ?
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{backgroundColor: 'rgba(112, 112, 112, 0.5)', padding: 10}}>
                                <ButtonText
                                    // disabled={!this.state.first_name || !this.state.last_name || !this.state.first_name_katakana || !this.state.last_name_katakana}
                                    title={'更新する'} onPress={() => this.handleUpdateOilRecords()}/>
                            </View>
                        </InputAccessoryView>
                        : <View style={{paddingHorizontal: 20, marginBottom: 20}}>
                            <ButtonText
                                // disabled={!this.state.first_name || !this.state.last_name || !this.state.first_name_katakana || !this.state.last_name_katakana}
                                title={'更新する'} onPress={() => this.handleUpdateOilRecords()}/>
                        </View>
                }
            />

        )
    }
}
