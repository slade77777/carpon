import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {Text, View, ScrollView, SafeAreaView, Dimensions, StyleSheet} from "react-native";
import ButtonCarpon from "../../../components/Common/ButtonCarpon";
import color from "../../color";
import {carInformationService, navigationService} from "../../services/index";
import HeaderCarpon from "../../../components/HeaderCarpon";
import {connect} from "react-redux";
import {clearCarData, skipCar} from "../actions/registration";

@screen('CarModeWrong', {header: <HeaderCarpon title={'車両選択について'}/>})
@connect((state) => ({
        userProfile: state.registration.userProfile,
    }),
    (dispatch) => ({
        skipCar: () => dispatch(skipCar()),
        clearCarData: () => dispatch(clearCarData())
    }))
export class CarModeWrong extends Component {

    componentDidMount() {
        // viewPage('confirm_car_wrong', '自検協/全軽自協呼び出し');
    }

    skipCar() {
        carInformationService.skipCar().then(() => {
            if (this.props.userProfile.confirmed) {
                this.props.clearCarData();
                setTimeout(() => {
                    navigationService.clear('MainTab', {tabNumber: 2})
                }, 1000)
            } else {
                this.props.skipCar();
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{paddingHorizontal: 15, height: '100%', backgroundColor: 'white'}}>
                    <View style={{paddingTop: 20}}>
                        <Text style={styles.text}>
                            選択されたメーカー/モデルと、登録車両の型式・ 年式には一致する車両がありませんでした。メー カー・モデルを再選択しますか?
                        </Text>
                        <ButtonCarpon
                            onPress={()=> navigationService.navigate('ConfirmCarManufacturer')}
                            style={styles.button}>
                            <Text style={styles.buttonText}>選択しなおす</Text>
                        </ButtonCarpon>
                    </View>
                    <View style={{paddingTop: 20}}>
                        <Text style={styles.text}>
                            正しく選択してもこの画面が出る場合は、カー ポンに登録できない車両の可能性があります。 次より車両未登録モードでご利用いただけま す。
                        </Text>
                        <ButtonCarpon
                            onPress={() => this.skipCar()}
                            style={styles.button}>
                            <Text style={styles.buttonText}>車両未登録モードで登録</Text>
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
    },
    button: {
        height: 50,
        backgroundColor: color.red,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    }
});
