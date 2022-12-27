import React, {Component} from 'react';
import {SafeAreaView, Text, View} from "react-native";
import ButtonCarpon from "../../../../../components/Common/ButtonCarpon";
import {SingleColumnLayout} from "../../../../layouts";
import {getBottomSpace, isIphoneX} from "react-native-iphone-x-helper";

export default class WrapperQuestion extends Component {
    render() {
        const backgroundColor = !this.props.disabled ? '#F37B7D' : '#CCCCCC';
        return (
            <View style={{flex : 1}}>
                <SingleColumnLayout
                    backgroundColor='#FFF'
                    topContent={this.props.children}
                    bottomContent={
                        <View style={{
                            backgroundColor: 'rgba(112, 112, 112, 0.5)' , paddingTop: 15, paddingHorizontal: 15, paddingBottom: isIphoneX() ? getBottomSpace()  : 15, position: 'absolute', bottom: 0, width: '100%'
                        }}>
                            <ButtonCarpon disabled={this.props.disabled} onPress={this.props.handleNextQuestion ? this.props.handleNextQuestion.bind(this) : () => ({})}
                                          style={{backgroundColor, borderRadius: 6}}>
                                <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>{this.props.textButton}</Text>
                            </ButtonCarpon>
                        </View>
                    }
                />
            </View>
        )
    }
}
