
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

export default function OtherIconLicense(props) {
  return (
    <Svg height="20" width="25" viewBox="0 0 25 20" fill={props.fill}>
    	<Defs/>
    	<Path className="cls-1" id="ic_credit_card_24px" d="M24.5,4H4.5A2.481,2.481,0,0,0,2.012,6.5L2,21.5A2.491,2.491,0,0,0,4.5,24h20A2.491,2.491,0,0,0,27,21.5V6.5A2.491,2.491,0,0,0,24.5,4Zm0,17.5H4.5V14h20ZM24.5,9H4.5V6.5h20Z" transform="translate(-2 -4)"/>
    </Svg>
  );
}
