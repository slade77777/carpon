import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, ScrollView, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {screen} from '../../../../navigation';
import {connect} from 'react-redux';
import color from "../../../color";
import Icon from 'react-native-vector-icons/Ionicons';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {viewPage} from "../../../Tracker";

const {width} = Dimensions.get('window');

@screen('WeatherInformation', {header: <HeaderOnPress leftComponent={<Icon name="md-close" size={30} color="#FFFFFF"/>} title='売り時指数について'/>})
@connect(state => ({}),
    dispatch => ({})
)
export class WeatherInformation extends Component {

    componentDidMount() {
        viewPage('guide_selling_occasion', '売り時時期について');
    }

    render() {

        return (
            <View style={styles.body}>
                <ScrollView scrollIndicatorInsets={{right: 1}}  style={{ width: '100%', height: '100%', backgroundColor: 'white'}}>
                    <View style={{ marginTop: 25, marginHorizontal: 15}}>
                        <Text style={{ fontSize: 17, lineHeight: 24, color: '#666666'}}>
                            売り時指数は、マイカーの価値と現在の中古車市場動向から算出された最適売却時期を示す評価点です。大きく以下4つの状態があります。
                        </Text>
                    </View>
                    <View style={{ margin: 15, borderWidth: 1, borderColor: color.active, backgroundColor: '#F8F8F8', paddingBottom: 20}}>
                        <View style={styles.weather}>
                            <View style={styles.row}>
                                <SvgImage fill={color.active} source={SvgViews.Sun}/>
                                <Text style={styles.number}>80</Text>
                                <Text style={styles.point}>点</Text>
                                <Text style={styles.note}>以上（晴れ）</Text>
                            </View>
                            <View style={styles.text}>
                                <Text>
                                    <Text style={styles.blueText}>絶好の売り時</Text>
                                    <Text style={styles.greyText}>です。売却を検討するなら今がチャンス。</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.weather}>
                            <View style={styles.row}>
                                <SvgImage fill={color.active} source={SvgViews.SunnyCloudy}/>
                                <Text style={styles.number}>70</Text>
                                <Text style={styles.point}>点</Text>
                                <Text style={styles.note}>以上（ほぼ晴れ）</Text>
                            </View>
                            <View style={styles.text}>
                                <Text>
                                    <Text style={styles.blueText}>まずまずの売り時。</Text>
                                    <Text style={styles.greyText}>売却の推奨時期に入っています。</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.weather}>
                            <View style={styles.row}>
                                <SvgImage fill={color.active} source={SvgViews.Cloudy}/>
                                <Text style={styles.number}>60</Text>
                                <Text style={styles.point}>点</Text>
                                <Text style={styles.note}>以上（晴れ曇り）</Text>
                            </View>
                            <View style={styles.text}>
                                <Text>
                                    <Text style={styles.blueText}>売り時としてはイマイチ。</Text>
                                    <Text style={styles.greyText}>売却する際はじっくり検討しましょう。</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.weather}>
                            <View style={styles.row}>
                                <SvgImage fill={color.active} source={SvgViews.Rain}/>
                                <Text style={styles.number}>59</Text>
                                <Text style={styles.point}>点</Text>
                                <Text style={styles.note}>以下（曇り）</Text>
                            </View>
                            <View style={styles.text}>
                                <Text>
                                    <Text style={styles.blueText}>売り時に適していません。</Text>
                                    <Text style={styles.greyText}>売却する際は慎重に検討してください。</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#212121',
        height: '100%',
        textAlign: 'center',
    },
    weather: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 20
    },
    row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    number: {
        marginLeft: 10,
        fontSize: 36,
        color: '#262626',
        fontWeight: 'normal'
    },
    point: {
        fontSize: 24,
        color: '#262626',
        fontWeight: 'normal',
        marginTop: 10
    },
    note: {
        fontSize: 15,
        color: '#262626',
        marginTop: 15
    },
    text: {
        width: width - 70,
        marginTop: 20
    },
    blueText: {
        color: color.active,
        fontSize: 17
    },
    greyText: {
        color: '#666666',
        fontSize: 17
    },
});
