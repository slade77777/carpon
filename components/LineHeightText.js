import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';

export default class LineHeightText extends Component {

    state = {
        viewHeight: null,
        isSet: false
    };

    findDimensions(layout) {
        const {height} = layout;
        if (!this.state.isSet) {
            this.setState({viewHeight: parseInt(height/2), isSet: true})
        }
    }

    render() {
        const {style, value, ...props} = this.props;
        let styleAction = null;
        if (this.state.viewHeight && Platform.OS === 'android') {
            styleAction = {...style, fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif', lineHeight: this.state.viewHeight};
        } else {
            styleAction = {...style, fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'};
        }
        return (
            <View onLayout={(event) => {
                this.findDimensions(event.nativeEvent.layout)
            }}>
                <Text {...props} style={styleAction}>{value}</Text>
            </View>
        )
    }
}

