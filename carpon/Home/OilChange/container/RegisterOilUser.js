import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import {SingleColumnLayout} from "../../../layouts";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import {myCarService, navigationService} from "../../../services/index";
import Spinner from 'react-native-loading-spinner-overlay';
import {getUserProfile} from "../../../Account/actions/accountAction";
import {resetOilProfile, settingOilTime} from "../actions/oilAction";
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
@screen('RegisterOilUser', {header: <HeaderOnPress title='オイル交換予約'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null,
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
        settingOilTime: (data) => dispatch(settingOilTime(data)),
        resetOilProfile: (data) => dispatch(resetOilProfile(data)),
    })
)
export class RegisterOilUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            distance: '',
            isEditing: false,
            isDatePickerVisible: false,
            isTimePickerVisible: false,
            first_date: null,
            first_date_time: null,
            second_date: null,
            second_date_time: null,
            isChooseFirst: null,
            loading: false,
        };
    }

    componentDidMount() {
        viewPage('submit_oil_exchange_reservation_date', 'オイル交換予約日時選択');
        this.props.resetOilProfile();
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
        const store = this.props.navigation.getParam('store');
        const data = {
            first_date: this.state.first_date,
            first_date_time: this.state.first_date_time,
            second_date: this.state.second_date,
            second_date_time: this.state.second_date_time,
        };
        this.props.settingOilTime(data);
        navigationService.navigate('ConfirmOil', {store});
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
                        <ScrollView contentInset={{ bottom: 25 }}
                                    scrollIndicatorInsets={{right: 1}} style={styles.body}>
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
                                    <View style={{width: '45%', marginTop: this.state.first_date ? -3 : (Platform.OS === 'ios' ? 0 : -1)}}>
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
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? 0 : 5}}>
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
                                    <View style={{width: '45%', marginTop: this.state.second_date ? -3 : (Platform.OS === 'ios' ? 0 : -1)}}>
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
                                    <View style={{width: '45%', marginTop: Platform.OS === 'ios' ? 0 : 5}}>
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
                                <View style={{margin: 15, marginTop:0,borderWidth: 1, borderColor: color.active, width: width - 30,
                                    justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F6FAFB'}}>
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16}}>店舗定休日</Text>
                                    <Text style={{ fontSize: 17, color: 'black', width: '70%', textAlign: 'right'}}>{store.detail.regular_holiday}</Text>
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
                                                  opacity={1}
                                                  style={{backgroundColor: !validate ? '#F8F8F8' : '#F37B7D', height: 50}}
                                                  onPress={() => this.handleUpdate()}>
                                        <View>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                color: !validate ? '#E5E5E5' : '#FFFFFF'
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
