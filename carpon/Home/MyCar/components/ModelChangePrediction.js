import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {myCarService, navigationService} from "../../../services";

const {width} = Dimensions.get('window');

export default class ModelChangePrediction extends Component {

    state = {
        content: "",
        carme_url: "",
        typeContent: 'string',
    };

    componentDidMount() {
        this.getModelPrediction();
    }

    getModelPrediction() {
        myCarService.getCarModelChangePrediction().then(response => {
            if (response.result) {
                const status = parseInt(response.data.change_status);
                if (status === 1) {
                    this.setState({
                        content: response.data.change_date,
                        typeContent: 'date',
                        carme_url: response.data.carme_url
                    })
                }

                if (status === 0 || status === 2) {
                    this.setState({
                        content: response.data.status_name,
                        typeContent: 'string',
                        carme_url: response.data.carme_url
                    })
                }
            }
        })
    }

    handleNavigate() {
        if (this.state.carme_url) {
            navigationService.navigate('WebViewModelChangePrediction', {uri: this.state.carme_url.includes('?') ? this.state.carme_url + '&ad=none' : this.state.carme_url + '?ad=none'})
        }
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 75,
                    paddingHorizontal: 15,
                    alignItems: 'center',
                    borderColor: '#E5E5E5',
                    borderTopWidth: 1,
                }}
                onPress={this.handleNavigate.bind(this)}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width - 65,
                    justifyContent: 'space-between'
                }}>
                    <View>
                        <Text style={{
                            fontSize: 16,
                            color: '#333333',
                            fontWeight: 'bold'
                        }}>モデルチェンジ予測</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View>
                            {
                                this.state.typeContent === 'date' ?
                                    <View style={{
                                        flexDirection: 'row',
                                    }}>
                                        <Text style={{
                                            fontSize: 23,
                                            color: '#333333',
                                            textAlign: 'right'
                                        }}>{this.state.content.slice(0, 4)}
                                            <Text style={{
                                                fontSize: 14, color: '#333333'
                                            }}>年</Text>
                                            <Text style={{ fontSize: 23, color: '#333333'}}>{this.state.content.length > 4 ? parseInt(this.state.content.slice(4, 6)) : ''}</Text>
                                            <Text style={{
                                                fontSize: 14, color: '#333333'
                                            }}>{this.state.content.length > 4 ? '月' : ''}</Text>
                                        </Text>
                                    </View> :
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#333333',
                                        fontWeight: 'bold'
                                    }}>{this.state.content}</Text>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ width: 35, alignItems: 'flex-end', justifyContent: 'center'}}>
                    {
                        this.state.carme_url ?
                            <View style={{
                                paddingLeft: 15
                            }}>
                                <SvgImage fill={'#4B9FA5'} source={SvgViews.ArrowCircle}/>
                            </View>
                            : null
                    }
                </View>
            </TouchableOpacity>
        )
    }
}
