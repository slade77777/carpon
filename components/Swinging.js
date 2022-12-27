import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';

export default class Swinging extends Component{
    render(){
        const { amplitude, rotation = 7, delay, duration = 700, children } = this.props;
        return(
            <Animatable.View
                animation={{
                    0: {
                        translateX: -amplitude,
                        translateY: -amplitude * 0.8,
                        rotate: `${rotation}deg`,
                    },
                    0.5: {
                        translateX: 0,
                        translateY: 0,
                        rotate: '0deg',
                    },
                    1: {
                        translateX: amplitude,
                        translateY: -amplitude * 0.8,
                        rotate: `${-rotation}deg`,
                    },
                }}
                delay={delay}
                duration={duration}
                direction="alternate"
                easing="ease-in-out"
                iterationCount="infinite"
                useNativeDriver
            >
                {children}
            </Animatable.View>
        )
    }
}
