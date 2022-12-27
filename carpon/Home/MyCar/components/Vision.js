import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import color from "../../../color";


export default class Vision extends Component{
    state = {
        selectedServices: [
            {title: 'フォグランプ(フロント)', value: 'フォグランプ(フロント)'},
            {title: 'フォグランプ(リヤ)', value: 'フォグランプ(リヤ)'},
            {title: 'オートライトシステム', value: 'オートライトシステム'},
            {title: 'フォグランプ(フロント)', value: 'フォグランプ(フロント)'},
            {title: '電動リモコンドアミラー', value: '電動リモコンドアミラー'},
            {title: '電動格納式ドアミラー', value: '電動格納式ドアミラー'},
            {title: 'UVカットガラス(フロント)', value: 'UVカットガラス(フロント)'},
            {title: 'Vカットガラス(フロント)', value: 'Vカットガラス(フロント)'},
        ]

    };

    handleOnSelected = (event, value) => {
        // this.setState({
        //     selectedServices: event.target.value
        // })
    };

    render(){
        const vision = {
            title1: {title: 'フォグランプ(フロント)', subTitle: null, opacityContent: false,value: 'フォグランプ(フロント)'},
            title2: {title: 'フォグランプ(リヤ)',subTitle: null, opacityContent: true, value: 'フォグランプ(リヤ)'},
            title3: {title: 'オートライトシステム', subTitle: 'パノラミックビューまたはバックカメラ',opacityContent: false,  value: 'オートライトシステム'},
            title4: {title: 'フォグランプ(フロント)', subTitle: null, opacityContent: true, value: 'フォグランプ(フロント)'},
            title5: {title: '電動リモコンドアミラー', subTitle: null, opacityContent: true, value: '電動リモコンドアミラー'},
            title6: {title: '電動格納式ドアミラー', subTitle: null, opacityContent: true, value: '電動格納式ドアミラー'},
            title7: {title: 'UVカットガラス(フロント)', subTitle: null, opacityContent: true, value: 'UVカットガラス(フロント)'},
            title8: {title: 'UVカットガラス(フロント)', subTitle: null, opacityContent: true, value: 'UVカットガラス(フロント)'},
        };

        return(
            <View>
                <View style={styles.g2}>
                    <Text style={{fontWeight: 'bold'}}>装備</Text>
                </View>

                <View
                    style={{
                        padding: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between'}}
                >
                    <Text style={{ color: '#666666', fontSize: 12}}>※
                        メーカーまたはディーラーオプションは、初期状態では
                        OFF に設定されています。装備が確認できた項目はタップし
                        ON にして下さい。
                    </Text>
                </View>
                {
                    Object.keys(vision).map((k, i) => {
                            return (
                                <View
                                    key={i}
                                    style={{
                                        borderTopWidth: 1,
                                        borderColor: '#CED0CE',
                                        padding: 15,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                    <View>
                                        <Text style={{fontSize: 14, fontWeight: 'bold',marginTop: 5, color: `${vision[k].opacityContent ? '#EFEFEF' : 'black'}`}}>
                                            {vision[k].title}
                                        </Text>
                                        <Text style={{fontSize: 12}}>{vision[k].subTitle ? vision[k].subTitle : null}</Text>
                                    </View>
                                    <View>
                                        <RadioForm
                                            radio_props={[(vision[k].value)]}
                                            initial={0}
                                            buttonColor={'#83C0C5'}
                                            labelColor={'black'}
                                            onPress={(event ,value) => this.handleOnSelected(event, value)}
                                            buttonInnerColor={vision[k].opacityContent ? '#EFEFEF' : '#83C0C5'}
                                            selectedButtonColor={vision[k].opacityContent ? '#EFEFEF' : '#83C0C5'}
                                            buttonSize={15}
                                        />
                                    </View>
                                </View>
                            )
                        }
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#F5F5F5',
        flex: 1
    },
    g2: {
        marginVertical: 10,
        paddingVertical: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
});