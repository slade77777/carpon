import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';

//data test
const insurance_data = [
    {
        title: '1月'
    },
    {
        title: '2月'
    },
    {
        title: '3月'
    },
    {
        title: '4月'
    },
    {
        title: '5月'
    },
    {
        title: '6月'
    },
    {
        title: '7月'
    },
    {
        title: '8月'
    },
    {
        title: '9月'
    },
    {
        title: '10月'
    },
    {
        title: '11月'
    },
    {
        title: '12月'
    },
];


export default class ChooseOneQuestion extends Component {
    state = {
        dateOfInsurance: null,
        currentIndex: null
    };

    _handleOnSelect = (index, data) => {
        this.setState({currentIndex: index, dateOfInsurance: data})
    };

    render() {
        const padding = 10;
        const width = (Dimensions.get('window').width - 30) / 4 - padding;
        return (
            <View style={{backgroundColor: '#ffffff', height: '100%'}}>
                <Text style={{
                    fontSize: 17,
                    fontWeight: 'bold',
                    marginVertical: 30,
                    marginHorizontal: 20
                }}>次の保険満期は何月ですか？</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        paddingHorizontal: 15,
                    }}
                >
                    {insurance_data.map((data, index) => (
                        <TouchableOpacity activeOpacity={1}
                            key={index}
                            onPress={() => this._handleOnSelect(index + 1, data.title)}
                            style={{
                                backgroundColor: index + 1 === this.state.currentIndex ? '#4B9FA5' : '#efefef',
                                marginTop: 10,
                                width: width,
                                height: width,
                                justifyContent: 'center',
                                alignItems: 'center', borderRadius: 5
                            }}
                        >
                            <Text style={{
                                fontSize: 18,
                                color: index + 1 === this.state.currentIndex ? 'white' : '#333333'
                            }}>{data.title}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        this._handleOnSelect(0, '0')
                    }} style={{
                        width: '100%',
                        alignItems: 'center',
                        backgroundColor: this.state.currentIndex === 0 ? "#4b9fa5" : '#efefef',
                        padding: 15,
                        marginTop: 20
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: this.state.currentIndex === 0 ? 'white' : '#333333'
                        }}>わからない</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    padding: 15,
                    backgroundColor: 'rgba(112,112,112, 0.6)',
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}>
                    <TouchableOpacity activeOpacity={1}
                        disabled={this.state.dateOfInsurance ? null : true}
                        style={{backgroundColor: this.state.dateOfInsurance ? '#F37B7D' : '#efefef', padding: 15, alignItems: 'center', borderRadius: 5}}>
                        <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>次へ</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 70}}/>
            </View>
        )
    }

}
