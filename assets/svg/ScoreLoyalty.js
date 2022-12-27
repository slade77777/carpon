
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

export default function ScoreLoyalty(props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 30 30" fill={'#CCCCCC'}>
    	<Defs/>
    	<Path className="cls-1" id="ic_loyalty_24px" d="M31.115,16.37l-13.5-13.5A2.981,2.981,0,0,0,15.5,2H5A3.009,3.009,0,0,0,2,5V15.5a2.993,2.993,0,0,0,.885,2.13l13.5,13.5A2.981,2.981,0,0,0,18.5,32a2.933,2.933,0,0,0,2.115-.885l10.5-10.5A2.933,2.933,0,0,0,32,18.5,3.03,3.03,0,0,0,31.115,16.37ZM7.25,9.5A2.25,2.25,0,1,1,9.5,7.25,2.247,2.247,0,0,1,7.25,9.5ZM24.905,21.905,18.5,28.31l-6.405-6.4A3.755,3.755,0,0,1,14.75,15.5a3.7,3.7,0,0,1,2.655,1.11L18.5,17.69l1.095-1.1a3.755,3.755,0,0,1,5.31,5.31Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
