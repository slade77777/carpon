import React, {Component} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View, Linking} from 'react-native'
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";

const {width} = Dimensions.get('window');

export class TireInfoComponent extends Component {

    render() {
        const {tireAdvertising} = this.props;
        const tireDetail = tireAdvertising.tireDetail;
        const SmallImage = tireAdvertising.SmallImage;
        let title = tireDetail.title;

        return (
            <TouchableOpacity
                onPress={() => Linking.openURL(tireAdvertising.urlDetail)}
                style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    padding: 15,
                    borderBottomWidth: 1,
                    borderColor: '#e5e5e5',
                    borderTopWidth: this.props.index === 0 ? 1 : 0
                }}
            >
                <View style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#4B9FA5',
                    backgroundColor: (SmallImage.width && SmallImage.height) ? 'white' : 'grey'
                }}>
                    {
                        (SmallImage.width && SmallImage.height) ? <Image
                            style={{width: parseInt(SmallImage.width), height: parseInt(SmallImage.height)}}
                            source={{uri: SmallImage.urlImg[0]}}
                        /> : <View/>
                    }
                </View>
                <View style={{paddingLeft: 10, width: width * 0.75 - 50, justifyContent: 'center'}}>
                    <View>
                        {
                            tireDetail.label.length > 15 ?
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#262525'
                                }}>{title.slice(0, 15)}...</Text> :
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#262525'
                                }}>{tireDetail.label}</Text>
                        }
                        {
                            tireDetail.title.length > 35 ?
                                <Text style={{fontSize: 14, color: '#666666'}}>{title.slice(0, 35) + '...'}</Text> :
                                <Text style={{fontSize: 14, color: '#666666'}}>{title}</Text>
                        }
                    </View>
                    <View style={{marginTop: 8}}>
                        {
                            tireDetail.offerPrice ?
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        style={{fontSize: 23}}>{tireDetail.offerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}〜</Text>
                                    <Text style={{fontSize: 14, marginTop: 9}}>円</Text>
                                </View> :
                                <View/>
                        }
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 30}}>
                    <SvgImage
                        source={() => SvgViews.MoveNext({fill: '#007FEB'})}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}
