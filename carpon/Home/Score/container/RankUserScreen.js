import React, {Component} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {screen} from "../../../../navigation";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";
import ImageLoader from "../../../../components/ImageLoader";
import {images} from "../../../../assets";

@screen('RankUserScreen', {header: null})
export default class RankUserScreen extends Component {

    render() {
        return (
            <View style={{backgroundColor: '#707070', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                <View style={{padding: 15, backgroundColor: '#F8F8F8', borderRadius: 14, width: '80%'}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>ランクアップ</Text>
                    <Text style={{
                        fontSize: 13,
                        color: '#000000',
                        textAlign: 'center',
                        marginTop: 15
                    }}>GOLD特典がご利用いただけます。</Text>
                    <View style={{marginTop: 15, alignItems: 'center'}}>
                        <ImageLoader source={images.rankGold} style={{width: 174, height: 114}}/>
                    </View>
                    <View style={{marginTop: 20}}>
                        <ButtonCarpon onPress={() => this.props.navigation.pop(2)}
                                      style={{backgroundColor: '#F06A6D'}}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FFFFFF'}}>
                                特典を見る
                            </Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </View>
        )
    }
}