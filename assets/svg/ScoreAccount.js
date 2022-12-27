
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

export default function ScoreAccount(props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 30 30" fill={'#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_account_box_24px" d="M3,6.333V29.667A3.332,3.332,0,0,0,6.333,33H29.667A3.343,3.343,0,0,0,33,29.667V6.333A3.343,3.343,0,0,0,29.667,3H6.333A3.332,3.332,0,0,0,3,6.333ZM23,13a5,5,0,1,1-5-5A4.993,4.993,0,0,1,23,13ZM8,26.333C8,23,14.667,21.167,18,21.167S28,23,28,26.333V28H8Z" transform="translate(-3 -3)"/>
    </Svg>
  );
}
