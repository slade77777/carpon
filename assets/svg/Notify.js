
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

export default function Notify(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 20 20">
    	<Path id="ic_sms_failed_24px" d="M20,2H4A2,2,0,0,0,2.01,4L2,22l4-4H20a2.006,2.006,0,0,0,2-2V4A2.006,2.006,0,0,0,20,2ZM13,14H11V12h2Zm0-4H11V6h2Z" fill="#ccc" transform="translate(-2 -2)"/>
    </Svg>
  );
}
