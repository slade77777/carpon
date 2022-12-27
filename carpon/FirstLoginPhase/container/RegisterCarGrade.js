import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView  } from 'react-native';
import { screen } from '../../../navigation';
import { Register } from '../../../components/index';
import stylesGeneral from '../../../style';
import HeaderOnPress from "../../../components/HeaderOnPress";
import {carInformationService, navigationService} from "../../services/index";

@screen('RegisterCarGrade', { header: <HeaderOnPress/> })
export class RegisterCarGrade extends Component {

    state = {
        gradeModels: []
    };

    componentDidMount() {
        const maker_code = this.props.navigation.getParam('maker_code');
        const name_code = this.props.navigation.getParam('name_code');
        carInformationService.getCarGradeModel(maker_code, name_code).then(response => {
            this.setState({
                gradeModels: response.data.map(grade => {
                    return {
                        ...grade,
                        title: `${grade['grade_name']} - ${grade['form']} - ${grade['mission_code']} - ${this.formatDate(grade['sales_start'])}`
                    }
                })
            })
        })
    }

    formatDate(text) {
        if (text.length === 6) {
            return text.substr(4, 2) + '/' + text.substr(0, 4);
        }
    }

    onPressView(data) {
        carInformationService.updateCarInformation({
            "hoyu_id": data['hoyu_id'],
        }).then(() => {
            navigationService.navigate('ConfirmedVehicleInformationScreen')
        })
    }

    render() {
        const car_name = this.props.navigation.getParam('car_name');
        const maker_name = this.props.navigation.getParam('maker_name');
        return (
            <View style={Styles.body}>
                <View style={Styles.g1}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>車種が特定出来ませんでした。</Text>
                    <Text style={{ textAlign: 'center', marginTop: 5 }}>該当するメーカーを選択して下さい。</Text>
                </View>
                <View style={Styles.g2}>
                    <Text style={{ fontWeight: 'bold' }}>{car_name ? car_name + '    ' : 'トヨタ アルファード'} {maker_name ? maker_name : ''}</Text>
                </View>
                <ListView
                    style={{ backgroundColor: '#FFFFFF' }}
                    data={this.state.gradeModels}
                    renderRow={(data) =>
                        <View>
                            <Register data={data} onPressView={this.onPressView.bind(this, data)} />
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
