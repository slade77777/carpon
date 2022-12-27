import React, {PureComponent} from "react";
import {TouchableOpacity, View} from "react-native";

export default class RadioCarpon extends PureComponent {
    render() {
        return (
            <TouchableOpacity activeOpacity={1}
                onPress={this.props.onPress ? this.props.onPress.bind(this, this.props.name) : () => ({})}
                style={{
                    width: 25, height: 25, borderRadius: 12.5, borderWidth: 1, borderColor: '#CDD6DD',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                {this.props.checked ?
                    <View style={{
                        width: 12, height: 12, borderRadius: 6, backgroundColor: '#4B9FA5'
                    }}/>
                    : null
                }
            </TouchableOpacity>
        )
    }
}