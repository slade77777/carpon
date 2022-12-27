
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

export default function Ban(props) {
  return (
    <Svg height="38" width="38" viewBox="0 0 38 38">
    	<Defs/>
    	<Path style={{ fill: 'white'}} className="cls-1" id="ic_do_not_disturb_alt_24px" d="M21,2A19,19,0,1,0,40,21,19.056,19.056,0,0,0,21,2ZM5.8,21A15.245,15.245,0,0,1,21,5.8a14.974,14.974,0,0,1,9.31,3.23L9.03,30.31A14.974,14.974,0,0,1,5.8,21ZM21,36.2a14.974,14.974,0,0,1-9.31-3.23L32.97,11.69A14.974,14.974,0,0,1,36.2,21,15.245,15.245,0,0,1,21,36.2Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
