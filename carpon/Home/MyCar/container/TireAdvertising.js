import React, {Component} from 'react';
import {images} from "../../../../assets";
import {Image, Text, TouchableOpacity, View, Linking} from 'react-native'
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {TireInfoComponent} from "./TireinfoComponent";
import {connect} from 'react-redux'
import {updateAdvertising} from "../actions/myCarAction";
import {navigationService} from "../../../services";
import AmazonLogo from "../../../../assets/svg/AmazonLogo";

export class ButtonLink extends Component {

    handleTireRaw(tire) {
        let tireArray = tire.split('/');
        let tireURI = tire ? tireArray[0] + '%2F'+ tireArray[1]: 'tire';
        return `https://www.amazon.co.jp/s?k=${tireURI}&i=automotive&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&ref=nb_sb_noss_2`
    }

    render() {
        const {title} = this.props;
        const {tire} = this.props;

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: '#007FEB',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 20,
                    borderRadius: 6
                }}
                onPress={() => Linking.openURL(this.handleTireRaw(tire))}
            >
                <View style={{width: '10%'}}>

                </View>
                <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>{title}</Text>
                <SvgImage
                    source={SvgViews.IconLaunch}
                />
            </TouchableOpacity>
        )
    }
}

@connect(state => ({
        tireAdvertising: state.getCar.advertising
    }),
    dispatch => ({
        updateAdvertising: (tire) => dispatch(updateAdvertising(tire))
    }))
export class TireAdvertising extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const tire = this.props.tire;
        this.setState({
            tire: tire
        });
        this.props.updateAdvertising(tire)
    }

    componentWillReceiveProps(props) {
        if (props.tire !== this.state.tire) {
            this.props.updateAdvertising(props.tire);
            return this.setState({
                tire: props.tire
            })
        }
    }

    render() {
        return (
            <View style={{color: '#fff'}}>
                {
                    this.props.tireAdvertising.data.length > 0 ?
                        <View>
                            <View style={{
                                borderTopWidth: 1,
                                borderTopColor: '#E5E5E5',
                                borderBottomWidth: 2,
                                borderBottomColor: '#4B9FA5',
                                paddingHorizontal: 15,
                                height: 45,
                                justifyContent: 'center',
                                color: '#F8F8F8',
                                backgroundColor: '#F8F8F8'
                            }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#262525'}}>ショッピング</Text>
                            </View>
                            <TouchableOpacity>
                                <View style={{
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    marginTop: 30,
                                    marginBottom: 15
                                }}>
                                    <SvgImage source={SvgViews.AmazonLogo}/>
                                </View>
                                {
                                    this.props.tireAdvertising.data.map((item, index) => {
                                        return <View key={index}><TireInfoComponent index={index} tireAdvertising={item}/></View>
                                    })
                                }
                                <View style={{marginVertical: 20, marginHorizontal: 15}}>
                                    <ButtonLink tire={this.state.tire} title={'アマゾンで探す'}/>
                                </View>
                            </TouchableOpacity>
                        </View> :
                        <View style={{height: '45%'}}>
                        </View>
                }
            </View>

        )
    }
}
