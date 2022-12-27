import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, View, ScrollView, SafeAreaView, Dimensions, StyleSheet, Alert} from "react-native";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import { WebView } from 'react-native-webview';
import WebViewLoading from "../../../components/WebViewLoading";
import color from "../../color";
import {navigationService} from "../../services/index";
import { isIphoneX  } from 'react-native-iphone-x-helper';
import {viewPage} from "../../Tracker";
import HeaderOnPress from "../../../components/HeaderOnPress";
import store from "../../store";

@screen('ConfirmCarWrong', ({navigation}) => {
    return {header: <HeaderOnPress onPress={() => {
        if (navigation.getParam('isCarFound')) {
            navigationService.goBack();
        } else {
            const registrationCount = store.getState().registration.carProfile.profile.count_update_car ? store.getState().registration.carProfile.profile.count_update_car : 1;
            Alert.alert(
                `やり直す（残り：${3 - registrationCount}回）`,
                'ナンバー読み込みによる登録には回数制限があります。（制限後は、車検証QRスキャンによる車両登録のみ利用可）',
                [
                    {
                        text: '車両登録をやり直す',
                        onPress: () => {
                            navigationService.clear('CarType', {registerCarAgain: true})
                        }, style: 'destructive',
                    },
                    {text: 'キャンセル', style: 'cancel'},
                ],
                {cancelable: false}
            );
        }
    }} title={'車両選択について'}/>}
})
export class ConfirmCarWrong extends Component {

    componentDidMount() {
        viewPage('confirm_car_wrong', '自検協/全軽自協呼び出し');
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{paddingHorizontal: 15, height: '100%', justifyContent: 'space-between', backgroundColor: 'white'}}>
                    <View style={{width: '100%', alignItems: 'center', paddingTop: 40, flex: 0}}>
                        <Text style={styles.text}>
                            Carponの自動選択によって表示されている車両 が異なる場合、メーカー・車名のリストから選 んで登録することができます。
                        </Text>
                        <Text style={styles.text}>
                            車両リストを選択した後、カーポンのデータ ベースと、登録情報に記載された型式・年式に 該当する全ての車両がリストアップされますの で、そちらから選択してください。
                        </Text>
                        <Text style={styles.text}>
                            この処理を行なっても、型式・年式が一致する 車両が見つからない場合は登録できない車両と なります。悪しからずご了承ください
                        </Text>
                    </View>
                    <View style={{paddingVertical: 15, paddingBottom: 25}}>
                        <ButtonCarpon
                            onPress={()=> navigationService.navigate('ConfirmCarManufacturer')}
                            style={{
                                height: 50,
                                backgroundColor: color.red,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                fontSize: 16,
                                color: 'white',
                                fontWeight: 'bold'
                            }}>OK</Text>
                        </ButtonCarpon>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginVertical: 20,
        color: '#333333',
        lineHeight: 20
    }
});
