
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

export default function ScoreStore(props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 30 30" fill={'#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_local_grocery_store_24px" d="M10,26a3,3,0,1,0,3,3A3,3,0,0,0,10,26ZM1,2V5H4L9.4,16.385,7.375,20.06A2.9,2.9,0,0,0,7,21.5a3.009,3.009,0,0,0,3,3H28v-3H10.63a.371.371,0,0,1-.375-.375l.045-.18L11.65,18.5H22.825a2.986,2.986,0,0,0,2.625-1.545L30.82,7.22A1.466,1.466,0,0,0,31,6.5,1.5,1.5,0,0,0,29.5,5H7.315L5.9,2H1ZM25,26a3,3,0,1,0,3,3A3,3,0,0,0,25,26Z" transform="translate(-1 -2)"/>
    </Svg>
  );
}
