
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

export default function TabReview(props) {
  return (
    <Svg height="20" width="20" fill={props.disable ? "#666666" : "#fff"} viewBox="0 0 20 20">
    	<Defs/>
    	<Path className="cls-1" id="ic_message_24px" d="M20,2H4A2,2,0,0,0,2.01,4L2,22l4-4H20a2.006,2.006,0,0,0,2-2V4A2.006,2.006,0,0,0,20,2ZM18,14H6V12H18Zm0-3H6V9H18Zm0-3H6V6H18Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
