import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Alert, FlatList} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import {SvgImage, SvgViews} from '../../../../components/Common/SvgImage';
import {connect} from 'react-redux'
import {removeCar, switchCar} from "../../../FirstLoginPhase/actions/registration";
import {updateCarLookup} from "../actions/myCarAction";
import {navigationService} from "../../../services";
import color from "../../../color";
import Icon from 'react-native-vector-icons/Ionicons';
import {viewPage} from "../../../Tracker";
import {changeScreenNumber} from "../../../common/actions/metadata";

@screen('UpdateCar', ({navigation}) => ({
    header: <HeaderOnPress onPress={() => navigation.dangerouslyGetParent().state.index > 0 ? navigationService.goBack() : navigationService.clear('MainTab')} leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>} title='車検証登録・車両乗り換え'/>}
))
@connect(state=> ({
        carInfo: state.getCar.myCarInformation ? state.getCar.myCarInformation : [],
        myProfile: state.registration.userProfile.myProfile,
}),
    dispatch => ({
        changeScreenNumber: (number) => dispatch(changeScreenNumber(number)),
        switchCarByQR: ()=> dispatch(switchCar()),
        updateCar: () => dispatch(updateCarLookup()),
        removeCar: () => dispatch(removeCar())
    }))
export class UpdateCar extends Component {

    componentDidMount() {
        viewPage('certification' , '車検証登録・車両乗り換え');
    }

    checkEffectiveDate() {
        let diffDays = 0;
        const nextDay = new Date(this.props.carInfo.effective_date);
        const currentDate = new Date();
        const oneDay = 24*60*60*1000;
        if (nextDay > currentDate) {
            diffDays = Math.round(Math.abs((nextDay - currentDate)/(oneDay)));
        } else {
            diffDays = Math.round(Math.abs((currentDate - nextDay)/(oneDay)));
        }
        return diffDays <= this.props.myProfile.required_time;
    }

    handleNavigate() {
        const carInfo = this.props.carInfo;
        if(carInfo.id) {
            navigationService.navigate('PrepareCameraQR', {isAddQR: true})
        }else {
            navigationService.navigate('CarTypeSwitch', {isAddCarByQR: true})
        }
    }

    render() {
        const {carInfo, myProfile} = this.props;
        return (
            <View style={styles.body}>
                <View style={{ height: 40, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}/>
                {
                    !this.props.carInfo.qr_code_1 && <TouchableOpacity style={styles.part} onPress={() => this.handleNavigate()}>
                        <View style={styles.part1}>
                            <SvgImage source={() => SvgViews.IconEdit({fill: color.active, width: 28, height: 28})}/>
                        </View>
                        <View style={styles.part2}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
                                車検証登録
                            </Text>
                        </View>
                        <View style={styles.part3}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                }
                {
                    (!myProfile.count_update_car || myProfile.count_update_car <= myProfile.call_max_time) && carInfo.effective_date && this.checkEffectiveDate() &&
                    <TouchableOpacity style={styles.part} onPress={
                        () => carInfo.id ? Alert.alert(
                            '車検証更新',
                            '車検証更新手続きを開始しました。',
                            [
                                {text: 'OK', onPress: () => {
                                    this.props.updateCar();
                                    navigationService.navigate('MainTab')
                                }},
                            ],
                            {cancelable: false}
                            ) :
                            Alert.alert('車両情報はありません')
                    }>
                        <View style={styles.part1}>
                            <SvgImage source={SvgViews.NewCar}/>
                        </View>
                        <View style={styles.part2}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
                                車検証の更新 ( 車検を受けた )
                            </Text>
                        </View>
                        <View style={styles.part3}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                }
                {
                    carInfo.id &&
                    <TouchableOpacity style={styles.part} onPress={
                        () => Alert.alert(
                            '車検証更新',
                            '乗り換えた車両の車検証を登録してください。',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        this.props.switchCarByQR();
                                        navigationService.navigate('CarTypeSwitch')
                                    }
                                },
                            ],
                            {cancelable: false}
                        )
                    }>
                        <View style={styles.part1}>
                            <SvgImage source={SvgViews.EditCar}/>
                        </View>
                        <View style={styles.part2}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
                                乗り換えたクルマの車検証登録
                            </Text>
                        </View>
                        <View style={styles.part3}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                }
                {
                    carInfo.id &&
                    <TouchableOpacity style={styles.part} onPress={
                        () => carInfo.id ? Alert.alert(
                            '車両未登録モードに変更します',
                            '車両が登録されるまで、一部機能がご利用いただけません。新しい車両の登録は「メニュー→車検証」よりお願いします。',
                            [
                                {text: 'キャンセル', onPress: () => null},
                                {text: 'OK', onPress: () => {

                                    this.props.changeScreenNumber(2);
                                    this.props.removeCar();
                                    navigationService.clear('MainTab', {tabNumber: 2})
                                    }},
                            ],
                            {cancelable: false}
                        ): Alert.alert('車両情報はありません')
                    }>
                        <View style={styles.part1}>
                            <SvgImage source={SvgViews.Hand}/>
                        </View>
                        <View style={styles.part2}>
                            <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>
                                マイカーを手放した
                            </Text>
                            <Text style={{ fontSize: 13, marginTop: 5}}>
                                ※マイカーを所有していない
                            </Text>
                        </View>
                        <View style={styles.part3}>
                            <SvgImage source={SvgViews.ArrowLeft}/>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        height: '100%',
    },
    part: {
        backgroundColor: '#FFFFFF',
        minHeight: 60,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingVertical: 25
    },
    part1: {width: '20%', justifyContent: 'center', paddingLeft: 5},
    part2: {width: '60%', justifyContent: 'center', paddingLeft: 20},
    part3: {justifyContent: 'center', alignItems : 'flex-end', width : '20%', paddingRight : 15}
});
