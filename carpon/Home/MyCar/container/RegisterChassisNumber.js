import React, {Component} from 'react';
import {screen} from "../../../../navigation";
import {Text, Keyboard, View, SafeAreaView, Alert,InputAccessoryView} from 'react-native';
import {InputText, ButtonText, HeaderOnPress} from '../../../../components/index';
import {connect} from 'react-redux';
import {updateCar} from '../actions/myCarAction';
import {SingleColumnLayout} from "../../../layouts";

@screen('RegisterChassisNumber', {header: <HeaderOnPress title={'車検証記載の車台番号を入力'}/>})
@connect(
    state => ({
        carInfo: state.getCar
    }),
    dispatch => ({
        updateCar: (data) => {
            dispatch(updateCar(data))
        }
    })
)
export class RegisterChassisNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classicNumb: props.carInfo.myCarInformation ? props.carInfo.myCarInformation.platform_number : null,
            disabled: true,
            spaceBottom: 20,
            loading: false
        };
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove()
    }

    keyboardWillShow(e) {
        this.setState({spaceBottom: e.endCoordinates.height});
    }

    keyboardWillHide(e) {
        this.setState({spaceBottom: 20});

    }

    handleChangeText = (text) => {
        this.setState({
            classicNumb: text,
            disabled: text.length === 0
        });
    };

    handleNewClassic() {
        Alert.alert(
            '車検証情報の更新',
            '車検証の読み取りが完了しました。',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        this.props.updateCar({
                            id: this.props.carInfo.myCarInformation.id,
                            platform_number: this.state.classicNumb
                        });
                        setTimeout(() => {
                            if (this.props.carInfo.updatedCar) {
                                this.props.navigation.pop(2);
                            }
                        }, 1000);
                    }
                },
            ]
        );
    }

    render() {
        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <View style={{flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{height: '100%', backgroundColor: 'white'}}
                              onStartShouldSetResponderCapture={() => Keyboard.dismiss()}>
                            <View style={{padding: 30}}>
                                <Text style={{
                                    fontSize: 14,
                                    marginTop: 15,
                                    lineHeight: 20
                                }}>車検証に記載されている○桁の車台番号を入力してください</Text>
                            </View>
                            <View>
                                <View style={{padding: 30, paddingBottom: 40}}>
                                    <InputText
                                        inputAccessoryViewID={inputAccessoryViewID}
                                        title='車台番号'
                                        keyboardType={'numeric'}
                                        onChangeText={this.handleChangeText}
                                        value={this.state.classicNumb}
                                    />
                                </View>
                            </View>
                        </View>
                    }
                    bottomContent={
                        Platform.OS === 'ios'
                            ? (
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={{padding: 10, marginBottom: 20}}>
                                <ButtonText disabled={this.state.disabled} title={'OK'}
                                            onPress={this.handleNewClassic.bind(this)}/>
                            </View>
                        </InputAccessoryView>)
                          : (
                                <View style={{padding: 10, marginBottom: 20}}>
                                    <ButtonText disabled={this.state.disabled} title={'OK'}
                                                onPress={this.handleNewClassic.bind(this)}/>
                                </View>
                            )

                    }
                />
            </View>
        )
    }
}

