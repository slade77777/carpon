import React, {Component} from 'react';
import { Text, View, StyleSheet, Platform} from'react-native'

export default class TirePattern extends Component {

    render() {
        const  {selectedTireWidth, selectedOblateness, selectedRadialStructure, selectedSize, loadIndex, selectedSpeedSymbol} = this.props.tireInformation;
        return(
            <View style={{borderWidth: 2, borderColor: '#4B9FA5'}}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: 15,
                }}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <View style={{...styles.box, width: 60}}>
                            <Text style={styles.textInfo}>{selectedTireWidth}</Text>
                        </View>
                        <View style={{...styles.box, width: 60, backgroundColor: '#FFF'}}>
                            <Text style={{fontSize: 10, color: '#333333'}}>タイヤ幅</Text>
                        </View>
                    </View>
                    <Text style={{fontSize: 30, color: '#666666', padding: 3}}> / </Text>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <View style={styles.box}>
                            <Text style={styles.textInfo}>{selectedOblateness}</Text>
                        </View>
                        <View style={{...styles.box, backgroundColor: '#FFF'}}>
                            <Text style={{fontSize: 10, color: '#333333'}}>扁平率</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <View style={styles.box}>
                            <Text style={styles.textInfo}>{selectedRadialStructure}</Text>
                        </View>
                        <View style={{...styles.box, backgroundColor: '#FFF'}}>
                            <Text style={{fontSize: 10, color: '#333333'}}>ラジアル</Text>
                            <Text style={{fontSize: 10, color: '#333333', textAlign: 'center'}}>構造 </Text>
                        </View>
                    </View>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <View style={styles.box}>
                                <Text style={styles.textInfo}>{selectedSize}</Text>
                            </View>
                            <View style={{...styles.box, backgroundColor: '#FFF'}}>
                                <Text style={{fontSize: 10, color: '#333333'}}>インチ</Text>
                                <Text style={{fontSize: 10, color: '#333333'}}>サイズ</Text>
                            </View>
                        </View>
                    {
                        (!selectedRadialStructure || (selectedRadialStructure ==='R')) &&
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <View style={styles.box}>
                                <Text style={styles.textInfo}>{loadIndex}</Text>
                            </View>
                            <View style={{...styles.box, backgroundColor: '#FFF'}}>
                                <Text style={{fontSize: 10, color: '#333333'}}>荷重指数</Text>
                            </View>
                        </View>
                    }
                    {
                        (!selectedRadialStructure || (selectedRadialStructure ==='R')) &&
                        <View style={{flexDirection: 'column', alignItems: 'center' }}>
                            <View style={styles.box}>
                                <Text style={styles.textInfo}>{selectedSpeedSymbol}</Text>
                            </View>
                            <View style={{...styles.box, backgroundColor: '#FFF'}}>
                                <Text style={{fontSize: 10, color: '#333333'}}>速度</Text>
                                <Text style={{fontSize: 10, color: '#333333'}}>記号</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#EFEFEF',
        width: 41,
        height: 41,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: "center",
        margin: 2
    },
    textInfo: {
        fontSize: Platform === 'ios' ? 22 : 20,
        color: '#666666'
    }
});

