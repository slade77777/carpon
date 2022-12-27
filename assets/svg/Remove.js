
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

export default function Remove(props) {
  return (
    <Svg height="18" width="18" fill={props.fill || '#FFFFFF'} viewBox="0 0 13.435 13.435">
    	<Defs/>
    	<G id="Group_424" transform="translate(4.95 -59.397) rotate(45)" data-name="Group 424">
    		<Rect className="cls-1" height="1" id="Rectangle_1633" width="18" rx="0.5" transform="translate(39 45)" data-name="Rectangle 1633"/>
    		<Rect className="cls-1" height="1" id="Rectangle_1634" width="18" rx="0.5" transform="translate(48.5 36.5) rotate(90)" data-name="Rectangle 1634"/>
    	</G>
    </Svg>
  );
}
