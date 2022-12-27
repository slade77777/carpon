import {PanResponder, Text, TouchableOpacity, View, Platform, Animated, Dimensions, Easing} from "react-native";
import React, {useEffect, useRef, useState} from 'react';
import {HeaderEditTool} from "../HeaderEditTool";
import color from "../../color";
import {imageEditorAction} from "../ImageEditorAction";
import ViewShot from "react-native-view-shot";
import Svg, {Circle, G, Path, ForeignObject} from 'react-native-svg';
import Spinner from 'react-native-loading-spinner-overlay';
import ZoomCircle from "./Hovering/ZoomCircle";
import ZoomInput from "./Hovering/ZoomInput";
import Config from "react-native-config";

const INITIAL_WIDTH = 150;
const INITIAL_HEIGHT = 80;
const INITIAL_DIAMETER = 150;
const animationTime = 300;

export function Hovering({renderImage, saveImage, width, height, imageSize, originalImage}) {

    const [{hoveringParam}, {changeAbility, hoveringZoomTo}] = imageEditorAction();

    const [coordinate, setCoordinate] = useState({p1: {x: 0, y: 0}, p2: {x: 0, y: 0}, p3: {x: 0, y: 0}, p4: {x: 0, y: 0}});
    const [showDot, setShowDot] = useState(true);
    const [isLoading, setLoading] = useState(false);

    function DefaultCoordinate(imageSize) {
        const _width = imageSize.width;
        const _height = imageSize.height;

        return  {
            p1: {x: (_width - INITIAL_WIDTH) / 2, y: (_height - INITIAL_HEIGHT) / 2},
            p2: {x: (_width - INITIAL_WIDTH) / 2 + INITIAL_WIDTH, y: (_height - INITIAL_HEIGHT) / 2},
            p3: {x: (_width - INITIAL_WIDTH) / 2 + INITIAL_WIDTH, y: (_height - INITIAL_HEIGHT) / 2 + INITIAL_HEIGHT},
            p4: {x: (_width - INITIAL_WIDTH) / 2, y: (_height - INITIAL_HEIGHT) / 2 + INITIAL_HEIGHT},
        };
    }

    function convertCoordinate(CoordinateRaw, ratio) {
        return {
            p1: {x: CoordinateRaw[0].x * ratio, y: CoordinateRaw[0].y * ratio},
            p2: {x: CoordinateRaw[1].x * ratio, y: CoordinateRaw[1].y * ratio},
            p3: {x: CoordinateRaw[2].x * ratio, y: CoordinateRaw[2].y * ratio},
            p4: {x: CoordinateRaw[3].x * ratio, y: CoordinateRaw[3].y * ratio}
        };
    }
    const pointNames = ['p1', 'p2', 'p3', 'p4'];

    useEffect(()=>{
        originalImage.uri && setCarPlateCoordinates()
    }, []);

    const setCarPlateCoordinates = () => {
        const data = new FormData();
        data.append('image', {
            uri: originalImage.uri,
            type: 'image/jpeg',
            name: 'avatar'
        });
        setLoading(true);
        fetch(Config.OPENALPR_LINK, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            timeout: 10000,
            body: data
        })
            .then(response => response.json())
            .then((responseData) => {
                setLoading(false);
                if (responseData.results && responseData.results[0]) {
                    const result = responseData.results[0];
                    if (result && result.confidence > 0.7) {
                        const ratio = imageSize.width / responseData.img_width;
                        setCoordinate(convertCoordinate(result.coordinates, ratio));
                    }
                }else {
                    setCoordinate(DefaultCoordinate(imageSize));
                }
            })
            .catch((error) => {
                setCoordinate(DefaultCoordinate(imageSize));
                setLoading(false);
            });
    };

    const [draggingPoint, setDraggingPoint] = useState(null);
    const [opacity, setOpacity] = useState(false);
    const [page, setPage] = useState({x: 0, y: 0});
    const responders = pointNames.map((pointName) => {
        return {
            pointName,
            responder: PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (event, gesture) => {
                    saveOneCoordinate(gesture, pointName);
                    setDraggingPoint(pointName);
                    setOpacity(true);
                    setPage({x: event.nativeEvent.pageX, y: event.nativeEvent.pageY})
                },
                onPanResponderGrant: (event, gesture) => {
                    saveOneCoordinate(gesture, pointName)
                },
                onPanResponderRelease: (event, gesture) => {
                    saveOneCoordinate(gesture, pointName);
                    setDraggingPoint(null);
                    setOpacity(false)
                }
            })
        };
    });

    const saveOneCoordinate = (gesture, param) => {
        const cor = {
            x: coordinate[param].x + (gesture.dx / hoveringParam.scale),
            y: coordinate[param].y + (gesture.dy / hoveringParam.scale)
        };
        setCoordinate({...coordinate, [param]: {...cor}});
    };

    const shapeResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            saveAllCoordinate(event, gesture);
            setOpacity(true)
        },
        onPanResponderGrant: (event, gesture) => saveAllCoordinate(event, gesture),
        onPanResponderRelease: (event, gesture) => {
            saveAllCoordinate(event, gesture);
            setOpacity(false)
        }
    });

    const saveAllCoordinate = (event, gesture) => {
        setCoordinate({
            p1: {
                x: coordinate.p1.x + (gesture.dx / hoveringParam.scale),
                y: coordinate.p1.y + gesture.dy / hoveringParam.scale
            },
            p2: {
                x: coordinate.p2.x + gesture.dx / hoveringParam.scale,
                y: coordinate.p2.y + gesture.dy / hoveringParam.scale
            },
            p3: {
                x: coordinate.p3.x + gesture.dx / hoveringParam.scale,
                y: coordinate.p3.y + gesture.dy / hoveringParam.scale
            },
            p4: {
                x: coordinate.p4.x + gesture.dx / hoveringParam.scale,
                y: coordinate.p4.y + gesture.dy / hoveringParam.scale
            },
        });
    };

    const hoverImageRef = useRef(null);

    const handleSave = () => {
        setShowDot(false);
        AnimationX();
        AnimationY();
        AnimationScale();
    };

    //animation
    const animatedScale = new Animated.Value(hoveringParam.scale);
    const animatedTranslationX = new Animated.Value(hoveringParam.translate.x);
    const animatedTranslationY = new Animated.Value(hoveringParam.translate.y);
    function AnimationScale() {
        Animated.timing(
            animatedScale,
            {
                toValue: 1,
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(()=>{
            hoveringZoomTo({x: 0, y: 0}, 1);
            hoverImageRef.current.capture().then(uri => {
                saveImage(uri);
                changeAbility(null);
            });
        })
    }

    function AnimationX() {
        Animated.timing(
            animatedTranslationX,
            {
                toValue: 0,
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start()
    }

    function AnimationY() {
        Animated.timing(
            animatedTranslationY,
            {
                toValue: 0,
                duration: animationTime,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start()
    }

    const viewBox = `0 0 ${imageSize.width} ${imageSize.height}`;
    const {p1, p2, p3, p4} = coordinate;
    const path = `M${p1.x} ${p1.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} L${p4.x} ${p4.y} Z`;

    return (
        <View style={{width, height}}>
            <Spinner
                visible={isLoading}
                textContent={null}
                textStyle={{color: 'white'}}
            />
            {
                HeaderEditTool({
                    changeAbility,
                    resetAction: () => {
                        hoveringZoomTo({x: 0, y: 0}, 1)
                    },
                    saveImage: () => {
                        handleSave()
                    },
                })
            }
            <View style={{width, height: height - 40, alignItems: 'center', justifyContent: 'center'}}>
                <ViewShot ref={hoverImageRef} options={{format: "jpg", quality: 0.9}}
                          style={{backgroundColor: '#000', width: imageSize.width, height: imageSize.height}}>
                    <Animated.View style={[
                        {
                            transform: [
                                {translateX: animatedTranslationX}, {translateY: animatedTranslationY},
                                {scale: animatedScale},
                            ]
                        }]}>
                        <View style={{position: 'absolute', left: 0, top: 0, flex: 1, zIndex: 3}}>
                            {
                                Platform.OS === 'ios'&&
                                <ZoomInput>
                                    <View style={{
                                        width: imageSize.width ,
                                        height: imageSize.height,
                                        position: 'absolute',
                                        zIndex: 0,
                                    }}/>
                                </ZoomInput>
                            }

                            <Svg height={imageSize.height} width={imageSize.width} viewBox={viewBox} fill={'#FFF'}
                                 preserveAspectRatio="xMidYMid meet">
                                {
                                    Platform.OS === 'android' &&
                                    <ForeignObject height={imageSize.height} width={imageSize.width}>
                                        <ZoomInput>
                                            <View style={{
                                                width: imageSize.width,
                                                height: imageSize.height,
                                                zIndex: 0
                                            }}/>
                                        </ZoomInput>
                                    </ForeignObject>
                                }
                                {
                                    !isLoading &&
                                    <G>
                                        <Path {...shapeResponder.panHandlers} d={path}
                                              fillOpacity={opacity ? 0.7 : 1}
                                              strokeWidth={showDot ? 1 : 0}
                                              stroke={color.active}/>
                                        {
                                            showDot && (
                                                <G>
                                                    <G>
                                                        <Circle cx={p1.x} cy={p1.y} r={10 / hoveringParam.scale} fill={color.active}/>
                                                        <Circle cx={p2.x} cy={p2.y} r={10 / hoveringParam.scale} fill={color.active}/>
                                                        <Circle cx={p3.x} cy={p3.y} r={10 / hoveringParam.scale} fill={color.active}/>
                                                        <Circle cx={p4.x} cy={p4.y} r={10 / hoveringParam.scale} fill={color.active}/>
                                                    </G>
                                                    <G>
                                                        {responders.map(({responder, pointName}, key) =>
                                                            <Circle key={key} {...responder.panHandlers}
                                                                    cx={coordinate[pointName].x}
                                                                    cy={coordinate[pointName].y} r={20} opacity={0}/>)}
                                                    </G>
                                                </G>
                                            )
                                        }
                                    </G>
                                }
                            </Svg>
                            {
                                draggingPoint &&
                                <View
                                    style={{
                                        width: INITIAL_DIAMETER / hoveringParam.scale,
                                        height: INITIAL_DIAMETER / hoveringParam.scale,
                                        left: validX(coordinate[draggingPoint],hoveringParam.scale),
                                        top: validY(coordinate[draggingPoint], page, hoveringParam.scale),
                                        position: 'absolute',
                                        borderRadius: INITIAL_DIAMETER / (2 * hoveringParam.scale),
                                        overflow: 'hidden',
                                        backgroundColor: '#000'
                                    }}>
                                    <ZoomCircle
                                        zoomRatio={2 * hoveringParam.scale} viewPort={150}
                                        draggingPoint={coordinate[draggingPoint]}
                                        points={coordinate}
                                        path={path}
                                        originalImage={originalImage}
                                        imageSize={imageSize}/>
                                </View>
                            }
                        </View>
                            {renderImage}
                    </Animated.View>

                </ViewShot>
                <View style={{
                    paddingHorizontal: 5,
                    position: 'absolute',
                    bottom: 50,
                    zIndex: 10,
                    width,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View/>
                    <TouchableOpacity onPress={() => setCoordinate(DefaultCoordinate(imageSize))}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14, lineHeight: 17}}>元の位置に戻す</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function validX(position, scale) {
    return position.x - (INITIAL_DIAMETER / 2 / scale)
}

function validY(positionPoint, localPosition,  scale) {

    if(localPosition.y < ((INITIAL_DIAMETER + 75) / scale)){
        return (positionPoint.y + ((INITIAL_DIAMETER - 50)/ scale))
    }
    else {
        return (positionPoint.y - ((INITIAL_DIAMETER + 50)/ scale))
    }
}
