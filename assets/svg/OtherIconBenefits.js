
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

export default function OtherIconBenefits(props) {
  return (
    <Svg height="23.75" width="25" viewBox="0 0 25 23.75" fill={props.fill}>
    	<Defs/>
    	<Path className="cls-1" id="ic_card_giftcard_24px" d="M24.5,7H21.775a3.741,3.741,0,0,0-6.65-3.313l-.625.838-.625-.85A3.742,3.742,0,0,0,7.225,7H4.5A2.481,2.481,0,0,0,2.012,9.5L2,23.25a2.491,2.491,0,0,0,2.5,2.5h20a2.491,2.491,0,0,0,2.5-2.5V9.5A2.491,2.491,0,0,0,24.5,7ZM18.25,4.5A1.25,1.25,0,1,1,17,5.75,1.254,1.254,0,0,1,18.25,4.5Zm-7.5,0A1.25,1.25,0,1,1,9.5,5.75,1.254,1.254,0,0,1,10.75,4.5ZM24.5,23.25H4.5v-2.5h20Zm0-6.25H4.5V9.5h6.35l-2.6,3.537L10.275,14.5l2.975-4.05,1.25-1.7,1.25,1.7,2.975,4.05,2.025-1.463L18.15,9.5H24.5Z" transform="translate(-2 -2)"/>
    </Svg>
  );
}
