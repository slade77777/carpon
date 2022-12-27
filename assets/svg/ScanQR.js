
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

export default function ScanQR(props) {
  return (
    <Svg height="40" width="40" fill="#83c0c5" viewBox="0 0 50 50">
    	<Defs/>
    	<Path className="cls-1" id="Path_792" d="M0,18H18V0H0ZM2,2H16V16H2ZM4,14H14V4H4ZM6,6h6v6H6ZM0,50H18V32H0ZM2,34H16V48H2ZM4,46H14V36H4Zm2-8h6v6H6ZM32,0V18H50V0ZM48,16H34V2H48ZM46,4H36V14H46Zm-2,8H38V6h6ZM4,24H0v2H4Zm4,2H18V24H8Zm16,6h4V13H24V8h3V6H22v9h4v3H22v2h4v4H22v2h4v4H22v8h2ZM27,0H22V2h5ZM41,20H39v4H32V42H22v8h2V44h8v6h2V44h8V37h8V35H40v7H34V33h7V26h9V24H41ZM39,31H34V26h5Zm1,19H50V48H40Z" data-name="Path 792"/>
    </Svg>
  );
}
