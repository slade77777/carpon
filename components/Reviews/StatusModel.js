import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import {getListReview, updateReview} from "../../carpon/Home/Review/action/ReviewAction";

@connect(state => ({
    review: state.review
}), dispatch => ({
    getListReview: (params) => dispatch(getListReview(params)),
    updateReview: () => dispatch(updateReview()),
    resetStatusModel: () => dispatch({
        type: 'RESET_STATUS_MODEL'
    })
}))
export default class StatusModel extends Component {
    state = {
        listModelDefault: [{
            sales_start: 'すべて',
            value: 'すべて'
        }],
        status: 'すべて'
    };

    onChangeStatus(item) {
        this.setState({
            status: item['sales_start']
        });
        const {car_name_code, maker_code} = this.props.review.reviewParameters;
        if (item['sales_start'] === 'すべて') {
            this.props.getListReview({
                car_name_code,
                maker_code
            })
        } else {
            this.props.getListReview({
                car_name_code,
                maker_code,
                sales_start: item['sales_start']
            });
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.review.updateModel) {
            this.props.resetStatusModel();
            // this.setState({
            //     status: 'すべて'
            // });
        }
    }


    formatDate(text) {
        if (text && text.length >= 4) {
            const month = text.substr(4, 2) ? parseInt(text.substr(4, 2)) + '月モデル' : '';
            const year = text.substr(0, 4) + '年';
            return year + month;
        } else {
            return '';
        }
    }


    render() {
        return (
            <View style={Styles.header}>
                <ScrollView horizontal={true}>
                    {
                        this.state.listModelDefault.map((item, index) =>
                            <TouchableOpacity key={index}
                                              style={item['value'] === this.state.status ? Styles.buttonOnPress : Styles.buttonOffPress}
                                              onPress={this.onChangeStatus.bind(this, item)}>
                                <Text
                                    style={item['value'] === this.state.status ? Styles.textOnPress : Styles.textOffPress}>{item['sales_start']}</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        this.props.summary['sales_starts'] && this.props.summary['sales_starts'].map((item, index) =>
                            <TouchableOpacity key={index}
                                              style={item['sales_start'] === this.state.status ? Styles.buttonOnPress : Styles.buttonOffPress}
                                              onPress={this.onChangeStatus.bind(this, item)}>
                                <Text
                                    style={item['sales_start'] === this.state.status ? Styles.textOnPress : Styles.textOffPress}>{`${this.formatDate(item['sales_start'])} (${item['total_reviewer']})`}</Text>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    header: {
        backgroundColor: '#EFEFEF',
        fontSize: 14,
        flexDirection: 'row',
        borderBottomColor: '#4B9FA5',
        borderBottomWidth: 2,
    },

    textOnPress: {
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold'
    },
    textOffPress: {
        textAlign: 'center',
        marginLeft: 15,
        marginRight: 15,
        fontSize: 11,
        fontWeight: 'bold'
    },

    buttonOnPress: {
        height: 40,
        backgroundColor: '#83C0C5',
        justifyContent: 'center'
    },
    buttonOffPress: {
        backgroundColor: '#EFEFEF',
        height: 40,
        justifyContent: 'center'
    }
});
