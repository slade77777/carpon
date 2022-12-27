import React, {Component} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Alert, Dimensions, SafeAreaView, ScrollView} from "react-native";
import {screen} from '../../../../navigation';
import {HeaderOnPress} from "../../../../components";
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import Color from "../../../color";
import ButtonText from "../../../../components/ButtonText";
import {updateGrade} from "../actions/getCar";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {viewPage} from "../../../Tracker";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

const {width, height} = Dimensions.get('window');

@screen('UpdateGradeName', {header: <HeaderOnPress title='グレード選択'/>})
@connect(
    state => ({
        updateGradeReady: state.getCar.updateGradeReady,
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    }),
    dispatch => ({
        updateGrade: (param) => dispatch(updateGrade(param))
    })
)
export class UpdateGradeName extends Component {

    componentWillMount() {
        let grade = this.props.navigation.getParam('grade');
        let list = this.props.carInfo.grade_list.filter(item => item.sales_start === grade && item.maker_code === this.props.carInfo.maker_code);
        this.setState({
            listSalesStart: list
        });
        viewPage('select_grade', 'グレード変更_グレード選択');
    }

    componentDidMount() {
        console.log(this.state);
    }

    handleSelectGrade(grade) {
        this.setState({
            gradeSelected: grade
        })
    }

    handleUpdateGrade() {
        if (this.state.gradeSelected) {
            Alert.alert(
                'グレード変更完了',
                'グレードが変更されました。',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            this.props.updateGrade(this.state.gradeSelected);
                        }
                    }
                ]
            )
        }
        else {
            Alert.alert('1つの選択肢を選択してください。');
        }
    }

    render() {
        return (
            <View style={{height: '100%'}}>
                <View style={{backgroundColor: '#fff', height: '100%'}}>
                    {!this.props.updateGradeReady &&
                    <LoadingComponent loadingSize={'large'} size={{w: width, h: height}}/>}
                    <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 30}}>
                        <Text style={{color: '#707070', fontSize: 13}}> ※ グレードが見つからない場合は
                            <Text
                                onPress={() => this.props.navigation.navigate('Contact', {type: 'changeGradeCar'})}
                                style={{color: Color.active, textDecorationLine: 'underline'}}>こちら</Text>よりお問い合わせください。</Text>
                    </View>
                    <View style={{
                        paddingLeft: 15,
                        backgroundColor: '#F8F8F8',
                        borderBottomWidth: 1,
                        borderBottomColor: '#4B9FA5',
                        paddingVertical: 15,
                    }}>
                        <Text>グレード</Text>
                    </View>
                    <ScrollView scrollIndicatorInsets={{right: 1}} contentInset={{bottom: 75}} style={{color: '#FFF'}}>
                        <View style={{height: 15}}/>
                        {
                            this.state.listSalesStart.map((grade, index) =>
                                <TouchableOpacity activeOpacity={1}
                                                  key={index}
                                                  style={index === this.state.listSalesStart.length - 1 ? styles.lastRow : styles.row}
                                                  onPress={() => this.handleSelectGrade(grade)}
                                >
                                    <View>
                                        <Text style={{fontSize: 16, color: '#666'}}>{grade.grade_name}</Text>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 10}}>
                                        <SvgImage
                                            source={() => SvgViews.IcV(this.state.gradeSelected === grade ? '#4B9FA5' : '')}/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        bottom: 0,
                        backgroundColor: Color.backgroundPaddingColor,
                        paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15
                    }}>
                        <ButtonText title={'選択する'} onPress={() => this.handleUpdateGrade()}/>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lastRow: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e5e5',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
