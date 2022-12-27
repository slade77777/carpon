import React, {Component} from 'react';
import {Text, StyleSheet, View} from "react-native";
import {InputText} from '../../../../components';
import Dropdown from '../../../common/Dropdown';
import tireInfo from '../../../../tire';
import color from "../../../color";

export default class TireFormFields extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        selectedTireWidth: null,
        selectedOblateness: null,
        selectedRadialStructure: null,
        selectedSize: null,
        loadIndex: null,
        selectedSpeedSymbol: null,
        selectedManufacturer: null,
    };

    componentDidMount() {
        this.setState({...this.props.tireInformation});
    }

    componentWillReceiveProps(newProps) {
        this.setState({...newProps.tireInformation});
    }

    handleOnSelected(value, fields) {
        this.props.handleOnSelected(value, fields)
    }

    handleChangeText = (number) => {
        this.props.handleChangeText(number);
    };

    render() {
        const {selectedTireWidth, selectedOblateness, selectedRadialStructure, selectedSize,
            selectedSpeedSymbol, selectedManufacturer, loadIndex} = this.state;
        const TireWidth = tireInfo.TireWidth;
        const Oblateness = tireInfo.Oblateness;
        const RadialStructure = tireInfo.RadialStructure;
        const Size = tireInfo.Size;
        const SpeedSymbol = tireInfo.SpeedSymbol;
        const Manufacturer = tireInfo.Manufacturer;

        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: '45%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'タイヤ幅'}
                            data={TireWidth}
                            value={selectedTireWidth || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedTireWidth')}
                        />
                    </View>
                    <View style={{width: '45%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'扁平率'}
                            data={Oblateness}
                            value={selectedOblateness || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedOblateness')}
                        />
                    </View>

                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: '45%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'ラジアル構造'}
                            data={RadialStructure}
                            value={selectedRadialStructure || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedRadialStructure')}
                        />
                    </View>
                    <View style={{width: '45%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'インチサイズ'}
                            data={Size}
                            value={selectedSize || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedSize')}
                        />
                    </View>
                </View>
                {
                    (!selectedRadialStructure || selectedRadialStructure ==='R') &&
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <View style={{width: '45%', paddingBottom: 9}}>
                        <View>
                            <View style={{height: 11}}>
                                <Text style={{
                                    color: loadIndex ? '#4B9FA5' : color.inActive,
                                    fontSize: 11,
                                }}>荷重指数</Text>
                            </View>
                            <View>
                                <InputText
                                    maxLength={3}
                                    keyboardType={'numeric'}
                                    style={Styles.InputText}
                                    onChangeText={this.handleChangeText}
                                    value={`${loadIndex || ''}`}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{width: '45%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'速度記号'}
                            data={SpeedSymbol}
                            value={selectedSpeedSymbol || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedSpeedSymbol')}
                        />
                    </View>
                </View>
                }
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: '100%'}}>
                        <Dropdown
                            labelFontSize={11}
                            fontSize={18}
                            label={'メーカー'}
                            data={Manufacturer}
                            value={selectedManufacturer || ''}
                            onChangeText={(value) => this.handleOnSelected(value, 'selectedManufacturer')}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    InputText: {
        zIndex: 0,
        fontSize: 20,
        backgroundColor: '#FFFFFF',
        height: 40,
        padding: 0,
        borderColor: '#CCCCCC'
    },
});
