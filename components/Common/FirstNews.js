import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import UserProfileForAllNews from "./UserProfileForAllNews";
import { Dimensions, Text } from "react-native";
import FooterNews from "./FooterNews";
import LabelTitleNews from "./LabelTitleNews";
import ImageCenter from "./ImageCenter";
import momentJA from "../../carpon/services/momentJA";
import connect from "react-redux/es/connect/connect";



@connect(state => ({
    newsReducer: state.news
}))
export default class FirstNews extends Component {

    constructor(props) {
        super(props);
        this.state = this.props.news
    }

    componentWillReceiveProps(nextProps) {
        const {updateClip, newsClip} = nextProps.newsReducer;
        if (updateClip && newsClip.id === this.state.id) {
            this.setState({...newsClip});
        }
        if (nextProps.updated) {
            this.setState({...nextProps.news})
        }
    }

    render() {
        const {end_point_s3, image_thumb, last_comment, title, issued, origin} = this.state;
        return (
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: '#4B9FA5',
                backgroundColor: '#F8F8F8',
            }}>
                <TouchableOpacity activeOpacity={1} style={{zIndex: 2, position: 'relative', margin : -1}}
                                  onPress={this.props.onPress.bind(this)}>
                    <ImageCenter
                        style={{height: 150, width: '100%'}}
                        source={{uri: end_point_s3 + image_thumb}}
                    />
                </TouchableOpacity>
                <View style={{
                    backgroundColor: '#F8F8F8',
                    padding: 15,
                    height: 100
                }}>
                    <TouchableOpacity activeOpacity={1} onPress={this.props.onPress.bind(this)}
                                      style={{height: '100%', justifyContent: 'space-between'}}>
                        <LabelTitleNews title={title}/>
                        <View style={{flexDirection: 'row', justifyContent : 'space-between'}}>
                            <Text style={{color: '#909090', fontSize: 12}}>{origin ? origin : ''}</Text>
                            <Text style={{color: '#909090', fontSize: 12}}>{momentJA(issued).fromNow()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginHorizontal: 15,
                    borderBottomColor: '#e9e9ee',
                    borderBottomWidth: 1}}/>
                <View>
                    {last_comment &&
                    <TouchableOpacity activeOpacity={1} onPress={this.props.onPress.bind(this)}>
                        <View style={{paddingHorizontal: 15}}>
                            {/*<UserProfileForAllNews last_comment={last_comment}/>*/}
                        </View>
                    </TouchableOpacity>
                    }
                </View>
                <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
                    <FooterNews news={this.state}/>
                </View>
            </View>
        )
    }
}
