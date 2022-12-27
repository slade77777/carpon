import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import ImageLoader from "../../../../components/ImageLoader";
import {images} from "../../../../assets";
import Icon from 'react-native-vector-icons/FontAwesome';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import PropertiesRank from "../../../../components/CarLifeScore/PropertiesRank";
import JapaneseText from "../../../../components/JapaneseText";

export default class AboutRank extends Component {

    render() {
        return (
            <ScrollView scrollIndicatorInsets={{right: 1}} style={{backgroundColor: '#FFFFFF', height: '100%'}}>
                <View style={{padding: 15}}>
                    <Text style={{color: '#333333', fontSize: 16, fontWeight: 'bold'}}>
                        質問回答など、ご利用状況に応じたランク設定
                    </Text>
                    <View style={{marginTop: 10}}>
                        <Text style={{fontSize: 14, color: '#333333', lineHeight: 20}}>
                            アプリに入力いただいた情報やアンケートの回答項目に基づく基礎点に加え、カーポンの利用度・コミュニティへの貢献度に応じて独自のアルゴリズムでメンバーランクを決定します。
                        </Text>
                        <Text style={{fontSize: 14, color: '#333333', lineHeight: 20}}>
                            メンバーランクが上がるとカーポン独自のものや、提携企業の特典がご利用いただける様になります。
                        </Text>
                    </View>
                </View>
                <View style={{
                    backgroundColor: '#F8F8F8',
                    justifyContent: 'center',
                    height: 45,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    marginTop: 15,
                    borderBottomColor: '#4B9FA5', borderBottomWidth: 1
                }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#262525',
                            marginLeft: 15
                        }}>ランクアップミッション</Text>
                </View>
                <View style={{padding: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: '#EDA070', fontSize: 16, fontWeight: 'bold'}}>レギュラーランク </Text>
                        <ImageLoader source={images.regular} style={{width: 50, height: 14}}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={{marginTop: 5}}>
                            <Icon name={'long-arrow-right'}/>
                        </View>
                        <View>
                            <Text style={{
                                fontSize: 14,
                                color: '#666666',
                                lineHeight: 20,
                            }}>全メンバーの当初のランクです。レギュラーランク用のリワードが利用できます。</Text>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <Text style={{color: '#666666', fontSize: 14}}>Carponに登録</Text>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <Text style={{color: '#EDA070', fontSize: 16, fontWeight: 'bold'}}>ゴールドランク </Text>
                        <ImageLoader source={images.memberGold} style={{width: 50, height: 14}}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={{marginTop: 5}}>
                            <Icon name={'long-arrow-right'}/>
                        </View>
                        <View>
                            <JapaneseText style={{
                                fontSize: 14,
                                color: '#666666',
                                lineHeight: 20,
                            }} value={'Car Life Scoreが500点以上で、車検証・免許証の登録を完了しているメンバー。ゴールドまでのリワードが利用できるほか、格安オイル交換（無料〜1000円）がご利用いただけます。'}/>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <JapaneseText style={{color: '#666666', fontSize: 14}} value={'Car Life Scoreが500点以上'}/>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <Text style={{color: '#666666', fontSize: 14}}>免許の更新時期・免許番号の登録</Text>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <Text style={{color: '#666666', fontSize: 14}}>車検証の登録</Text>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <Text style={{color: '#9A979A', fontSize: 16, fontWeight: 'bold'}}>プラチナランク </Text>
                        <ImageLoader source={images.platinum} style={{width: 50, height: 14}}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={{marginTop: 5}}>
                            <Icon name={'long-arrow-right'}/>
                        </View>
                        <View>
                            <JapaneseText style={{
                                fontSize: 14,
                                color: '#666666',
                                lineHeight: 20,
                            }} value={'Goldの条件に加えて、Car Life Scoreが700点以上で、車検証・免許証情報の登録が完了し、車検または自動車保険見積もりを利用したことのあるメンバー。プラチナまでのリワードが利用できる他、車両・タイヤの保証に特別価格（無料〜2000円）でご加入いただけます。'}/>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <Text style={{color: '#666666', fontSize: 14}}>GOLDをクリア</Text>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <JapaneseText style={{color: '#666666', fontSize: 14}} value={'Car Life Scoreが700点以上'}/>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <Text style={{color: '#666666', fontSize: 14}}>車検予約か自動車保険の申込み</Text>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <Text style={{color: '#4B9FA5', fontSize: 16, fontWeight: 'bold'}}>ダイアモンドランク </Text>
                        <ImageLoader source={images.diamond} style={{width: 50, height: 14}}/>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <View style={{marginTop: 5}}>
                            <Icon name={'long-arrow-right'}/>
                        </View>
                        <View>
                            <JapaneseText style={{
                                fontSize: 14,
                                color: '#666666',
                                lineHeight: 20,
                            }} value={'プラチナメンバーの条件に加えて、基礎点が90点以上のユーザ。全てのリワードが利用できる他、個別に案内する特別優待がご利用いただけます。'}/>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <JapaneseText style={{color: '#666666', fontSize: 14}} value={'PLATINUMをクリア'}/>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                            <View style={{marginTop: 10}}>
                                <PropertiesRank>
                                    <JapaneseText style={{color: '#666666', fontSize: 14}} value={'Car Life Scoreが900点以上'}/>
                                    <SvgImage source={SvgViews.IconDone}/>
                                </PropertiesRank>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    backgroundColor: '#F8F8F8',
                    justifyContent: 'center',
                    height: 45,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    marginTop: 15,
                    borderBottomColor: '#4B9FA5', borderBottomWidth: 1
                }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#262525',
                            marginLeft: 15
                        }}>その他</Text>
                </View>
                <View style={{padding: 15}}>
                    <Text style={{color: '#333333', fontSize: 16, fontWeight: 'bold'}}>CAR LIFE SCOREを上げるには？</Text>
                    <Text style={{fontSize: 14, color: '#333333', lineHeight: 20, marginTop: 10}}>車両情報やスコアアップ項目の充実度、ニュースコメントやレビューへのいいね数やフォローされている数などのコミュニティへの関与度合いなど複数の項目から算出しています。このアプリを日頃からご利用いただくことで、CAR
                        LIFE SCOREが上がります。</Text>
                    <Text style={{color: '#333333', fontSize: 16, fontWeight: 'bold', marginTop: 15}}>ランクの維持について</Text>
                    <Text style={{
                        fontSize: 14,
                        color: '#333333',
                        lineHeight: 20,
                        marginTop: 10
                    }}>一度ランクに到達すると、以後、基礎点の増減に関わらずそのランクは維持されます。ただし3ヶ月以上ご利用のなかった場合にはランクの維持は解除されますのでご注意ください。</Text>
                </View>
                <View style={{height : 80}}/>
            </ScrollView>
        )
    }
}
