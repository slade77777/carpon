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

export default function Refix(props) {
    const color = props.fill ? props.fill : '#CCC';

    return (
        <Svg height="15.455" width="20" viewBox="0 0 20 15.455">
            <Path id="ic_chrome_reader_mode_24px"
                  d="M11.909,11.273h6.364v1.364H11.909Zm0-2.273h6.364v1.364H11.909Zm0,4.545h6.364v1.364H11.909ZM19.182,4H2.818A1.824,1.824,0,0,0,1,5.818V17.636a1.824,1.824,0,0,0,1.818,1.818H19.182A1.824,1.824,0,0,0,21,17.636V5.818A1.824,1.824,0,0,0,19.182,4Zm0,13.636H11V5.818h8.182Z"
                  fill={color} transform="translate(-1 -4)"/>
        </Svg>
    );
}
