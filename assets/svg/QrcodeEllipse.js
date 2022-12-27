
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

export default function QrcodeEllipse(props) {
  return (
    <Svg height="30" width="30" viewBox="0 0 30 30">
    	<G id="Ellipse_372" fill="none" stroke="#f37b7d" strokeWidth="3" data-name="Ellipse 372">
    		<Circle x="15" y="15" r="15" stroke="none"/>
    		<Circle x="15" y="15" fill="none" r="13.5"/>
    	</G>
    </Svg>
  );
}
