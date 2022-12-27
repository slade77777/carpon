import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, StyleSheet} from 'react-native';
import ImageLoader from './ImageLoader';

export default class IconBottom extends Component {

    render() {
        const {style, item, choice} = this.props;
        let newStyle = {...style, backgroundColor : choice === item.component ? '#83C0C5' : '#262525'};
        return (
            <View style={newStyle}>
                <TouchableOpacity activeOpacity={1} onPress={this.props.onChange}>
                    <View style={{height: 20, marginTop: 10}}>
                        <ImageLoader
                            source={item.icon}
                            style={{...item.style, marginLeft: 'auto', marginRight: 'auto'}}
                        />
                    </View>
                    <Text style={Styles.text}>{item.content}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        fontSize: 8,
        color : 'white',
        marginTop: 5
    }
});
