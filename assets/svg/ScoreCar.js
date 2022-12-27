
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

export default function ScoreCar(props) {
  return (
    <Svg height="26.667" width="30" viewBox="0 0 30 26.667" fill={'#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_directions_car_24px" d="M29.533,6.683A2.49,2.49,0,0,0,27.167,5H8.833A2.506,2.506,0,0,0,6.467,6.683L3,16.667V30a1.672,1.672,0,0,0,1.667,1.667H6.333A1.672,1.672,0,0,0,8,30V28.333H28V30a1.672,1.672,0,0,0,1.667,1.667h1.667A1.672,1.672,0,0,0,33,30V16.667Zm-20.7,16.65a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,8.833,23.333Zm18.333,0a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,27.167,23.333ZM6.333,15l2.5-7.5H27.167l2.5,7.5Z" transform="translate(-3 -5)"/>
    </Svg>
  );
}
