
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

export default function Watch(props) {
  return (
    <Svg height="100" width="100" viewBox="0 0 100 100">
    	<Defs/>
    	<Path fill={'#CCCCCC'} className="cls-1" id="ic_watch_later_24px" d="M52,2a50,50,0,1,0,50,50A50.147,50.147,0,0,0,52,2ZM73,73,47,57V27h7.5V53L77,66.5,73,73Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
