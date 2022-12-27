import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class LabelRate extends Component {

    render() {
        const {listRate} = this.props;
        return (
            <View style={{flexDirection : 'row', flexWrap : 'wrap', alignItems : 'center'}}>
                <Text style={Styles.text}>
                    {'外装 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_exterior_design}/>
                <Text style={Styles.text}>
                    {'／内装 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_interior_design}/>
                <Text style={Styles.text}>
                    {'／走行性能 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_ride_performance}/>
                <Text style={Styles.text}>
                    {'／乗り心地 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_ride_comfort}/>
                <Text style={Styles.text}>
                    {'／取り回し '}
                </Text>
                <LabelCheckRate rate={listRate.rate_ride_easy}/>
                <Text style={Styles.text}>
                    {'／経済性 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_economical}/>
                <Text style={Styles.text}>
                    {'／積載量 '}
                </Text>
                <LabelCheckRate rate={listRate.rate_capacity}/>
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    text: {
        fontSize : 14,
        color : '#262626'
    },
    numberLess4 : {
        fontSize: 14,
        color: '#262626',
        fontWeight: 'bold'
    },
    numberBigger4 : {
        fontSize: 14,
        color: '#D99D2A',
        fontWeight: 'bold'
    }
});



class LabelCheckRate extends Component {
    render() {
        const {rate} = this.props;
        return (
            <Text style={parseInt(rate) >=4 ? Styles.numberBigger4  : Styles.numberLess4}>
                {Number.parseFloat(rate).toFixed(1)}
            </Text>
        );
    }
}
