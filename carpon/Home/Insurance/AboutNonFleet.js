import React, {Component} from 'react';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {screen} from '../../../navigation';
import {View, Text} from 'react-native';
import {viewPage} from "../../Tracker";

@screen('AboutNonFleet', {header: <HeaderOnPress title={'事故有係数適用期間について'}/>})
export default class AboutNonFleet extends Component {

    componentDidMount() {
        viewPage('about_accident_coefficient_applied_term', '事故有係数適用期間について');
    }

    render() {
        return (
            <View style={{paddingHorizontal: 15, backgroundColor: 'white', height: '100%', paddingTop: 25}}>
                <Text style={{ fontSize: 16, lineHeight: 25, color: '#333333'}}>
                    「事故有」の係数が適用される残りの年数のことです（初めてご契約される場合は「0年」とします）。 新契約の事故有係数適用期間は、3等級ダウン事故1件につき「3年」、1等級ダウン事故1件につき「1年」を加え、1年経過するごとに「前年の事故有係数適用期間」から「1年」を引きます。
                </Text>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{ fontSize: 13, color: '#666666'}}>※</Text>
                    <Text style={{ fontSize: 13, color: '#666666', lineHeight: 20}}>
                        事故有係数適用期間の上限は「6年」、下限は「0年」となります（「0年」の場合は、「無事故」の係数が適用され、「1年」～「6年」の場合は、「事故有」の係数が適用されます）。
                    </Text>
                </View>
            </View>
        );
    }
}
