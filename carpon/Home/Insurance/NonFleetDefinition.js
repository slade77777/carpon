import React, {Component} from 'react';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {screen} from '../../../navigation';
import {View, Text} from 'react-native';
import {viewPage} from "../../Tracker";

@screen('NonFleetDefinition', {header: <HeaderOnPress title={'ノンフリート等級について'}/>})
export default class NonFleetDefinition extends Component {

    componentDidMount() {
        viewPage('about_non_fleet_grade', 'ノンフリート等級について')
    }

    render() {
        return (
            <View style={{paddingHorizontal: 15, backgroundColor: 'white', height: '100%', paddingTop: 25}}>
                <Text style={{ fontSize: 16, lineHeight: 25, color: '#333333'}}>
                    自動車保険は、前年契約の事故歴や事故内容、保険の使用回数に応じて、ご契約ごとに等級が設定されます。この等級制度は、損害保険会社各社および一部の共済が導入し、共同で運用しています。契約更新の際などに契約する保険会社を変えた場合でも、等級を引き継ぐことができます。
                </Text>
                <Text style={{ fontSize: 16, color: '#333333', lineHeight: 24, marginTop: 15}}>
                    等級には、それぞれ係数が設定されており、保険料の算出に使用されます。事故がないと翌年の等級は1つ上がり、事故で保険を使うと、原則として、翌年は等級が下がります。
                </Text>
            </View>
        );
    }
}
