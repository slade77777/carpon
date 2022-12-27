
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

export default function CheckCircle(props) {
  return (
    <Svg height="30.858" width="30.857" viewBox="0 0 30.857 30.858">
    	<G id="Group_5944" transform="translate(-45 -610)" data-name="Group 5944">
    		<Circle id="Ellipse_370" x="15.429" y="15.429" fill="#fff" r="15.429" transform="translate(45 610)" data-name="Ellipse 370"/>
    		<G id="登録完了アイコン" transform="translate(45 610)">
    			<Path id="Path_4134" d="M190.832,601.029a15.428,15.428,0,1,0,15.429,15.429A15.429,15.429,0,0,0,190.832,601.029Zm-1.607,21.237-5.786-5.553,1.795-1.845,3.957,3.776,7.849-7.994,1.827,1.812Z" fill={props.fill} transform="translate(-175.403 -601.029)" data-name="Path 4134"/>
    		</G>
    	</G>
    </Svg>
  );
}
