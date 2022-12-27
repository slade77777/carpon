
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

export default function TabCarLife(props) {
  return (
    <Svg height="18" width="18" fill={props.disable ? "#666666" : "#fff"} viewBox="0 0 18 18">
    	<Defs/>
    	<Path className="cls-1" id="ic_assessment_24px" d="M19,3H5A2.006,2.006,0,0,0,3,5V19a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3ZM9,17H7V10H9Zm4,0H11V7h2Zm4,0H15V13h2Z" transform="translate(-3 -3)"/>
    </Svg>
  );
}
