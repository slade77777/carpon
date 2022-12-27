import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {navigationService} from '../../services';

const {width} = Dimensions.get('window');

export default class InsuranceCompleted extends Component {

    state = {
        opacity: 0,
    };

    handleNavigate() {
        const company = this.props.company;
        navigationService.clear('InsuranceLogin', {company, isAutoFill: false});
    }

    render() {
        const companyImage = this.props.companyImage;
        const company = this.props.company;

        return (
            <View style={{
                zIndex: 50,
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: `rgba(75,159,165,0.9)`,
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    marginRight: 15,
                    marginLeft: 15
                }}>
                    <View/>
                    <View>
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
                            <Image source={companyImage} style={{ width: width * 0.6, height: width * 0.3}}/>
                        </View>
                        <View>
                            <Text style={{fontSize: 23, fontWeight: 'bold', color: '#fff', textAlign: 'center'}}>個別見積・お申し込み</Text>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                                marginTop: 5
                            }}>ここから先のページは、{company.name}のお手続きとなります。</Text>
                        </View>
                    </View>
                    <View style={{height: 70, justifyContent: 'center', alignItems: 'center',}}>
                        <TouchableOpacity activeOpacity={1}
                            onPress={() => this.handleNavigate()}
                            style={{
                                backgroundColor: '#FFF',
                                borderRadius: 4,
                                height: 40,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={{fontSize: 20, color: '#4b9fa5', fontWeight: 'bold'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}
