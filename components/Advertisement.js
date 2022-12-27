import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Dimensions} from "react-native";
import {SvgImage, SvgViews} from '../components/Common/SvgImage';
import {navigationService} from "../carpon/services";
import {connect} from "react-redux";
import {images} from "../assets/index";
import CarPrice from "../carpon/Home/MyCar/components/CarPrice";
import color from "../carpon/color";
import moment from 'moment';

@connect(state => ({
        carPrice: state.getCar ? state.getCar.carPriceEstimation : null,
        carSell: state.getCar ? state.getCar.carSellEstimation : null,
    })
)
export default class Advertisement extends Component {

    render() {
        const {width} = Dimensions.get('window');
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => navigationService.navigate('Sale')} style={{backgroundColor: 'white', paddingHorizontal: 15, paddingTop: 25, paddingBottom: 20}}>
                <View style={{
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 20,
                    flexDirection: 'row',
                    width: width - 30
                }}>
                    <View style={{justifyContent: 'space-between', flexDirection: 'column', width: width - 65}}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                            <View style={styles.titleLeft}>
                                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333333'}}>マイカー相場</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={{fontSize: 16, color: '#333333'}}>{moment().format('YYYY.MM.DD')}</Text>
                                <Text style={{color: '#333', fontSize: 14, marginTop: 1}}> 更新</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                            {this.props.carPrice.kaitori_suggest ?
                                <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 15}}>
                                    <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
                                        <Text style={{fontSize: 13, color: '#333', fontWeight: 'bold'}}>市場価格</Text>
                                        <Text style={{fontSize: 13, color: '#333', fontWeight: 'bold'}}>（推定）</Text>
                                    </View>
                                    <View>
                                        <Text style={{
                                            fontSize: 46,
                                            color: '#008833',
                                            textAlign: 'right'
                                        }}>
                                            <CarPrice
                                                value={this.props.carPrice.kaitori_suggest > 50000 ? this.props.carPrice.kaitori_suggest : 50000}/>
                                            <Text style={{fontSize: 24, fontWeight: 'bold'}}>円</Text>
                                        </Text>
                                        <Text style={styles.contentBelow}>
                                            {this.props.carPrice.kaitori_suggest_low > 50000 ?
                                                <CarPrice value={this.props.carPrice.kaitori_suggest_low}/> : ' - '}
                                             {' '}〜{' '}
                                            {this.props.carPrice.kaitori_suggest_high > 50000 ?
                                                <CarPrice value={this.props.carPrice.kaitori_suggest_high}/> : ' - '}
                                            <Text style={{fontSize: 14}}>円</Text>
                                        </Text>
                                    </View>

                                </View>
                                :
                                <View>
                                    <Text style={{
                                        color: '#666666',
                                        marginBottom: 3,
                                        textAlign: 'right'
                                    }}>データ不足のため</Text>
                                    <Text style={{color: '#666666', textAlign: 'right'}}>算定出来ません</Text>
                                </View>
                            }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <View style={{
                                height: 75,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                marginRight: 5,
                                paddingTop: 5
                            }}>
                                {
                                    (this.props.carSell.this_weeks && this.props.carSell.this_weeks.success) ?
                                        <SvgImage source={SvgViews[this.getWeather()]}/> : <Image
                                            style={{width: 28, height: 7}}
                                            source={images.loadingDot}
                                        />
                                }
                            </View>
                            {
                                (this.props.carSell.this_weeks && this.props.carSell.this_weeks.success) ?
                                    <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <View style={{
                                            borderRightWidth: 1,
                                            borderColor: '#E5E5E5',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            paddingRight: 10
                                        }}>
                                            <Text style={{
                                                color: '#333333',
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontWeight: 'bold',
                                                marginTop: 2
                                            }}>今週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: -5}}>
                                                <Text style={{
                                                    fontSize: 45,
                                                    color: '#F37B7D'
                                                }}>{Math.round(this.props.carSell.this_weeks.data.comment.score)}</Text>
                                                <Text style={{fontSize: 12, marginTop: 31}}> ／ 100</Text>
                                            </View>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <Text style={{
                                                color: '#333333',
                                                textAlign: 'right',
                                                fontSize: 12
                                            }}>先週の売り時指数</Text>
                                            {
                                                (this.props.carSell.last_weeks && this.props.carSell.last_weeks.success) &&
                                                <View style={{flexDirection: 'row', marginLeft: 10, marginTop: -5}}>
                                                    <Text style={{
                                                        fontSize: 45,
                                                        color: '#CCCCCC'
                                                    }}>{Math.round(this.props.carSell.last_weeks.data.comment.score)}</Text>
                                                    <Text style={{
                                                        fontSize: 12,
                                                        marginTop: 31,
                                                        color: '#CCCCCC'
                                                    }}> ／ 100</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    :
                                    <View style={{width: '60%', flexDirection: 'row', paddingTop: 10}}>
                                        <View style={{
                                            width: '50%',
                                            borderRightWidth: 1,
                                            borderColor: '#E5E5E5',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: 10,
                                                fontWeight: 'bold'
                                            }}>今週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginLeft: 10}}>
                                                <View style={{width: 47, height: 47, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                    <Text style={{
                                                        fontSize: 20,
                                                        color: '#666666',
                                                        marginRight: 3
                                                    }}>__</Text>
                                                </View>
                                                <Text style={{fontSize: 12, marginTop: 31}}> / 100</Text>
                                            </View>
                                        </View>
                                        <View style={{width: '50%', alignItems: 'center'}}>
                                            <Text style={{
                                                color: '#999999',
                                                textAlign: 'right',
                                                fontSize: 10
                                            }}>先週の売り時指数</Text>
                                            <View style={{flexDirection: 'row', marginLeft: 10}}>
                                                <View style={{width: 47, height: 47, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                    <Text style={{
                                                        fontSize: 20,
                                                        color: '#CCCCCC',
                                                        marginRight: 3
                                                    }}>__</Text>
                                                </View>
                                                <Text style={{fontSize: 12, marginTop: 31, color: '#CCCCCC'}}> / 100</Text>
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                    <View style={{ width: 35, alignItems: 'flex-end', justifyContent: 'center'}}>
                        <SvgImage fill={color.active} source={SvgViews.ArrowCircle}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    getWeather() {
        const suggest = this.props.carSell.this_weeks.data.comment.score;
        if (suggest < 60) {
            return 'Rain';
        } else if (60 <= suggest && suggest < 70) {
            return 'Cloudy';
        } else if (70 <= suggest && suggest < 80) {
            return 'SunnyCloudy';
        } else if (80 <= suggest) {
            return 'Sun';
        }
    }
}

const styles = StyleSheet.create({
    tableRow: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
    },
    contentBelow: {
        fontSize: 15,
        color: '#333333',
        textAlign: 'right'
    },
    titleLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textLeft: {
        padding: 10,
        fontWeight: 'bold'
    }
});
