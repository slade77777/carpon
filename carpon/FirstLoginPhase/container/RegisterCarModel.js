import React, {Component} from 'react';
import {View, ListView, Text, StyleSheet} from 'react-native';
import {screen} from '../../../navigation';
import {Register} from '../../../components/index';
import stylesGeneral from '../../../style';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {carInformationService, navigationService} from "../../services/index";

@screen('RegisterCarModel', {header: <HeaderOnPress/>})
export class RegisterCarModel extends Component {

    state = {
        models: []
    };

    componentDidMount() {
        const maker_code = this.props.navigation.getParam('maker_code');
        carInformationService.getCarModel(maker_code).then(response => {
            this.setState({
                models: response.data.map(model => {
                    return {
                        ...model,
                        title: model['car_name']
                    }
                })
            })
        })
    }

    onPressView(data) {
        const maker_code = this.props.navigation.getParam('maker_code');
        const maker_name = this.props.navigation.getParam('maker_name');
        return navigationService.navigate('RegisterCarGrade', {
            name_code: data['name_code'],
            car_name: data['car_name'],
            maker_code,
            maker_name
        });
    }

    render() {
        const maker_name = this.props.navigation.getParam('maker_name');
        return (
            <View style={Styles.body}>
                <View style={Styles.g1}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>車種が特定出来ませんでした。</Text>
                    <Text style={{textAlign: 'center', marginTop: 5}}>該当する車種を選択してください。</Text>
                </View>
                <View style={Styles.g2}>
                    <Text style={{fontWeight: 'bold'}}>{maker_name ? maker_name : 'トヨタ'}</Text>
                </View>
                <ListView
                    style={{backgroundColor: '#FFFFFF'}}
                    data={this.state.models}
                    renderRow={(data) =>
                        <View>
                            <Register data={data} onPressView={this.onPressView.bind(this, data)}/>
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
    g2: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        backgroundColor: '#EFEFEF',
    },
    g1: {
        paddingTop: 20,
        paddingBottom: 25,
        marginLeft: 20,
    }
});
