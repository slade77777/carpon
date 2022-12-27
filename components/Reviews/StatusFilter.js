import React, {Component} from 'react';
import {Text, Dimensions, View, TouchableOpacity} from "react-native";
import {navigationService} from "../../carpon/services";
import _ from 'lodash';
import {connect} from "react-redux";
import {SvgImage, SvgViews} from "../Common/SvgImage";
import {updateReview} from "../../carpon/Home/Review/action/ReviewAction";


@connect(() => ({}), dispatch => ({
    removeFilterReview: () => dispatch({
        type: 'REMOVE_FILTER_REVIEW'
    }),
    updateReview: () => dispatch(updateReview())
}))
export default class StatusFilter extends Component {

    onPress() {
        navigationService.navigate('ManufacturerListScreen')
    }

    removeFilterReview() {
        this.props.removeFilterReview();
        this.props.updateReview();
    }

    render() {
        const summaryParameters = this.props.summaryParameters;
        let title = !_.isEmpty(summaryParameters) ? `${summaryParameters.maker_name} ${summaryParameters.car_name} ` : '全ての車種のレビュー';
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: '#333333',
                height: 38,
                borderTopColor: '#000000',
                borderTopWidth: 1.5,
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '85%'}}>
                    {!_.isEmpty(summaryParameters) ?
                        <TouchableOpacity onPress={this.removeFilterReview.bind(this)}
                                          style={{flexDirection: 'row', height: '100%'}}>
                            <View style={{paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center'}}>
                                <SvgImage
                                    source={SvgViews.MoreHoriz}
                                />
                            </View>
                            <SvgImage
                                source={SvgViews.ArrowRight}
                            />
                        </TouchableOpacity> : null
                    }
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        color: 'white',
                        marginLeft: 10
                    }}>
                        {title}
                    </Text>
                </View>
                <TouchableOpacity onPress={this.onPress.bind(this)} style={{
                    flexDirection: 'row', justifyContent: 'center',
                    alignItems: 'center',
                    borderLeftWidth: 2,
                    borderLeftColor: '#000000',
                    width: '15%',
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <SvgImage
                            source={SvgViews.IconFilter}
                            style={{
                                width: 18,
                            }}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
