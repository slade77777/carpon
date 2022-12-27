import React, { PureComponent } from 'react';
import { View } from 'react-native';
import svgs from '../../assets/svg';

const SvgViews = {
    ...svgs
};

class SvgImage extends PureComponent {
    render() {
        const TagName = this.props.source;
        return (
            <View style={{
                ...this.props.style,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 0,
                shadowOpacity: 0,
                shadowColor: 'transparent',
            }}>
                <TagName {...this.props} />
            </View>
        )
    }
}

export {
    SvgViews,
    SvgImage
}