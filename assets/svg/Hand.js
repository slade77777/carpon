
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

export default function Hand(props) {
  return (
    <Svg height="28.364" width="26" viewBox="0 0 26 28.364">
    	<Path id="ic_pan_tool_24px" d="M27,6.5V23.636a4.741,4.741,0,0,1-4.727,4.727H13.645a4.719,4.719,0,0,1-3.368-1.406L1,17.526s1.489-1.454,1.536-1.477a1.4,1.4,0,0,1,.934-.343,1.444,1.444,0,0,1,.709.189c.047.012,5.094,2.907,5.094,2.907V4.727a1.773,1.773,0,0,1,3.545,0V13H14V1.773a1.773,1.773,0,0,1,3.545,0V13h1.182V2.955a1.773,1.773,0,0,1,3.545,0V13h1.182V6.5A1.773,1.773,0,1,1,27,6.5Z" fill="#4b9fa5" transform="translate(-1)"/>
    </Svg>
  );
}
