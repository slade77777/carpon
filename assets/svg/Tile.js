
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

export default function Tile(props) {
  return (
    <Svg height="18" width="18" viewBox="0 0 18 18">
    	<Defs/>
    	<Path className="cls-1" id="ic_album_24px" d="M11,2a9,9,0,1,0,9,9A9,9,0,0,0,11,2Zm0,13.05A4.05,4.05,0,1,1,15.05,11,4.045,4.045,0,0,1,11,15.05Zm0-4.95a.9.9,0,1,0,.9.9A.9.9,0,0,0,11,10.1Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
