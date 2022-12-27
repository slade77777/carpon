
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

export default function LicenseDate(props) {
  return (
    <Svg height="16" width="20" viewBox="0 0 20 16">
    	<Defs/>
    	<Path style={{fill: props.color || 'black'}} className="cls-1" id="ic_credit_card_24px" d="M20,4H4A1.985,1.985,0,0,0,2.01,6L2,18a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V6A1.993,1.993,0,0,0,20,4Zm0,14H4V12H20ZM20,8H4V6H20Z" transform="translate(-2 -4)"/>
    </Svg>
  );
}
