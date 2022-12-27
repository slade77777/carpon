import {TouchableOpacity, View, StyleSheet, PanResponder, Animated, ScrollView, Platform} from "react-native";
import React, {useState, useRef, useEffect} from 'react';
import {HeaderEditTool} from "../HeaderEditTool";
import {SvgImage, SvgViews} from "../../../components/Common/SvgImage";
import Svg, {
    Circle,
    G,
    Path,
} from 'react-native-svg';
import {imageEditorAction} from "../ImageEditorAction";
import ViewShot from "react-native-view-shot";

const listAction = [
    {
        color: '#68C12C',
        style: {},
    },
    {
        color: '#FFFFFF',
        style: {},
    },
    {
        color: '#FF0000',
        style: {},
    },
    {
        color: '#FF7F00',
        style: {},
    },
    {
        color: '#EBD424',
        style: {},
    },
    {
        color: '#349CE8',
        style: {},
    },
    {
        color: '#1340BA',
        style: {},
    },
    {
        color: '#ff66cc',
        style: {},
    },
    {
        color: '#cccc00',
        style: {},
    },
    {
        color: '#00ff99',
        style: {},
    },
];

export class Pen {
    constructor(strokes) {
        this.strokes = strokes || [];
        this._offsetX = 0;
        this._offsetY = 0;
    }

    rewindStroke() {
        if (this.strokes.length < 1) return;
        this.strokes.pop()
    }

    addStroke(points) {
        if (points.length > 0) {
            this.strokes.push(points);
        }
    }

    pointsToSvg(points) {
        if (points.length > 0) {
            let path = `M ${points[0].x},${points[0].y}`;
            points.forEach((point) => {
                path = path + ` L ${point.x},${point.y}`
            });
            return path;
        } else {
            return ''
        }
    }

    clear = () => {
        this.strokes = []
    }
}

export function PenTool({renderImage, imageSize, activated, saveImage, width, height}) {

    const TextSizeDefault = 5;
    const headerSpace = 40;
    const [editorState, {changeImageSie, changeAbility}] = imageEditorAction();

    const [status, setStatus] = useState('#68C12C');
    const [currentPoints, setCurrentPoints] = useState([]);
    const [strokeWidth, setStrokeWidth] = useState(TextSizeDefault);
    const [previousStrokes, setPreviousStrokes] = useState([]);
    const [strokeEnd, setStrokeEnd] = useState([0]);
    const [penning, setPenning] = useState(false);
    let imageHeight = imageSize.height;
    let imageWidth = imageSize.width;

    const pen = new Pen();
    const penToolRef = useRef(null);

    const _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gs) => true,
        onMoveShouldSetPanResponder: (evt, gs) => true,
        onPanResponderGrant: (evt, gs) => onResponderGrant(evt, gs),
        onPanResponderMove: (evt, gs) => onResponderMove(evt, gs),
        onPanResponderRelease: (evt, gs) => onResponderRelease(evt, gs)
    });

    const _rulerResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gs) => true,
        onMoveShouldSetPanResponder: (evt, gs) => true,
        onPanResponderGrant: (evt) => saveTextSize(evt),
        onPanResponderMove: (evt) => saveTextSize(evt),
        onPanResponderRelease: (evt) => saveTextSize(evt)
    });

    const platformChecker = (location, page) => {
        return Platform.OS === 'android' ? page : location
    };

    const newImagePositioncalculator = (edge) => {
        switch (edge) {
            case 'width':
                return (width - imageWidth) / 2;
            case 'height':
                return (height - imageHeight) / 2;
            default:
                return 0;
        }
    };

    const saveTextSize = (evt) => {

        const maxLocationY = height / 2 + 94.9645;
        const minLocationY = height / 2 - 94.9645;

        if (Platform.OS === 'android' && evt.nativeEvent.pageY >= minLocationY && evt.nativeEvent.pageY <= maxLocationY) {
            setStrokeWidth((maxLocationY - evt.nativeEvent.pageY) / 8);
        }
        if (Platform.OS === 'ios' && evt.nativeEvent.locationY >= 0 && evt.nativeEvent.locationY <= 174.929) {
            setStrokeWidth((174.929 - evt.nativeEvent.locationY) / 8);
        }
    };

    const onTouch = (evt) => {
        let x, y, timestamp;
        [x, y, timestamp] = [platformChecker(evt.nativeEvent.locationX, evt.nativeEvent.pageX - newImagePositioncalculator('width')), platformChecker(evt.nativeEvent.locationY, evt.nativeEvent.pageY - headerSpace / 2 - newImagePositioncalculator('height')), evt.nativeEvent.timestamp];
        let newPoint = {x, y, time: timestamp};
        let newCurrentPoints = currentPoints;
        newCurrentPoints.push(newPoint);
        setCurrentPoints(newCurrentPoints)
    };

    const onResponderGrant = (evt) => {
        onTouch(evt);
        setPenning(true)
    };

    const onResponderMove = (evt) => {
        onTouch(evt);
        if (evt.nativeEvent.locationY < 5) {
            onResponderRelease([]);
        } else {
            displayPath();
        }
    };

    const onResponderRelease = () => {
        strokeEnd.push(previousStrokes.length + 1);
        displayPath();
        setCurrentPoints([]);
        setPenning(false)
    };


    const rewind = () => {
        if (currentPoints.length > 0 || previousStrokes.length < 1 || strokeEnd.length === 1) return;
        let strokes = previousStrokes;
        for (let i = 0; i <= (strokeEnd[strokeEnd.length - 1] - strokeEnd[strokeEnd.length - 2]) - 1; i++) {
            strokes.pop();
            pen.rewindStroke();
        }
        setPreviousStrokes([...strokes]);
        strokeEnd.pop();
        setCurrentPoints([]);
    };

    const displayPath = () => {
        if (currentPoints.length < 1) return;

        let points = currentPoints;
        if (points.length === 1) {
            let p = points[0];
            points.push({x: p.x + 1, y: p.y + 1, time: p.time});
        }

        let newElement = {
            type: 'Path',
            attributes: {
                d: pen.pointsToSvg(points),
                stroke: status,
                strokeWidth: strokeWidth,
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }
        };

        pen.addStroke(points);
        setPreviousStrokes([...previousStrokes, newElement]);
    };

    const _renderSvgElement = (e, tracker) => {
        if (e.type === 'Path') {
            return <Path {...e.attributes} key={tracker}/>
        }

        return null
    };

    const resetImage = () => {
        setCurrentPoints([]);
        setPreviousStrokes([]);
    };

    const captureImage = () => {
        penToolRef.current.capture().then(uri => {
            saveImage(uri);
            changeAbility(null);
            resetImage();
        });
    };

    function covertPositionY(strokeWidth) {
        const cY = 174.929 - ((strokeWidth) * 8);

        if (cY < 14) {
            return 14
        } else if (cY > 174) {
            return 174
        } else {
            return cY
        }

    }

    return (
        <View style={{width, height}}>
            {
                activated && HeaderEditTool({
                    resetAction: () => resetImage(),
                    saveImage: () => captureImage(),
                    changeAbility,
                    centerComponent: () => (<TouchableOpacity style={{width: 40, height: 40}} onPress={() => rewind()}>
                        <SvgImage source={SvgViews.RollBack}/>
                    </TouchableOpacity>)
                })
            }
            <View style={{width, height: height - headerSpace, alignItems: 'center', justifyContent: 'center'}}>
                <ViewShot ref={penToolRef} options={{format: "jpg", quality: 0.9}}
                          style={{backgroundColor: 'white', width: imageSize.width, height: imageSize.height}}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: imageWidth,
                        height: imageHeight,
                        zIndex: 3,
                    }}>
                        <Animated.View
                            style={{flex: 1}}
                            {..._panResponder.panHandlers}>
                            <Svg style={styles.drawSurface}>
                                <G>
                                    {previousStrokes.map((stroke, index) => {
                                        return _renderSvgElement(stroke, index)
                                    })}
                                </G>
                            </Svg>
                        </Animated.View>
                    </View>
                    {renderImage}
                </ViewShot>
            </View>
            {
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: height / 2 - 70,
                        zIndex: 8,
                        left: 10,
                        width: 30,
                        height: 188.929
                    }}
                    {..._rulerResponder.panHandlers}
                >
                    <Svg height="188.929" width="30" viewBox="0 0 23 188.929">
                        <Path id="Polygon_1" d="M11.5,0,23,188.929H0Z" fill="#fff" opacity="0.6"
                              transform="translate(23 188.929) rotate(180)" data-name="Polygon 1"/>
                        <Circle cx={11.5} cy={covertPositionY(strokeWidth)} r="15" fill="white"/>
                    </Svg>
                </Animated.View>
            }

            {
                <ScrollView style={{
                    paddingHorizontal: 5,
                    position: 'absolute', bottom: 50, zIndex: 10,
                    width
                }} contentContainerStyle={{paddingBottom: 20}} horizontal={true}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {
                            listAction.map((action, index) => {
                                if (action.color === status) {
                                    return (
                                        <View style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 18,
                                            backgroundColor: '#666666',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }} key={index}>
                                            <SvgImage source={() => SvgViews.IconEdit({
                                                fill: action.color,
                                                width: 18,
                                                height: 18
                                            })}/>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <TouchableOpacity style={{
                                            width: 50,
                                            height: 50,
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                                          onPress={() => setStatus(action.color)} key={index}>
                                            <View style={{
                                                width: 20,
                                                height: 20,
                                                backgroundColor: action.color,
                                                borderRadius: 10
                                            }}/>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </View>
                </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        height: 30,
        width: 30,
        backgroundColor: "blue",
        borderRadius: 5
    },
    drawContainer: {
        flex: 1,
        display: 'flex',
    },
    svgContainer: {
        flex: 1,
    },
    drawSurface: {
        flex: 1,
    },
});
