import * as Animatable from 'react-native-animatable';
import React, {Component} from 'react';
import {Dimensions} from 'react-native';

const FIREWORK_DIMENSIONS = { width: 49, height: 26 };
const SCREEN_DIMENSIONS = Dimensions.get('window');
const WIGGLE_ROOM = 50;

export default class Falling extends Component {
    render() {
        const { duration, delay, style, children } = this.props;
        return (
            <Animatable.View
                animation={{
                        from: {translateY: -FIREWORK_DIMENSIONS.height - WIGGLE_ROOM},
                    to: {translateY: SCREEN_DIMENSIONS.height + WIGGLE_ROOM},
                }}
                duration={duration}
                delay={delay}
                easing={t => Math.pow(t, 1.7)}
                iterationCount="infinite"
                useNativeDriver
                style={style}
            >
                {children}
            </Animatable.View>
        )
    }
}
