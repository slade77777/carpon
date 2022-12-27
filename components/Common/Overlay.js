import {Animated, Dimensions, Easing} from "react-native";
import React, {Component} from "react";
const dimensions = Dimensions.get('window');

export default class Overlay extends Component {

    state = {
        topAnimation: new Animated.Value(dimensions.height)
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.props.open) {
            this.animate(nextProps.open)
        }
    }

    animate(willBeOpen) {
        if (willBeOpen) {
            return Animated.timing(this.state.topAnimation,
                {
                    toValue: 0,
                    easing: Easing.in(),
                    duration: 400,
                }).start()
        }

        return Animated.timing(this.state.topAnimation,
            {
                toValue: dimensions.height,
                easing: Easing.in(),
                duration: 600,
            }).start()

    }

    render() {
        return (
            <Animated.View style={{
                position: 'absolute',
                top: this.state.topAnimation,
                opacity: Animated.divide(dimensions.height - this.state.topAnimation, dimensions.height),
                left: 0,
                width: dimensions.width,
                height: dimensions.height,
                // zIndex: 3
            }}>
                {this.props.children}
            </Animated.View>
        )
    }
}
