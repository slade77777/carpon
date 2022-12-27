import React, {Component} from 'react';
import {StyleSheet, Text, View, ListView} from 'react-native';
import {screen} from '../../../navigation';
import {Register} from '../../../components/index';
import stylesGeneral from '../../../style';
import Divider from "../../../components/Common/Divider";

@screen('RegisterCar', {title: 'メーカー・車名から登録'})
export class RegisterCar extends Component {

    state={
        data:[
            {
                'title':'トヨタ ヴェルファイア',
            },
            {
                'title':'トヨタ アルファード',
            },
        ]
    };

    onPressView(data, navigate) {
        return navigate(`${data.navigate ? data.navigate: 'type-picker'}`)
    }

    render() {
        const navigate = this.props.navigation.navigate;
        return (
            <View style={Styles.body}>
                <View style={Styles.g1}>
                    <Text style={{fontWeight: 'bold'}}>複数の候補が見つかりました。</Text>
                    <Text style={{fontWeight: 'bold'}}>正しい車種を選んで下さい。</Text>
                </View>
                <Divider/>
                <ListView
                    style={{backgroundColor: '#FFFFFF'}}
                    data={this.state.data}
                    renderRow={(data) =>
                        <View>
                            <Register data={data} onPressView={this.onPressView.bind(this, data, navigate)}/>
                        </View>
                    }
                />
            </View>
        )
    }
}


const Styles = StyleSheet.create({
    body: {
        backgroundColor: stylesGeneral.backgroundColor,
        height: '100%'
    },
    border: {
        borderColor: '#707070'
    },
    g1: {
        paddingTop: 20,
        paddingBottom: 25,
        marginLeft: 20,
    }
});
