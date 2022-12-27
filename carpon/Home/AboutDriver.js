import React, {Component} from 'react';
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from '../../navigation';
import {View, Text} from 'react-native';
import {viewPage} from "../Tracker";

@screen('AboutDriver', {header: <HeaderOnPress title={'運転者について'}/>})
export default class AboutDriver extends Component {

    componentDidMount() {
        viewPage('about_driver', '運転手について');
    }

    render() {
        return (
            <View style={{paddingHorizontal: 15, backgroundColor: 'white', height: '100%', paddingTop: 25}}>
                <Text style={{ fontSize: 16, color: '#333333', fontWeight: 'bold'}}>
                    子供とは
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    1.主な運転者（記名被保険者）またはその配偶者の同居の実子・養子
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    2. 1.の配偶者（記名被保険者またはその配偶者と同居）
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    3.主な運転者（記名被保険者）またはその配偶者の別居の未婚の実子・養子
                </Text>
                <Text style={{ fontSize: 16, color: '#333333', fontWeight: 'bold', marginTop: 25}}>
                    同居の親族とは
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    ご本人・配偶者・子供を除く、同居されているご両親・ご親戚（「6親等内の血族」「3親等内の姻族」）をさします。
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    同居とは、同一の家屋内に住居していればOKです。同一生計や扶養の有無は問いません。
                </Text>
                <Text style={{ fontSize: 16, color: '#333333', fontWeight: 'bold', marginTop: 25}}>
                    友人・知人・親戚とは
                </Text>
                <Text style={{ fontSize: 16, marginTop: 5 , color: '#333333', lineHeight: 20}}>
                    配偶者・子供・同居の親族以外にお車を運転する方をさします。
                </Text>
            </View>
        );
    }
}
