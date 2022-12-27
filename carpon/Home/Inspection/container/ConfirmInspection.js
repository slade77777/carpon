import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Image, ScrollView, Platform, Alert} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect}                         from 'react-redux';
import ButtonText                        from "../../../../components/ButtonText";
import {SingleColumnLayout}              from "../../../layouts";
import moment                            from 'moment';
import {myCarService, navigationService} from "../../../services/index";
import Spinner                           from 'react-native-loading-spinner-overlay';
import {getUserProfile}                  from "../../../Account/actions/accountAction";
import color                             from "../../../color";
import {SvgImage, SvgViews}              from "../../../../components/Common/SvgImage";
import ButtonCarpon                      from "../../../../components/Common/ButtonCarpon";
import {addTrackerEvent, viewPage}       from "../../../Tracker";
import { submitAppFlyer }                from "../../../../App";

@screen('ConfirmInspection', {header: <HeaderOnPress title='来店予約（確認）'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : {},
        userProfile: state.registration.userProfile ? state.registration.userProfile.myProfile : {},
        inspectionTime: state.inspectionReducer ? state.inspectionReducer.times : {},
        inspectionUser: state.inspectionReducer ? state.inspectionReducer.profile : {}
    }),
    dispatch => ({
        getUserProfile: () => dispatch(getUserProfile()),
    })
)
export class ConfirmInspection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        viewPage('submit_car_inspection_reservation_user', '車検予約')
    }

    handleUpdate() {
        this.setState({loading: true});
        const store = this.props.navigation.getParam('store');
        const inspectionUser = this.props.inspectionUser;
        const inspectionTime = this.props.inspectionTime;
        const user = this.props.userProfile;
        const data = {
            first_date: inspectionTime.first_date ? moment(inspectionTime.first_date).format('YYYY-MM-DD') : null,
            first_date_time: inspectionTime.first_date_time,
            second_date: inspectionTime.second_date ? moment(inspectionTime.second_date).format('YYYY-MM-DD') : null,
            second_date_time: inspectionTime.second_date_time,
            first_name: inspectionUser.first_name || user.first_name,
            last_name: inspectionUser.last_name || user.last_name,
            first_name_katakana: inspectionUser.first_name_katakana || user.first_name_katakana,
            last_name_katakana: inspectionUser.last_name_katakana || user.last_name_katakana,
            email: inspectionUser.email || user.email,
            phone: inspectionUser.phone || user.phone,
            service_type: 1,
            group_id: store.group_id,
            store_id: store.detail.store_id
        };
        myCarService.updateOilStore(data).then((response) => {
            this.setState({loading: false});
            const user = this.props.userProfile;
            if (user && user.id) {
                const id = user.id;
                submitAppFlyer('INSPECTION_RESERVE',
                    {
                        user_id: id,
                        group_id: store.group_id,
                        store_id: store.detail.store_id,
                        phone: inspectionUser.phone || user.phone,
                    },
                    id
                )
                addTrackerEvent('inspection_submit', {
                    ...data,
                    first_date: inspectionTime.first_date ? (new Date(inspectionTime.first_date).getTime())/1000 : null,
                    second_date: inspectionTime.second_date ? (new Date(inspectionTime.second_date).getTime())/1000 : null,
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
                        '送信完了',
                        'ご予約ありがとうございます。店舗よりメールまたはお電話にて連絡がありますので、ご対応ください。',
                        [
                            {
                                text: 'OK',
                                style: 'cancel' ,
                                onPress: () => navigationService.clear('MainTab')
                            },
                        ],
                        { cancelable: false }
                    );
                }, 100);
            }
        }).catch(() => {
            this.setState({isEditing: false, loading: false})
        })
    };

    render() {
        const user = this.props.userProfile;
        const inspectionUser = this.props.inspectionUser;
        const car = this.props.carInfo;
        const store = this.props.navigation.getParam('store');
        return (
            <View style={{ flex: 1}}>
                <ScrollView scrollIndicatorInsets={{right: 1}}  style={styles.body}>
                    <Spinner
                        visible={this.state.loading}
                        textContent={null}
                        textStyle={{color: 'white'}}
                    />
                    <Text style={{fontSize: 17, color: '#333333', margin: 15, marginTop: 25}}>
                        以下情報を店舗に送信し、車検無料見積りを申し込みます。
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
                    <TouchableOpacity style={{...styles.g2, flexDirection: 'row', justifyContent : 'space-between'}}
                                      onPress={() => navigationService.navigate('UpdateUserInspection')} activeOpacity={1}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>お客様情報</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View style={{
                        ...styles.row,
                        borderTopWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.title}>お名前</Text>
                        <Text style={styles.value}>{(inspectionUser.last_name || user.last_name) + ' ' + (inspectionUser.first_name || user.first_name)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>お名前（フリガナ）</Text>
                        <Text style={styles.value}>{(inspectionUser.last_name_katakana || user.last_name_katakana) + ' ' + (inspectionUser.first_name_katakana || user.first_name_katakana)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>電話番号</Text>
                        <Text style={styles.value}>{(inspectionUser.phone || user.phone)}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '40%'}}>
                            <Text style={styles.title}>メールアドレス</Text>
                        </View>
                        <View style={{ width: '60%'}}>
                            <Text numberOfLines={1} style={styles.value}>{(inspectionUser.email || user.email)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{...styles.g2, flexDirection: 'row', justifyContent : 'space-between'}}
                                      onPress={() => navigationService.navigate('EditInspection', {store})} activeOpacity={1}>
                        <Text style={{fontWeight: 'bold', fontSize: 15, color: color.active}}>来店可能日時</Text>
                        <SvgImage fill={'#4B9FA5'} source={SvgViews.IconEditer}/>
                    </TouchableOpacity>
                    <View style={{
                        ...styles.row,
                        borderTopWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.title}>第1希望</Text>
                        <Text style={styles.value}>{moment(this.props.inspectionTime.first_date).format('M月D日') + ' ' + this.props.inspectionTime.first_date_time.replace('-', '〜')}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>第2希望</Text>
                        <Text style={styles.value}>{(this.props.inspectionTime.second_date ? moment(this.props.inspectionTime.second_date).format('M月D日') : '') + ' ' + (this.props.inspectionTime.second_date_time ? this.props.inspectionTime.second_date_time.replace('-', '〜') : '')}</Text>
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
        backgroundColor: '#F8F8F8',
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
