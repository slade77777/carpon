import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Overlay from 'react-native-modal-overlay';
import {connect} from "react-redux";
import JapanText from '../JapanText';
import {ContentList} from "./ContentList";
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import ButtonCarpon from "../../../../components/Common/ButtonCarpon";

@connect(state => ({
        carInfo: state.getCar ? state.getCar.myCarInformation : null
    }),
    () => ({})
)
export class Equipment extends Component {

    state = {
        showModal: false
    };

    handleCarField() {
        const carInfo = this.props.carInfo;
        const CarField = [
            'equipment_view',
            'equipment_exterior',
            'equipment_around_driver_seat',
            'equipment_interior',
            'equipment_aricon',
            'equipment_audio',
            'equipment_under_carriage'
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
                    marginBottom: 15,
                    marginTop: 10
                }}>
                    <Text style={{color: '#262525', fontSize: 17, fontWeight: 'bold'}}>装備</Text>
                </View>
                <TouchableOpacity style={{
                    paddingTop: 5,
                    paddingBottom: 15,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingHorizontal: 15
                }}
                                  onPress={() => this.setState({showModal: !this.state.showModal})}
                >
                    <SvgImage style={{paddingRight: 3}} fill={'#666'} source={SvgViews.HelpIcon}/>
                    <View style={{borderBottomWidth: 0.5, borderColor: '#666'}}>
                        <Text style={{fontSize: 14, color: '#666'}}>装備記号について</Text>
                    </View>
                </TouchableOpacity>
                <Overlay
                    containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                    visible={this.state.showModal}
                    onClose={() => this.setState({showModal: false})}
                    childrenWrapperStyle={{borderRadius: 5, backgroundColor: '#E5E5E5'}}
                >
                    <Text style={{color: '#333', fontSize: 18, fontWeight: 'bold', paddingBottom: 15}}>装備記号について</Text>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderColor: '#E5E5E5',
                        backgroundColor: '#fff',
                        height: 50,
                        width: '100%'
                    }}>
                        <View style={{
                            borderRightWidth: 1,
                            borderColor: '#E5E5E5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 50
                        }}>
                            <Text style={{fontSize: 16, color: '#333'}}>◯</Text>
                        </View>
                        <View style={{justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{fontSize: 16, color: '#333'}}>標準装備</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderColor: '#E5E5E5',
                        backgroundColor: '#fff',
                        height: 50,
                        width: '100%'
                    }}>
                        <View style={{
                            borderRightWidth: 1,
                            borderColor: '#E5E5E5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 50
                        }}>
                            <Text style={{fontSize: 16, color: '#333'}}>M</Text>
                        </View>
                        <View style={{justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{fontSize: 16, color: '#333'}}>メーカーオプション</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderColor: '#E5E5E5',
                        backgroundColor: '#fff',
                        height: 50,
                        width: '100%',
                        marginBottom: 20
                    }}>
                        <View style={{
                            borderRightWidth: 1,
                            borderColor: '#E5E5E5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 50
                        }}>
                            <Text style={{fontSize: 16, color: '#333'}}>D</Text>
                        </View>
                        <View style={{justifyContent: 'center', paddingLeft: 15}}>
                            <Text style={{fontSize: 16, color: '#333'}}>ディーラーオプション</Text>
                        </View>
                    </View>
                    <ButtonCarpon style={{backgroundColor: '#F06A6D', height: 50}}
                                  onPress={() => this.setState({showModal: false})}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: '#FFFFFF'}}>OK</Text>
                    </ButtonCarpon>
                </Overlay>
                {
                    CarFields.map((CarField, index) => {
                        return <View key={index} style={{paddingBottom: 15}}>
                            <ContentList CarField={CarField}/>
                        </View>
                    })
                }
            </View>
        )
    }
}