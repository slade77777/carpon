import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    Alert
} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen}                          from '../../../../navigation';
import stylesCommon                      from '../../../../style';
import {connect}                         from 'react-redux';
import moment                            from 'moment';
import {myCarService, navigationService} from "../../../services/index";
import Spinner                           from 'react-native-loading-spinner-overlay';
import {getUserProfile}                  from "../../../Account/actions/accountAction";
import color                             from "../../../color";
import {SvgImage, SvgViews}              from "../../../../components/Common/SvgImage";
import ButtonCarpon                      from "../../../../components/Common/ButtonCarpon";
import {addTrackerEvent, viewPage}       from "../../../Tracker";
import { submitAppFlyer }                from "../../../../App";

@screen('ConfirmOil', {header: <HeaderOnPress title='オイル交換予約（確認）'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : {},
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        oilTime: state.oilReducer ? state.oilReducer.times : {},
        oilUser: state.oilReducer ? state.oilReducer.profile : {}
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
    })
)
export class ConfirmOil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        viewPage('submit_oil_exchange_reservation', 'オイル交換予約')
    }

    handleUpdate() {
        this.setState({loading: true});
        const store = this.props.navigation.getParam('store');
        const oilUser = this.props.oilUser;
        const oilTime = this.props.oilTime;
        const user = this.props.userProfile;
        const data = {
            first_date: oilTime.first_date ? moment(oilTime.first_date).format('YYYY-MM-DD') : null,
            first_date_time: oilTime.first_date_time,
            second_date: oilTime.second_date ? moment(oilTime.second_date).format('YYYY-MM-DD') : null,
            second_date_time: oilTime.second_date_time,
            first_name: oilUser.first_name || user.first_name,
            last_name: oilUser.last_name || user.last_name,
            first_name_katakana: oilUser.first_name_katakana || user.first_name_katakana,
            last_name_katakana: oilUser.last_name_katakana || user.last_name_katakana,
            email: oilUser.email || user.email,
            phone: oilUser.phone || user.phone,
            service_type: 2,
            group_id: store.group_id,
            store_id: store.detail.store_id
        };
        myCarService.updateOilStore(data).then((response) => {
            this.setState({loading: false});
            const user = this.props.userProfile;
            if (user && user.id) {
                const id = user.id;
                submitAppFlyer('OIL_RESERVE',
                    {
                        user_id: id,
                        group_id: store.group_id,
                        store_id: store.detail.store_id,
                        phone: oilUser.phone || user.phone,
                    },
                    id
                )
                addTrackerEvent('oilchange_submit', {
                    ...data,
                    first_date: oilTime.first_date ? (new Date(oilTime.first_date).getTime())/1000 : null,
                    second_date: oilTime.second_date ? (new Date(oilTime.second_date).getTime())/1000 : null,
                })
            }
            if (response.status === false) {
                setTimeout(() => {
                    Alert.alert('エラー', response.message[0]);
                }, 100);
            } else {
                this.setState({isEditing: false});
                this.props.getUserProfile();
                setTimeout(() => {
                    Alert.alert(
                        '申し込み完了',
                        'ありがとうございます。店舗よりメールまたは電話でご連絡がありますのでご対応ください。',
                        [
                            {
                                text: 'OK',
                                style: 'cancel',
                                onPress: () => navigationService.clear('MainTab')
                            },
                        ],
                        {cancelable: false}
                    );
                }, 100);
            }
        }).catch(() => {
            this.setState({isEditing: false, loading: false})
        })
    }

    render() {
        const user = this.props.userProfile;
        const oilUser = this.props.oilUser;
        const car = this.props.carInfo;
        const store = this.props.navigation.getParam('store');
        return (
            <View style={{flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}} style={styles.body}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={null}
                        textStyle={{color: 'white'}}
                    />
                    <Text style={{fontSize: 17, color: '#333333', margin: 15, marginTop: 25}}>
                        以下情報を店舗に送信し、オイル交換予約を申し込みます。
                    </Text>
                    <View style={styles.g2}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>マイカー情報</Text>
                    </View>
                    <View style={{
                        ...styles.row,
                        borderTopWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.title}>メーカー</Text>
                        <Text style={styles.value}>{car.maker_name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>車名</Text>
                        <Text style={styles.value}>{car.car_name}</Text>
                    </View>
                    <TouchableOpacity style={{...styles.g2, flexDirection: 'row', justifyContent: 'space-between'}}
                                      onPress={() => navigationService.navigate('UpdateOilUser')} activeOpacity={1}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>お客様情報</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View style={{
                        ...styles.row,
                        borderTopWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.title}>お名前</Text>
                        <Text
                            style={styles.value}>{(oilUser.last_name || user.last_name) + ' ' + (oilUser.first_name || user.first_name)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>お名前（フリガナ）</Text>
                        <Text
                            style={styles.value}>{(oilUser.last_name_katakana || user.last_name_katakana) + ' ' + (oilUser.first_name_katakana || user.first_name_katakana)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>電話番号</Text>
                        <Text style={styles.value}>{(oilUser.phone || user.phone)}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={{width: '40%'}}>
                            <Text style={styles.title}>メールアドレス</Text>
                        </View>
                        <View style={{width: '60%'}}>
                            <Text numberOfLines={1} style={styles.value}>{(oilUser.email || user.email)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{...styles.g2, flexDirection: 'row', justifyContent: 'space-between'}}
                                      onPress={() => navigationService.navigate('EditOilUser', {store})}
                                      activeOpacity={1}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>来店可能日時</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View style={{
                        ...styles.row,
                        borderTopWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.title}>第1希望</Text>
                        <Text
                            style={styles.value}>{moment(this.props.oilTime.first_date).format('M月D日') + ' ' + this.props.oilTime.first_date_time.replace('-', '〜')}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>第2希望</Text>
                        <Text
                            style={styles.value}>{(this.props.oilTime.second_date ? moment(this.props.oilTime.second_date).format('M月D日') : '') + ' ' + (this.props.oilTime.second_date_time ? this.props.oilTime.second_date_time.replace('-', '〜') : '')}</Text>
                    </View>
                    <View style={{margin: 15}}>
                        <ButtonCarpon disabled={false}
                                      style={{backgroundColor: '#F37B7D', height: 50}}
                                      onPress={() => this.handleUpdate()}>
                            <View>
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#FFFFFF'
                                }}>送信する</Text>
                            </View>
                        </ButtonCarpon>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        textAlign: 'center'
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#F2F8F9',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
    row: {
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        borderColor: '#E5E5E5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 44,
        alignItems: 'center'
    },
    title: {color: '#333333', fontWeight: 'bold', fontSize: 16},
    value: {
        fontSize: 17,
        color: '#333333',
        textAlign: 'right'
    }
});
