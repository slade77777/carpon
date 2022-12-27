import React, {Component} from 'react';
import {View, TextInput, SafeAreaView, InputAccessoryView, Text, StyleSheet} from "react-native";
import HeaderOnPress from "../../components/HeaderOnPress";
import {screen} from "../../navigation";
import Spinner
    from "react-native-loading-spinner-overlay";
import {SingleColumnLayout} from "../layouts";
import {ButtonText} from "../../components";
import Icon
    from "react-native-vector-icons/FontAwesome";
import {userProfileService} from "../services";
import {updateUserProfile} from "../FirstLoginPhase/actions/registration";
import {connect} from 'react-redux';
import {navigationService} from "../services";

@screen('ProfileStatement', {header: <HeaderOnPress title={'プロフィール文'}/>})
@connect((state) => ({
        me: state.registration.userProfile.myProfile
    }),
    dispatch => ({
        updateUserProfile: (field, value) => dispatch(updateUserProfile(field, value))
    }))
export default class ProfileStatement extends Component {

    state = {
        text: '',
        loading: false
    };

    onChangeText(text) {
        this.setState({
            text: text.trim()
        })
    }

    componentDidMount() {
        this.setState({text: this.props.me.self_introduction ? this.props.me.self_introduction : ''})
    }

    handleUpdate() {
        this.setState({loading: true});
        userProfileService.updateUserProfile({self_introduction: this.state.text})
            .then((result) => {
                this.props.updateUserProfile('self_introduction', result.data.self_introduction);
                this.setState({loading: false});
                navigationService.goBack();
            }).catch(error => {
            this.setState({loading: false});
            console.log(error.response);
        });
    }

    renderButton() {
        return (
            this.state.text.length === 0 || this.state.text.length >= 10 ?
                <View style={{
                    padding: 15
                }}>
                    <ButtonText
                        title={'投稿する'}
                        onPress={() => this.handleUpdate()}/>
                </View> : <View/>
        );
    }

    render() {

        const inputAccessoryViewID = 'inputAccessoryViewID';
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
                <Spinner
                    visible={this.state.loading}
                    textContent={null}
                    textStyle={{color: 'white'}}
                />
                <SingleColumnLayout
                    backgroundColor='white'
                    topContent={
                        <View style={{paddingHorizontal: 15}}>
                            <Text style={{
                                color: '##666',
                                fontSize: 17,
                                paddingTop: 35
                            }}>プロフィール文を入力し、マイページを充実させましょう。</Text>
                            <View style={{width: '100%', alignItems: 'flex-end', paddingVertical: 10}}>
                                {(this.state.text.length >= 10 || this.state.text.length === 0) ?
                                    <Icon name='check-circle' color='#4B9FA5' size={16}/> :
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{color: '#F37B7D'}}>あと{10 - this.state.text.length}文字</Text>
                                        <Icon style={{marginLeft: 3}} name='exclamation-circle' color='#F37B7D'
                                              size={16}/>
                                    </View>}
                            </View>
                            <TextInput
                                inputAccessoryViewID={inputAccessoryViewID}
                                multiline={true}
                                autoFocus={true}
                                style={Styles.initHeightInput}
                                maxLength={150}
                                placeholder={'10文字以上150文字以内でご入力ください'}
                                onChangeText={(text) => this.onChangeText(text)}>
                                <Text>{this.state.text}</Text>
                            </TextInput>
                        </View>
                    }
                    bottomContent={
                        Platform.OS === 'ios' ?
                            <InputAccessoryView nativeID={inputAccessoryViewID}>
                                {
                                    this.renderButton()
                                }
                            </InputAccessoryView>
                            : this.renderButton()
                    }
                />
            </SafeAreaView>
        )
    }
}

const Styles = StyleSheet.create({
    initHeightInput: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: '#E5E5E5',
        maxHeight: 180,
        minHeight: 164,
        color: '#262626',
        width: '100%',
        textAlignVertical: 'top',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
    }
});
