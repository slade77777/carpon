
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

export default function ArrowUp(props) {
  return (
    <Svg height="11" width="20" viewBox="0 0 20 11">
    	<G id="icon_arrow" transform="translate(20) rotate(90)">
    		<Path id="icon_arrow_white" d="M10.013,0,0,10.071,10.013,20,11,19.007,1.974,10.071,11,.993Z" fill="#4b9fa5" fillRule="evenodd"/>
    	</G>
    </Svg>
  );
}
