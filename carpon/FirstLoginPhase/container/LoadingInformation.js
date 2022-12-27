import React, {Component} from 'react';
import {screen} from "../../../navigation";
import {StyleSheet, Text, Alert, View} from 'react-native';
import stylesGeneral from '../../../style';
import * as Progress from 'react-native-progress';
import HeaderCarpon from "../../../components/HeaderCarpon";
import {connect} from "react-redux";
import {navigationService} from "../../services/index";

const statuses = [
    '原動機の型式を取得',
    '通常パターン',
    'ナンバー読み込みの後の車検証QRの場合',
    '時間外の場合',
    '該当車両不明の場合'
];

@screen('LoadingInformation', {header: <HeaderCarpon/>})
@connect(state => {
    return {
        carInformation: state.carInformation
    }
}, (dispatch) => {
    return {
        // getApiCarInformation: params => dispatch(loadCarProfile(params))
    }
})
export class LoadingInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ''
        }
    }

    componentDidMount() {
        let params = this.props.carInformation.params;
        this.interval = setInterval(() => this.setState({status: statuses[Math.floor(Math.random() * statuses.length)]}), 300);
        this.props.getApiCarInformation(params)
        // this.props.getApiCarInformation(params);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleError(error) {
        const {navigate} = this.props.navigation;
        if(error) {
            if(error.status === 406) {
                return navigate('ConfirmedVehicleInformationScreen');
            }
            if(error.status === 404) {
                return Alert.alert(
                    'メッセージ',
                    '自動車の情報が見つかりません。もう一度確認してください。',
                    [
                        {text: '許可する', onPress: () => navigationService.clear('CarType')},
                    ],
                    {cancelable: false}
                );
            } else if(error.status < 500) {
                this.handleNotConnectServer()
            }
        } else {
            this.handleNotConnectServer()
        }
    }

    handleNotConnectServer() {
        return Alert.alert(
            'メッセージ',
            'サーバーまたはネットワークに接続できませんでした',
            [
                {text: '許可する', onPress: () => navigationService.clear('CarType')},
            ],
            {cancelable: false}
        );
    }

    componentWillReceiveProps(nextProps) {
        const {navigate} = this.props.navigation;
        if (nextProps.carInformation.isLoading) {
            if (nextProps.carInformation.response) {
                return navigate('ConfirmCarInfo');
            }
            this.handleError(nextProps.carInformation.error)
        }
    }

    render() {
        return (
            <View style={Styles.body}>
                <Text style={{position: 'absolute', top: 240}}>Carpon</Text>
                <Progress.Circle size={100} indeterminate={true} showsText={false} color='#73BFBF' borderWidth={5}/>
                <Text style={{textAlign: 'center', fontSize: 13, marginTop: 20}}>車輌情報を取得しています…</Text>
                <Text style={{textAlign: 'center', fontSize: 13}}>“{this.state.status}”</Text>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    body: {
        height: '100%',
        backgroundColor: stylesGeneral.backgroundColor,
        paddingTop: 200,
        alignItems: 'center',
    }
});
