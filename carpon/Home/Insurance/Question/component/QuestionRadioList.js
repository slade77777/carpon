import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from "react-native";
import color from "../../../../color";

export default class QuestionRadioList extends Component {
    render() {
        let options = [];
        this.props.answerList.map((item, index) => {
            options.push(
                <TouchableOpacity onPress={() => this.props.onClick(item.value)} style={{...Styles.inline}} key={index}>
                    {item.color_code && <View style={{backgroundColor : item.color_code, width : 5, height : 5, marginRight: 10}}/>}
                    <View style={{width: '50%', alignItems: 'flex-start', paddingLeft: 5}}>
                        <Text>{item.label || item.name}</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems : 'flex-end', width : '50%', paddingRight : 15}}>
                        <View style={Styles.radio}>
                            {
                                (this.props.type === item.value) && <View style={Styles.checked}/>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        );
        return (
            <View style={{borderBottomWidth: 1, borderColor: '#CDD6DD', paddingBottom: 15}}>
                {options}
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    radio: {
        width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#CDD6DD', alignItems: 'center', justifyContent: 'center'
    },
    inline: {
        paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', borderTopWidth: 1, borderColor: '#CDD6DD', paddingTop: 15, alignItems: 'center'
    },
    checked: {
        width: 15, height: 15, borderRadius: 10, borderWidth: 1, borderColor: color.active, backgroundColor: color.active
    }
});
