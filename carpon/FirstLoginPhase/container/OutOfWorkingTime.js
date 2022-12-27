import React, {Component} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {screen} from "../../../navigation";
import {SingleColumnLayout} from "../../layouts";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import {navigationService} from "../../services/index";
import HeaderCarpon from "../../../components/HeaderCarpon";
import color from "../../color";
import {addTrackerEvent, viewPage} from "../../Tracker";
import {connect} from "react-redux";
import {registerCarOutOfWorkingTimeBy} from "../actions/registration";

@screen('OutOfWorkingTime', {header: <HeaderCarpon title={'車両データベースご利用時間外'}/>})
@connect((state) => ({
        carProfile: state.registration.carProfile.profile,
        state: state
    }),
    dispatch => ({
        registerCarOutOfWorkingTime: plateNumber => dispatch(registerCarOutOfWorkingTimeBy(plateNumber))
    }))
export class OutOfWorkingTime extends Component {

    componentDidMount() {
        viewPage('guide_outside_of_service', '車両データベースご利用時間外');
        addTrackerEvent('wiz_regist_method', {
            method: 'qr'
        })
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#FFFFFF'
            }}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{backgroundColor: 'white', paddingHorizontal: 15}}>
                            <View style={{marginVertical: 25}}>
                                <Text style={{fontSize: 17, lineHeight: 24, color: '#333333'}}>
                                    現在、車両データベースご利用時間外です。ご利用可能時間となりましたら順次登録を開始します。先にユーザー登録を済ませて今しばらくお待ち下さい。
                                </Text>
                                <Text style={{marginTop: 10, lineHeight: 24, color: '#333333', fontSize: 17}}>
                                    お急ぎの場合は、車検証をご用意の上、「車検証で登録」から車検証のQRコードによる車両登録にお進みください。
                                </Text>
                            </View>
                            <View style={{borderColor: color.active, borderWidth: 1, backgroundColor: '#F8F8F8'}}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 15, fontSize: 16}}>
                                    ＜車両データベース稼働時間＞
                                </Text>
                                <Text style={styles.title}>普通車</Text>
                                <Text style={styles.content}>平日・土日祝：9時00分から20時55分</Text>
                                <Text style={styles.title}>軽自動車</Text>
                                <Text style={styles.content}>平日：9時00分から20時30分</Text>
                                <Text style={styles.content}>土日祝：全日休止</Text>
                                <Text style={{margin: 15, fontSize: 13, lineHeight: 17, color: '#6F7579'}}>
                                    ※普通・軽自動車ともに年末年始（12月29日から1月3日まで）はご利用いただけません。
                                </Text>
                            </View>
                                <View style={{padding: 30, paddingBottom: 40}}/>
                        </View>
                    }
                    bottomContent={
                        <View style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row', margin: 15}}>
                            <ButtonCarpon
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    flex: 1,
                                    borderWidth: 2,
                                    borderColor: '#CCCCCC',
                                    height: 50
                                }}
                                onPress={() => navigationService.navigate('PrepareCameraQR')}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#262626',
                                    fontWeight: 'bold'
                                }}>車検証で登録</Text>
                            </ButtonCarpon>
                            <ButtonCarpon
                                style={{backgroundColor: '#F06A6D', flex: 1, marginLeft: 15, height: 50}}
                                onPress={() => this.props.registerCarOutOfWorkingTime(this.props.carProfile.number)}
                            >
                                <Text style={{fontSize: 16, color: '#FFFFFF', fontWeight: 'bold'}}>ユーザー登録に進む</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        color: '#008833',
        fontWeight: 'bold',
        marginTop: 15,
        marginHorizontal: 15
    },
    content: {
        fontSize: 17,
        color: '#008833',
        marginTop: 5,
        marginHorizontal: 15
    }
});
