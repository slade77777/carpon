import React, {Component} from 'react';
import {Alert, Text, View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from "react-redux";
import JapanText from '../JapanText';
import {VehicleInformationList} from "./VehicleInformationList";

@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    }),
    () => ({})
)
export class VehicleInformation extends Component {

    handleCarField() {
        const carInfo = this.props.carInfo;
        const CarField = [
            'body',
            'engine_fuel',
            'cd_driver'
        ];
        return CarField.map(element => {
            return {
                key: element,
                title: JapanText[element] || element,
                contentList: carInfo[element] || {}
            }
        });
    }

    render() {
        const CarFields = this.handleCarField();

        return (
            <View style={{backgroundColor: '#FFF'}}>
                <View style={{
                    backgroundColor: '#F8F8F8',
                    paddingHorizontal: 15,
                    justifyContent: 'center',
                    height: 45,
                    borderTopWidth: 0.5,
                    borderTopColor: '#E5E5E5',
                    borderBottomWidth: 1.5,
                    borderBottomColor: '#4b9fa5',
                    marginBottom: 15
                }}>
                    <Text style={{color: '#262525', fontSize: 17, fontWeight: 'bold'}}>車両情報</Text>
                </View>
                {
                    CarFields.map((CarField, index) => {
                        return <View  key={index} style={{paddingBottom: 15}}>
                            <VehicleInformationList CarField={CarField}/>
                        </View>

                    })
                }
            </View>
        )
    }
}