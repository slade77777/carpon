import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import StarRate from "../Common/StarRate";
import {SvgImage, SvgViews} from "../Common/SvgImage";
import {connect} from "react-redux";
import {navigationService} from "../../carpon/services";
import IconStatusCertificateFull from "../../assets/svg/IconStatusCertificateFull";

@connect(state => ({
    myProfile: state.registration.userProfile.myProfile,
    }),
    () => ({})
)
export default class TableInfoCar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [
                ['項目', '点数', '評価基準'],
                ['外装', props.rate.rate_exterior_design, '外観のデザイン及び機能性'],
                ['内装', props.rate.rate_interior_design, '内装のデザイン及び機能性'],
                ['走行性能', props.rate.rate_ride_performance, '走り心地及び操作性'],
                ['取り回し', props.rate.rate_ride_easy, '運転しやすさ'],
                ['経済性', props.rate.rate_economical, '燃費等の維持費'],
                ['荷室', props.rate.rate_capacity, '積める荷物の量'],
                ['乗り心地', props.rate.rate_ride_comfort, '乗り心地'],
            ]
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.rate) {
            this.setState({
                tableData: [
                    ['項目', '点数', '評価基準'],
                    ['外装', newProps.rate.rate_exterior_design, '外観のデザイン及び機能性'],
                    ['内装', newProps.rate.rate_interior_design, '内装のデザイン及び機能性'],
                    ['走行性能', newProps.rate.rate_ride_performance, '走り心地及び操作性'],
                    ['取り回し', newProps.rate.rate_ride_easy, '運転しやすさ'],
                    ['経済性', newProps.rate.rate_economical, '燃費等の維持費'],
                    ['荷室', newProps.rate.rate_capacity, '積める荷物の量'],
                    ['乗り心地', newProps.rate.rate_ride_comfort, '乗り心地'],
                ],
            })
        }
    }


    _renderItem({index, item}) {
        if (index === 0) {
            return (
                <View style={{flexDirection: 'row', backgroundColor: '#EFEFEF', borderRightWidth: 1, borderColor: '#E5E5E5'}}>
                    <View style={Styles.cell1}>
                        <Text style={Styles.textHeader}>{item[0]}</Text>
                    </View>
                    <View style={Styles.cell2}>
                        <Text style={Styles.textHeader}>{item[1]}</Text>
                    </View>
                    <View style={Styles.cell3}>
                        <Text style={Styles.textHeader}>{item[2]}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{flexDirection: 'row', backgroundColor: '#FFFFFF', borderRightWidth: 1, borderColor: '#E5E5E5'}}>
                    <View style={Styles.cell1}>
                        <Text style={Styles.textData}>{item[0]}</Text>
                    </View>
                    <View style={Styles.cell2}>
                        <Text style={parseInt(item[1]) >= 4 ? Styles.numberBigger4 : Styles.numberLess4}>
                            {Number.parseFloat(item[1]).toFixed(1)}
                        </Text>
                    </View>
                    <View style={Styles.cell3}>
                        <Text style={Styles.textData}>{item[2]}</Text>
                    </View>
                </View>
            )
        }
    }

    render() {
        const {profile} = this.props;
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 60,
                    marginTop: 15,
                    borderColor: '#4B9FA5',
                    borderWidth: 1.25,
                    justifyContent : 'center',
                    backgroundColor: '#F8F8F8'
                }}>
                    <Text style={{fontSize: 17, fontWeight: 'bold', color: '#333333'}}>評価: </Text>
                    <View>
                        <StarRate
                            starSize={22}
                            starCount={this.props.rate_overall}
                        />
                    </View>
                    <Text style={{fontSize: 28, marginLeft: 10, marginRight: 10, color: '#333333'}}>{this.props.rate_overall}</Text>
                    {
                        this.props.myProfile.id === profile.id ?
                            <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('Profile')}>
                                <SvgImage source={() => SvgViews.IconStatusCertificateFull({active:profile.certificate})}/>
                            </TouchableOpacity> :
                            <SvgImage source={() => SvgViews.IconStatusCertificateFull({active:profile.certificate})}/>
                    }
                </View>
                <View style={{marginTop : 15}}>
                    <FlatList
                        data={this.state.tableData}
                        renderItem={this._renderItem.bind(this)}
                        onEndReachedThreshold={0.8}
                    />
                    <View style={{borderTopWidth: 1, borderColor: '#E5E5E5'}} />
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    numberLess4: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#333333',

    },
    numberBigger4: {
        fontSize: 11,
        color: '#D99D2A',
        fontWeight: 'bold'
    },
    cell1: {
        borderColor: '#E5E5E5',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        height: 34,
        width: '25%',
        justifyContent: 'center'
    },
    cell2: {
        borderColor: '#E5E5E5',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        height: 34,
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cell3: {
        borderColor: '#E5E5E5',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        height: 34,
        width: '55%',
        justifyContent: 'center'
    },
    border: {
        borderColor: '#E5E5E5',
        borderWidth: 1,
        height: 34
    },
    textHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center'
    },
    textData: {
        fontSize: 11,
        color: '#333333',
        marginLeft: 10
    }
});