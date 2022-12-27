
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

export default function OtherIconReview(props) {
  return (
    <Svg height="25" width="25" viewBox="0 0 25 25" fill={props.fill}>
    	<Defs/>
    	<Path className="cls-1" id="ic_message_24px" d="M24.5,2H4.5A2.5,2.5,0,0,0,2.012,4.5L2,27l5-5H24.5A2.507,2.507,0,0,0,27,19.5V4.5A2.507,2.507,0,0,0,24.5,2ZM22,17H7V14.5H22Zm0-3.75H7v-2.5H22ZM22,9.5H7V7H22Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
