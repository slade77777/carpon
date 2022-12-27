import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, TouchableOpacity, FlatList, SafeAreaView, ScrollView, ActivityIndicator} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import stylesCommon from '../../../../style';
import {connect} from 'react-redux';
import color from "../../../color";
import {confirmRecall, unconfirmRecall} from "../../MyCar/actions/myCarAction";
import {navigationService} from "../../../services/index";
import ButtonRecall from "../components/ButtonRecall";
import {viewPage} from "../../../Tracker";

const {width, height} = Dimensions.get('window');

@screen('Recall', {header: <HeaderOnPress title='リコール情報'/>})
@connect(state => ({
    carInfo: state.getCar ? state.getCar : null
}), (dispatch) => ({
    confirmRecall: (data) => dispatch(confirmRecall(data)),
    unconfirmRecall: (data) => dispatch(unconfirmRecall(data)),
}))
export class Recall extends Component {

    componentDidMount() {
        viewPage('recall', 'リコール情報');
    }

    renderItem = ({item, index}) => (
        <ButtonRecall item={item} key={index}/>
    );

    render() {
        const {recall, myCarInformation} = this.props.carInfo;
        return (
            <View style={{ flex: 1, width, height}}>
                <View style={styles.body}>
                    <TouchableOpacity onPress={() => !myCarInformation.platform_number && navigationService.navigate('UpdateCar')}
                                      style={{ height: 44, justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: '#333333', borderBottomWidth: 2, borderColor: color.active}}>
                        <Text style={{ color: '#F37B7D', fontSize: 14, fontWeight: 'bold'}}>
                            マイカーの車台番号：{myCarInformation.platform_number || '登録してください'}
                        </Text>
                    </TouchableOpacity>
                    {
                        recall.length === 0 ?
                            <View style={{height: height - 100, alignItems: 'center', justifyContent:'center'}}>
                                <Text style={{ textAlign: 'center', fontSize: 20}}>リコール情報はありません</Text>
                            </View>
                            :
                            <View style={{marginBottom: 30}}>
                                <FlatList
                                    contentInset={{bottom:75}}
                                    data={recall}
                                    renderItem={this.renderItem}
                                    onEndReachedThreshold={0.8}
                                />
                                <View style={{height:75}}>

                                </View>
                            </View>

                    }
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
        height: 45,
        justifyContent: 'center',
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
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        backgroundColor: '#F8F8F8'
    },
    width70: {
        width: '60%',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 12,
        paddingLeft: 10
    },
    value: {
        paddingLeft: 10
    }
});
