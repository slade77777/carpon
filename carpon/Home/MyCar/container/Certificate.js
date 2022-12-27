import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, TouchableOpacity, FlatList} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import moment from 'moment';
import {navigationService} from "../../../../carpon/services";
import {viewPage} from "../../../Tracker";

const {width} = Dimensions.get('window');

@screen('Certificate', {header: <HeaderOnPress title='車検' rightContent={{
    icon: 'IconEdit',
    color: '#FFF',
    nextScreen: 'CertificateMethod',
    inHomeScreen: true
}}/>
})
@connect(state => ({
    carInfo: state.getCar ? state.getCar.myCarInformation : null
}))
export class Certificate extends Component {

    componentDidMount() {
        viewPage('car_inspection', '車検');
    }

    render() {
        const carInfo = this.props.carInfo;
        return (
            <View  style={styles.body}>
                <View style={{flexDirection: 'row', marginTop: 25, borderColor: '#E5E5E5', borderTopWidth: 1}}>
                    <View style={styles.width30}>
                        <Text style={styles.title}>前回車検日</Text>
                    </View>
                    <View style={styles.width70}>
                        <Text style={styles.value}>{moment(carInfo.effective_date).format('YYYY年M月D日')}</Text>
                    </View>
                </View>
                <Text style={{ textAlign: 'center', marginVertical: 10}}>
                    ※車検を実施した場合は車検証情報を更新してください。
                </Text>
                <View style={{ margin: 20, borderWidth: 3, borderColor: color.active }}>
                    <View style={{ padding: 10}}>
                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>次回車検期日：{moment(carInfo.effective_date).format('YYYY年M月D日')}(火)</Text>
                        <Text style={{ marginTop: 10, fontSize: 13, lineHeight: 20}}>{moment(carInfo.time_need_check).format('YYYY年M月D日')}から期日までに車検を受けると有効期間を短縮することなく更新出来ます。</Text>
                    </View>
                </View>
                <View style={styles.g2}>
                    <Text style={{fontWeight: 'bold'}}>車検オファー</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: stylesCommon.backgroundColor,
        height: '100%',
        textAlign: 'center',
    },
    g2: {
        marginTop: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
    button: {
        height: 60,
        backgroundColor: '#CCCCCC',
        borderRadius: 3
    },
    width30: {
        width: '40%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center',
    },
    width70: {
        width: '60%',
        borderColor: '#E5E5E5',
        borderBottomWidth: 1,
        height: 45,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
        paddingLeft: 10
    },
    value: {
        paddingRight: 10,
        textAlign: 'right'
    },
});
