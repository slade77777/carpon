import React, {Component} from 'react';
import {screen} from '../../../../navigation';
import HeaderOnPress from "../../../../components/HeaderOnPress";
import {ManufacturerList} from "../../../../components/ManufacturerList/index";
import {navigationService} from "../../../services/index";
import {viewPage} from "../../../Tracker";

@screen('ManufacturerListScreen', {header: <HeaderOnPress title={'メーカー'}/>})
export class ManufacturerListScreen extends Component {

    componentDidMount() {
        viewPage('list_review_makers', 'レビュー_絞り込み_メーカーリスト');
    }

    onPressView(data) {
        const score = this.props.navigation.getParam('score');
        const questionId = this.props.navigation.getParam('questionId');

        return navigationService.navigate('ModelListScreen', {
            maker_code: data['maker_code'],
            maker_name: data['maker_name'],
            score: score,
            questionId
        });
    }

    render() {
        return (
            <ManufacturerList onPress={this.onPressView.bind(this)}/>
        )
    }
}
