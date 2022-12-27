import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from "react-native";
import {screen} from '../../../../navigation';
import {HeaderOnPress} from "../../../../components";
import color from "../../../color";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {connect} from 'react-redux';
import _ from "lodash";
import {navigationService} from "../../../services/index";
import Color from "../../../color";
import {viewPage} from "../../../Tracker";

@screen('GradeSelection', {header: <HeaderOnPress title='グレード選択'/>})
@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    }),
    () => ({})
)
export class GradeSelection extends Component {

    formatDate(text) {
        if (text.length === 6) {
            const month = parseInt(text.substr(4, 2)) + '月';
            const year = text.substr(0, 4) + '年';
            return year + month;
        }
    }

    componentWillMount() {
        let grade_code = this.props.carInfo.grade_list.filter(grade => grade.maker_code === this.props.carInfo.maker_code);
        const listSalesStart = _.uniqBy(grade_code, 'sales_start');
        this.setState({
            listSalesStart: listSalesStart.map(item => ({
                value: item.sales_start,
                label: this.formatDate(item.sales_start),
            })),
        });
        viewPage('select_sales_start', 'グレード変更_販売開始時期選択');
    }

    render() {
        return (
            <View>
                <View style={{backgroundColor: '#fff', height: '100%'}}>
                    <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingTop: 30}}>
                        <Text style={{color: '#707070', fontSize: 13}}> ※ グレードが見つからない場合は
                            <Text
                                onPress={() => this.props.navigation.navigate('Contact', {type: 'changeGradeCar'})}
                                style={{
                                    color: Color.active,
                                    textDecorationLine: 'underline'
                                }}>こちら</Text>よりお問い合わせください。</Text>
                    </View>
                    <View style={{
                        marginTop: 15
                    }}>
                        <View style={{
                            paddingLeft: 15,
                            backgroundColor: '#F8F8F8',
                            borderBottomWidth: 1,
                            borderBottomColor: color.active,
                            marginTop: 15,
                            paddingVertical: 15,
                        }}>
                            <Text>発売開始時期</Text>
                        </View>
                    </View>
                    <ScrollView scrollIndicatorInsets={{right: 1}} style={{color: '#FFF'}}>
                        <View style={{height: 15}}/>
                        {
                            this.state.listSalesStart.map((grade, index) =>
                                <TouchableOpacity
                                    key={index}
                                    style={index === this.state.listSalesStart.length - 1 ? styles.lastRow : styles.row}
                                    onPress={() => navigationService.navigate('UpdateGradeName', {grade: grade.value})}
                                >
                                    <View>
                                        <Text style={{fontSize: 16, color: '#666'}}>{grade.label}</Text>
                                    </View>
                                    <View
                                        style={{justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 10}}>
                                        <SvgImage fill={color.active} source={SvgViews.ArrowLeft}/>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>
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
