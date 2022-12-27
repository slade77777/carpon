import React, {PureComponent} from 'react';
import {Image, View} from 'react-native';

export default class ImageCenter extends PureComponent {

    render() {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 0,
                shadowOpacity: 0,
                shadowColor: 'transparent',
            }}>
                <Image {...this.props}/>
            </View>
        )
    }
}
