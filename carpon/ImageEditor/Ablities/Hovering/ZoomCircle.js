import React from 'react';
import Svg, {Circle, G, Image, Path} from 'react-native-svg';
import {imageEditorAction} from "../../ImageEditorAction";
import color from "../../../color";

export default function ZoomCircle({imageSize, points :{ p1, p2, p3, p4}, path, zoomRatio, viewPort, draggingPoint, originalImage}) {

    const viewBoxSize = viewPort / zoomRatio;

    // const [editorState, {}] = imageEditorAction();
    const viewBox = `${draggingPoint.x - viewBoxSize / 2} ${draggingPoint.y - viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`;
    return (
            <Svg viewBox={viewBox}>
                <Image href={originalImage} width={imageSize.width } height={imageSize.height}/>
                <G>
                    <Path d={path} stroke={color.active} strokeWidth={2 / zoomRatio}/>
                    {
                        <G>
                            <Circle cx={p1.x} cy={p1.y} r={10 / zoomRatio} fill={color.active}/>
                            <Circle cx={p2.x} cy={p2.y} r={10 / zoomRatio} fill={color.active}/>
                            <Circle cx={p3.x} cy={p3.y} r={10 / zoomRatio} fill={color.active}/>
                            <Circle cx={p4.x} cy={p4.y} r={10 / zoomRatio} fill={color.active}/>
                        </G>
                    }
                </G>
            </Svg>


    )
}
