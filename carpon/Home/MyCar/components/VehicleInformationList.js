import React, {Component} from 'react';
import {Text, FlatList, View, TouchableOpacity} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import MyCarProfileField from '../MyCarProfileField';
import numeral from 'numeral';

export class VehicleInformationList extends Component {

    state = {
        showContent: false
    };

    handleRawData() {
        let contentList = this.props.CarField.contentList;
        const key = this.props.CarField.key;
        return Object.keys(MyCarProfileField[key]).map((element) => {
            return {
                FieldName: key,
                label: MyCarProfileField[key][element],
                [element]: contentList[element] || '',
                value: contentList[element] || '',
                key: element
            };
        })
    }

    handleExceptionInterior(object) {
        let length = parseFloat(numeral(object.interior_length / 1000).format('0.00')) || '-';
        let width = parseFloat(numeral(object.interior_width / 1000).format('0.00')) || '-';
        let height = parseFloat(numeral(object.interior_height / 1000).format('0.00')) || '-';
        return length + 'x' + width + 'x' + height + 'm';
    }

    handleExceptionCarWeight(object) {
        let weight = object.car_weight || '-';
        let totalWeight = object.car_total_weight || '-';
        return weight + 'kg ' + '(' + totalWeight + 'kg' + ')';
    }

    handleExceptionPower(object) {
        let ps = object.power_ps || '-';
        let kw = object.power_kw || '-';
        let roration = object.power_roration || '-';
        return ps + 'ps' + '(' + kw + 'kW' + ')' + '/' + roration + 'rpm';
    }

    handleExceptionTorque(object) {
        let kg = object.torque_kg || '-';
        let nm = object.torque_nm || '-';
        let rotation = object.torque_rotation || '-';

        return kg + 'kg・m(' + nm + 'N・m' + ')/' + rotation + 'rpm';
    }


    handleRender(object) {
        switch (object.key) {
            case 'indor':
                return this.handleExceptionInterior(object.indor);
            case 'vehicle' :
                return this.handleExceptionCarWeight(object.vehicle);
            case 'min_ground_height':
                return object.min_ground_height / 1000 + 'm';
            case 'max_capacity':
                return object.max_capacity ? object.max_capacity + 'kg' : '-kg';
            case 'power' :
                return this.handleExceptionPower(object.power);
            case 'torque':
                return this.handleExceptionTorque(object.torque);
            case 'tank_capacity':
                return object.tank_capacity ? object.tank_capacity + 'L' : '-L';
            case 'engine':
                let cylinderSequence = object.engine.cylinder_sequence || '';
                let engineDetail = object.engine.engine_detail ? object.engine.engine_detail + '気筒' : '';
                let engineType = object.engine.engine_type || '' ;
                switch (object.engine.fuel_code) {
                    case 'E':
                        return cylinderSequence + engineDetail + engineType + 'モーター';
                    case 'GH':
                    case 'DH':
                        return cylinderSequence + engineDetail + engineType + '+モーター';
                    default:
                        return cylinderSequence + engineDetail + engineType
                }
            case 'ecocar_flg':
                return object.ecocar_flg === 1 ? '○' : '-';

            default:
                return object.value ? object.value : '-';
        }
    }

    renderContent(element) {
        return (
            <View style={{
                minHeight: 60,
                paddingHorizontal: 15,
                borderColor: '#e5e5e5',
                borderBottomWidth: 0.5,
                borderTopWidth: element.index === 0 ? 0.5 : 0,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#333'}}>{element.item.label}</Text>
                <View style={{width: '59%', alignItems: 'flex-end'}}>
                    <Text style={{
                        fontSize: 16,
                        color: '#333',
                        textAlign: 'right'
                    }}>{this.handleRender(element.item)}</Text>
                </View>
            </View>
        )
    };

    render() {
        const title = this.props.CarField.title;
        return (
            <View style={{backgroundColor: '#FFF'}}>
                <TouchableOpacity
                    style={{
                        height: 45,
                        backgroundColor: '#F2F8F9',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderColor: '#4B9FA5',
                        ...this.props.style
                    }}
                    onPress={() => this.setState({showContent: !this.state.showContent})}
                >
                    <Text style={{color: '#4B9FA5', fontSize: 15, fontWeight: 'bold'}}>{title}</Text>
                    <SvgImage source={this.state.showContent ? SvgViews.ArrowDown : SvgViews.ArrowUp}/>
                </TouchableOpacity>
                {
                    this.state.showContent &&
                    <FlatList
                        data={this.handleRawData()}
                        renderItem={(element) => this.renderContent(element)}
                    />
                }
            </View>
        );
    }
}
