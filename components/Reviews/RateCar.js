import React, {Component} from 'react';
import ImageLoader from "../ImageLoader";
import StarRate from "../Common/StarRate";
import {FlatList, Text, View} from "react-native";
import Divider from "../Common/Divider";

export default class RateCar extends Component {

    state = {
        listRate: [
            {
                left: {
                    text: '外装：',
                    number: 'rate_exterior_design'
                },
                right: {
                    text: '乗り心地：',
                    number: 'rate_ride_comfort',
                }
            }, {
                left: {
                    text: '内装：',
                    number: 'rate_interior_design'
                },
                right: {
                    text: '経済性：',
                    number: 'rate_economical'
                }
            }, {
                left: {
                    text: '走行性能：',
                    number: 'rate_ride_performance'
                },
                right: {
                    text: '積載量：',
                    number: 'rate_capacity'
                }
            }, {
                left: {
                    text: '取り回し：',
                    number: 'rate_ride_easy'
                }
            }
        ]
    };

    formatNumber = (number) => {
        return Number.parseFloat(number).toFixed(1);
    };


    renderRate(summary, item) {
        let number = this.formatNumber(summary[item.number]);
        return <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 11}}>{item.text}</Text>
            <StarRate
                starSize={13}
                starCount={number}
            />
            <Text style={{width: 22, textAlign: 'right', fontSize: 13}}>{number}</Text>
        </View>
    }

    renderListRate(summary, {item, index}) {
        return (
            <View style={{flexDirection: 'row'}} key={index}>
                <View style={{width: '50%'}}>
                    {item.left && this.renderRate(summary, {...item.left})}
                </View>
                <View style={{width: '50%'}}>
                    {item.right && this.renderRate(summary, {...item.right})}
                </View>
            </View>
        )
    };

    render() {
        const {total_rate, total_reviewer, imageUrl, ...summary} = this.props.summary;
        const rate_overall = Number.parseFloat(total_rate).toFixed(1);
        return (
            <View style={{padding: 15}}>
                {/*<View style={{height: 200, alignItems: 'center'}}>*/}
                    {/*{*/}
                        {/*imageUrl ?*/}
                            {/*<ImageLoader*/}
                                {/*source={{uri: imageUrl}}*/}
                                {/*style={{width: 247, height: 185}}*/}
                            {/*/> : <View/>*/}
                    {/*}*/}
                            {/*<View style={{width: 247, height: 185, backgroundColor: '#CCCCCC'}}/>*/}
                {/*</View>*/}
                <View style={{borderColor: '#4B9FA5', borderWidth: 2, borderRadius: 2, flex: 0}}>
                    <View style={{padding: 15, alignItems: 'center'}}>
                        {
                            !this.props.showMessage ?
                                <View style={{paddingVertical: 15}}>
                                    <Text style={{textAlign: 'center'}}>( まだレビューがありません )</Text>
                                </View> :
                                null
                        }
                        <View style={{flexDirection: 'row', height: 24, alignItems: 'center'}}>
                            <Text style={{fontSize: 14, fontWeight: 'bold'}}>総合評価:</Text>
                            <View>
                                <StarRate
                                    starSize={20}
                                    starCount={rate_overall}
                                />
                            </View>
                            <Text
                                style={{fontSize: 24, fontWeight: 'bold', marginLeft: 15}}>{rate_overall}</Text>
                        </View>
                        <Text style={{
                            fontSize: 12,
                            color: '#666666',
                            marginBottom: 10,
                            marginTop: 5
                        }}>{`レビュー数：${total_reviewer || 0}件`}</Text>
                        <Divider/>
                        <View>
                            <FlatList
                                extraData={this.props.summary}
                                data={this.state.listRate}
                                renderItem={this.renderListRate.bind(this, summary)}
                                onEndReachedThreshold={0.8}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
