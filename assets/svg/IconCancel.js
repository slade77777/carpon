
import React from 'react';
import {
    Svg,
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

export default function IcCancel(props) {
    return (
        <Svg height="15" width="15" viewBox="0 0 14 14">
            <Path id="ic_cancel_24px" d="M9,2a7,7,0,1,0,7,7A6.994,6.994,0,0,0,9,2Zm3.5,9.513-.987.987L9,9.987,6.487,12.5,5.5,11.513,8.013,9,5.5,6.487,6.487,5.5,9,8.013,11.513,5.5l.987.987L9.987,9Z" fill="#ccc" transform="translate(-2 -2)"/>
        </Svg>
    );
}
