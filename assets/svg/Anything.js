
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

export default function Anything(props) {
  return (
    <Svg height="24" width="24" viewBox="0 0 24 24">
    	<Defs/>
    	<G id="btn_anything" clipPath="url(#clip-path)">
    		<Path id="Path_1236" d="M2,0H22a2,2,0,0,1,2,2V22a2,2,0,0,1-2,2H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0Z" fill="#fff" data-name="Path 1236"/>
    		<Path id="ic_more_horiz_24px" d="M6,10a2,2,0,1,0,2,2A2.006,2.006,0,0,0,6,10Zm12,0a2,2,0,1,0,2,2A2.006,2.006,0,0,0,18,10Zm-6,0a2,2,0,1,0,2,2A2.006,2.006,0,0,0,12,10Z" fill="#ccc"/>
    	</G>
    </Svg>
  );
}
