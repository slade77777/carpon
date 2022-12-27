import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import ButtonText from "../../../../components/ButtonText";
import {SingleColumnLayout} from "../../../layouts";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import {myCarService, navigationService} from "../../../services/index";
import Spinner from 'react-native-loading-spinner-overlay';
import {getUserProfile} from "../../../Account/actions/accountAction";
import {settingTime} from "../actions/inspectionAction";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import {Dropdown} from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import {viewPage} from "../../../Tracker";

const listTime = [{
    label: '10:00〜12:00',
    value: '10:00-12:00',
}, {
    label: '12:00〜14:00',
    value: '12:00-14:00',
}, {
    label: '14:00〜16:00',
    value: '14:00-16:00',
}, {
    label: '16:00〜18:00',
    value: '16:00-18:00',
}, {
    value: 'その他',
}];
const {width, height} = Dimensions.get('window');
@screen('EditInspection', {header: <HeaderOnPress title='車検無料見積り'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
        inspectionTime: state.inspectionReducer ? state.inspectionReducer.times : {}
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
        settingTime: (data) => dispatch(settingTime(data)),
    })
)
export class EditInspection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            distance: '',
            isEditing: false,
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            first_date: props.inspectionTime.first_date,
            first_date_time: props.inspectionTime.first_date_time,
            second_date: props.inspectionTime.second_date,
            second_date_time: props.inspectionTime.second_date_time,
            isChooseFirst: null,
            loading: false,
        };
    }

    componentDidMount() {
        viewPage('edit_car_inspection_reservation_date', '車検予約日時編集');
    }

    showDatePicker = () => this.setState({isDatePickerVisible: true});

    hideDatePicker = () => this.setState({isDatePickerVisible: false});

    _handleDatePicked = (date) => {
        if (this.state.isChooseFirst) {
            this.setState({first_date: date, isDatePickerVisible: false})
        } else {
            this.setState({second_date: date, isDatePickerVisible: false})
        }
    };

    handleUpdate() {
        const data = {
            first_date: this.state.first_date,
            first_date_time: this.state.first_date_time,
            second_date: this.state.second_date,
            second_date_time: this.state.second_date_time,
        };
        this.props.settingTime(data);
        navigationService.goBack();
    }

    render() {
        const store = this.props.navigation.getParam('store');
        let tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+3);
        let nextYear = new Date();
        nextYear.setFullYear(new Date().getFullYear() +1);
        const validate  = this.state.first_date && this.state.first_date_time;
        return (
            <View style={{ flex: 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <ScrollView scrollIndicatorInsets={{right: 1}}  style={styles.body}>
                            <Spinner
                                visible={this.state.loading}
                                textContent={null}
                                textStyle={{color: 'white'}}
                            />
                            <View style={{width: '100%', backgroundColor: 'white'}}>
                                <View>
                                    <Text style={{fontSize: 15, padding: 15, lineHeight: 21, color: '#666666'}}>店舗に来店可能な日時（希望）を選択してください</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}>
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? -1 : 4}}>
                                        <TouchableOpacity activeOpacity={1} style={styles.border} onPress={() => {
                                            this.setState({isChooseFirst: true})
                                            this.showDatePicker();
                                        }}>
                                            <Text style={styles.label1}>第1希望</Text>
                                            <Text style={{
                                                fontSize: 16,
                                                marginTop: 10,
                                                color: this.state.first_date ? '#333333' : '#9D9D9D'
                                            }}>
                                                {this.state.first_date ? moment(this.state.first_date).format('M月D日') : '日付'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? 2 : 10}}>
                                        <Dropdown
                                            renderAccessory={() => <Icon
                                                name="angle-down"
                                                size={18}
                                                color={'#CCCCCC'}
                                                style={{
                                                    paddingTop: 2,
                                                    paddingBottom: 8,
                                                    paddingLeft: 4,
                                                    paddingRight: 12
                                                }}
                                            />}
                                            label={''}
                                            baseColor={color.active}
                                            labelHeight={18}
                                            fontSize={16}
                                            labelFontSize={0}
                                            data={listTime}
                                            itemColor={'#CCCCCC'}
                                            textColor={'#333333'}
                                            value={this.state.first_date_time || ''}
                                            placeholder={'時間'}
                                            onChangeText={(value) => {
                                                this.setState({first_date_time: value});
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 10}}>
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? -1 : 4}}>
                                        <TouchableOpacity style={styles.border} onPress={() => {
                                            this.setState({isChooseFirst: false});
                                            this.showDatePicker();
                                        }}>
                                            <Text style={styles.label1}>第2希望</Text>
                                            <Text style={{
                                                fontSize: 16,
                                                marginTop: 10,
                                                color: this.state.second_date ? '#333333' : '#9D9D9D'
                                            }}>
                                                {this.state.second_date ? moment(this.state.second_date).format('M月D日') : '日付'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? 2 : 10}}>
                                        <Dropdown
                                            renderAccessory={() => <Icon
                                                name="angle-down"
                                                size={18}
                                                color={'#CCCCCC'}
                                                style={{
                                                    paddingTop: 2,
                                                    paddingBottom: 8,
                                                    paddingLeft: 4,
                                                    paddingRight: 12
                                                }}
                                            />}
                                            label={''}
                                            baseColor={color.active}
                                            labelHeight={18}
                                            fontSize={16}
                                            labelFontSize={0}
                                            data={listTime}
                                            itemColor={'#CCCCCC'}
                                            textColor={'#333333'}
                                            value={this.state.second_date_time || ''}
                                            placeholder={'時間'}
                                            onChangeText={(value) => {
                                                this.setState({second_date_time: value});
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{margin: 15, marginTop:0, borderWidth: 1, borderColor: color.active, width: width - 30,
                                    justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14}}>定休日</Text>
                                    <Text style={{ fontSize: 15, color: '#666666', width: '70%', textAlign: 'right'}}>{store.detail.regular_holiday}</Text>
                                </View>
                                <DateTimePicker
                                    isVisible={this.state.isDatePickerVisible}
                                    confirmTextIOS={'設定'}
                                    cancelTextIOS={'キャンセル'}
                                    minimumDate={tomorrow}
                                    maximumDate={nextYear}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this.hideDatePicker}
                                    headerTextIOS={this.state.isChooseFirst ? '第1希望' : '第2希望'}
                                    date={this.state.isChooseFirst ? (this.state.first_date ? new Date(this.state.first_date) : tomorrow) : (this.state.second_date ? new Date(this.state.second_date): tomorrow)}
                                />
                                <View style={{margin: 15}}>
                                    <ButtonCarpon disabled={!validate}
                                                  style={{backgroundColor: '#F37B7D', height: 50}}
                                                  onPress={() => this.handleUpdate()}>
                                        <View>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                color: '#FFFFFF'
                                            }}>送信内容の確認</Text>
                                        </View>
                                    </ButtonCarpon>
                                </View>
                            </View>
                        </ScrollView>
                    }
                    bottomContent={
                        <View/>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center',
        marginBottom: 60
    },
    label1: {
        color: color.active,
        fontSize: 11,
        fontWeight: 'bold',
    },
    border: {borderBottomWidth: 0.25, borderColor: color.active, paddingBottom: 10}
});
