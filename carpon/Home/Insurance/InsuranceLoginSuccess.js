import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {StyleSheet, SafeAreaView, ScrollView, View, Text, TouchableOpacity, Alert} from 'react-native';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {navigationService} from "../../services/index";

@screen('InsuranceLoginSuccess', {header: <HeaderOnPress title={'個別見積・お申し込み'}/>})
export class InsuranceLoginSuccess extends Component {


    handleNavigate() {
        navigationService.navigate('InsuranceCompany')
    }

    componentDidMount() {
        Alert.alert(
            'おつかれさまでした',
            'お申込画面を終了します。',
            [{text: 'OK', onPress: () => this.handleNavigate()}]
            )
    }

    render() {
        const company = this.props.navigation.getParam('company');
        return (
            <View style={{backgroundColor : 'white', flex : 1}}>
                <TouchableOpacity activeOpacity={1}
                    // onPress={this.props.navigation.navigate('')}
                >
                    <Text style={{fontSize: 20, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center'}}>
                        各社
                        保険申し込み画面
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const Styles = StyleSheet.create({

    titleBackGround: {
        backgroundColor: '#F2F8F9',
        paddingHorizontal: 15,
    },
    titleQuestion: {
        color: '#4B9FA5',
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 15
    },
});
