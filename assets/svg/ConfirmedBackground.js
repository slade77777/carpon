
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
  Stop,
	TSpan
} from 'react-native-svg';

export default function ConfirmedBackground(props) {
	const defaultSize = {width: 375, height: 667};
    const ScreenSize = props.width ? props : defaultSize;

    return (
    <Svg height={ScreenSize.height} width={ScreenSize.width}>
    	<Defs/>
    	<G id="XXX_マイカー登録完了スプラッシュ_7" clipPath="url(#clip-XXX_マイカー登録完了スプラッシュ_7)" data-name="XXX_マイカー登録完了スプラッシュ – 7">
    		<Rect height={ScreenSize.height} width={ScreenSize.width} fill="#4b9fa5"/>
    		<Circle id="Ellipse_384" x={ScreenSize.width / 2} y={ScreenSize.height / 2 - (0.0655 * ScreenSize.height)}  fill="#fff" r="130"  data-name="Ellipse 384"/>
    		<G id="Group_5423" x={ScreenSize.width / 2 - 43.0625} y={ScreenSize.height / 2 - (0.0655 * ScreenSize.height) - 79.5} data-name="Group 5423">
    			<Rect height="159" id="Rectangle_3578" width="86.125" fill="#fff" rx="9.275" transform="translate(0 0)" data-name="Rectangle 3578"/>
    			<Path id="Path_4340" d="M771.287,310H717.643L761.99,469h9.3a9.276,9.276,0,0,0,9.276-9.275V319.275A9.276,9.276,0,0,0,771.287,310Z" fill="#666" opacity="0.1" data-name="Path 4340"/>
    			<Rect height="110.45" id="Rectangle_3579" width="86.125" fill="#c1e6eb" transform="translate(0 22)" data-name="Rectangle 3579"/>
    			<G id="Rectangle_3580" fill="none" stroke="#666" strokeWidth="3" transform="translate(0 0)" data-name="Rectangle 3580">
    				<Rect height="159" width="86.125" rx="9.275" stroke="none"/>
    				<Rect height="156" width="83.125" fill="none" rx="7.775" x="1.5" y="1.5"/>
    			</G>
    			<Line id="Line_153" fill="none" stroke="#666" strokeWidth="3" transform="translate(0 22)" x2="86.125" data-name="Line 153"/>
    			<Line id="Line_154" fill="none" stroke="#666" strokeWidth="3" transform="translate(0 132)" x2="86.125" data-name="Line 154"/>
    			<Line id="Line_155" fill="none" stroke="#666" strokeLinecap="round" strokeWidth="3" transform="translate(35 12)" x2="15.9" data-name="Line 155"/>
    			<G id="Ellipse_385" fill="none" stroke="#666" strokeWidth="3" transform="translate(37 139)" data-name="Ellipse 385">
    				<Circle x="5.962" y="5.962" r="5.962" stroke="none"/>
    				<Circle x="5.962" y="5.962" fill="none" r="4.462"/>
    			</G>
    		</G>
    	</G>
    </Svg>
  );
}
