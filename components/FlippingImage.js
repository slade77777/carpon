import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';

export default class FlippingImage extends Component{
    render(){
        const { back = false, delay, duration = 1000, source, style = {} } = this.props;
        return(
            <Animatable.Image
                animation={{
                    from: { rotateX: back ? '0deg' : '180deg', rotate: !back ? '180deg' : '0deg' },
                    to: { rotateX: back ? '360deg' : '-180deg', rotate: !back ? '180deg' : '0deg' },
                }}
                duration={duration}
                delay={delay}
                easing="linear"
                iterationCount="infinite"
                useNativeDriver
                source={source}
                style={{
                    ...style,
                    backfaceVisibility: 'hidden',
                }}
            />
        )
    }
}