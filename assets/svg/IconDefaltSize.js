
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

export default function IconDefaltSize(props) {
  return (
    <Svg height="52" id="Button_Defalt" width="50" viewBox="0 0 50 52">
    	<G id="Group_6090" transform="translate(0 5)" data-name="Group 6090">
    		<Rect height="20" id="Rectangle_3708" width="20" fill="none" rx="2" stroke="#4b9fa5" strokeWidth="1.5" transform="translate(15 9.999)" data-name="Rectangle 3708"/>
    		<Line id="Line_135" fill="none" stroke="#4b9fa5" strokeWidth="1.5" transform="translate(15.5 10.5)" x2="19" y1="19" data-name="Line 135"/>
    	</G>
    	<G id="Group_6106" data-name="Group 6106">
    		<Rect height="50" id="Rectangle_3693" width="50" fill="none" data-name="Rectangle 3693"/>
    		<Text id="元のサイズ" fill="#4b9fa5" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="9" transform="translate(3 49)">
    			<TSpan x="0" y="0">元のサイズ</TSpan>
    		</Text>
    	</G>
    </Svg>
  );
}
