import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {screen} from '../../../../navigation';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import connect from "react-redux/es/connect/connect";
import {getListModelReview, getReviewSummary, updateReview, getListReview} from "../action/ReviewAction";
import {ModelCarList} from "../../../../components/ModelCarList/index";
import {viewPage} from "../../../Tracker";

@screen('ModelListScreen', {header: <HeaderOnPress/>})
@connect(() => ({}), dispatch => ({
    getReviewSummary: params => dispatch(getReviewSummary(params)),
    updateReview: () => dispatch(updateReview()),
    getListModel : (params) => dispatch(getListModelReview(params)),
    getListReview : params => dispatch(getListReview(params)),
    updateCarInfo : (carInfo, questionId) => dispatch({
        type: 'GET_SURVEY_CAR_INFO',
        carInfo,
        questionId
    })
}))
export class ModelListScreen extends Component {

    componentDidMount() {
        viewPage('list_review_cars', 'レビュー_絞り込み_車名リスト');
    }

    onPressView(data) {
        const score = this.props.navigation.getParam('score');
        const questionId = this.props.navigation.getParam('questionId');
        const maker_code = this.props.navigation.getParam('maker_code');
        const maker_name = this.props.navigation.getParam('maker_name');

        if(score) {
            const carInfo = {
                car_name_code: data['name_code'],
                maker_code: maker_code,
                maker_name,
                car_name: data['car_name']
            };
            this.props.updateCarInfo(carInfo, questionId);
        } else {
            this.props.getReviewSummary({
                car_name_code: data['name_code'],
                maker_code: maker_code,
                maker_name,
                car_name: data['car_name']
            });
            this.props.getListReview({
                car_name_code: data['name_code'],
                maker_code: maker_code,
            });
        }

        this.props.navigation.pop(2);
    }

    render() {
        const maker_code = this.props.navigation.getParam('maker_code');
        const maker_name = this.props.navigation.getParam('maker_name');
        return (
            <ModelCarList onPress={this.onPressView.bind(this)} maker_name={maker_name} maker_code={maker_code}/>
        )
    }
}
