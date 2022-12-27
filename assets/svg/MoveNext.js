
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

export default function MoveNext(props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 30 30">
    	<Defs/>
    	<G id="_blankボタン" clipPath="url(#clip-path)">
    		<Rect height="30" id="Rectangle_1616" width="30" fill={"none"} rx="2" data-name="Rectangle 1616"/>
    		<Path id="ic_launch_24px" d="M19,19H5V5h7V3H5A2,2,0,0,0,3,5V19a2,2,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V12H19ZM14,3V5h3.59L7.76,14.83l1.41,1.41L19,6.41V10h2V3Z" fill={props.fill || "#ccc"} transform="translate(3 3)"/>
    	</G>
    </Svg>
  );
}
