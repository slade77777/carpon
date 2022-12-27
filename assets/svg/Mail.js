
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

export default function Mail(props) {
  return (
    <Svg height="16" width="20" viewBox="0 0 20 16">
    	<Defs/>
    	<Path fill={'#CCCCCC'} className="cls-1" id="ic_mail_outline_24px" d="M20,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V6A2.006,2.006,0,0,0,20,4Zm0,14H4V8l8,5,8-5Zm-8-7L4,6H20Z" transform="translate(-2 -4)"/>
    </Svg>
  );
}
