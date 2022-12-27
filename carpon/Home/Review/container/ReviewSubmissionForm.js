import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {HeaderOnPress, InputText} from '../../../../components/index';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    Modal,
    Image,
    Linking,
    PermissionsAndroid,
    Platform,
    SafeAreaView
} from 'react-native';
import ReviewForm from "../components/ReviewForm";
import {viewPage} from "../../../Tracker";

@screen('ReviewSubmissionForm', {
    header: <HeaderOnPress title='レビュー投稿'/>
})
export class ReviewSubmissionForm extends Component {

    componentDidMount() {
        viewPage('submit_review', 'レビュー投稿');
    }

    render() {
        return (
            <ReviewForm navigation={this.props.navigation}/>
        )
    }
}

