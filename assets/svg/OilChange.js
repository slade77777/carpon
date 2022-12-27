
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

export default function OilChange(props) {
  return (
    <Svg height="20" width="20" viewBox="0 0 14.4 16">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_local_drink_24px" d="M3,2,4.608,16.584A1.6,1.6,0,0,0,6.2,18h8a1.6,1.6,0,0,0,1.592-1.416L17.4,2Zm7.2,13.6a2.4,2.4,0,0,1-2.4-2.4c0-1.6,2.4-4.32,2.4-4.32s2.4,2.72,2.4,4.32A2.4,2.4,0,0,1,10.2,15.6Zm5.064-8.8H5.136L4.784,3.6H15.608Z" transform="translate(-3 -2)"/>
    </Svg>
  );
}
