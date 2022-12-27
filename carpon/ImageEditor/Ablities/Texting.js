import {
    Keyboard,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import Draggable                              from "react-native-draggable";
import { HeaderEditTool }                     from "../HeaderEditTool";
import { SvgImage, SvgViews } from "../../../components/Common/SvgImage";
import { imageEditorAction } from "../ImageEditorAction";
import ViewShot                                                 from "react-native-view-shot";
import { Circle, ForeignObject, G, Path, Svg, Text as SvgText } from "react-native-svg";
import Icon                                                     from "react-native-vector-icons/Ionicons";
import { getBottomSpace } from "react-native-iphone-x-helper";
import useToggle from "../useToggle";

const listColor = [
    {
        color: '#FFFFFF',
        style: {},
    },
    {
        color: '#68C12C',
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

export function Texting({ renderImage, activated, width, height, originalImage, imageSize, saveImage }) {

    const [ editorState, { changeImageSie, changeAbility } ] = imageEditorAction();
    const [ textColor, setTextColor ]                        = useState('#FFFFFF');
    const [ textSize, setTextSize ]                          = useState(34);
    const [ textValue, setTextValue ]                        = useState('');
    const [ isInputting, setInputtingStatus ]                = useState(true);
    const [ isSettingColor, settingColor ]                   = useState(false);
    const [ spaceBottom, setSpaceBottom ]                    = useState(50);
    const [ textCoordinate, setTextCoordinate ]              = useState({ x: 100, y: 10 });
    const [ delta, toggleDelta ]                             = useToggle(0.01, -0.01);

    const textImageRef = useRef(null);
    const textHover    = useRef(null);

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = (e) => {
        setSpaceBottom(e.endCoordinates.height + 10 - getBottomSpace())
    };

    const _keyboardDidHide = () => {
        setSpaceBottom(50)
    };

    const _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gs) => true,
        onMoveShouldSetPanResponder: (evt, gs) => true,
        onPanResponderGrant: (evt, gesture) => saveOneCoordinate(gesture),
        onPanResponderMove: (evt, gesture) => saveOneCoordinate(gesture),
        onPanResponderRelease: (evt, gesture) => saveOneCoordinate(gesture)
    });

    const _rulerResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gs) => true,
        onMoveShouldSetPanResponder: (evt, gs) => true,
        onPanResponderGrant: (evt) => saveTextSize(evt),
        onPanResponderMove: (evt) => saveTextSize(evt),
        onPanResponderRelease: (evt) => saveTextSize(evt)
    });

    const inputRef = useRef()

    useEffect(() => {
        saveTextPosition();
    }, [textValue, textSize]);

    useEffect(() => {
        if(isInputting && inputRef) {
            inputRef.current.focus()
        }
    }, [isInputting])

    const saveTextPosition = () => {
        textHover.current && textHover.current.measure((fx, fy, textWidth, textHeight, px, py) => {
            Platform.OS === 'android' ?
                setTextCoordinate({
                x: (width - textWidth) / 2 + textWidth/20, y: textHeight - textHeight / 20
            }) :
                setTextCoordinate({
                    x: (width - textWidth) / 2 - textWidth/20, y: textHeight - textHeight / 20
                })

        });
    };

    const saveTextSize = (evt) => {

        const maxLocationY = height - (spaceBottom + 60);
        const minLocationY = height - (spaceBottom + 200);

        if (Platform.OS === 'ios' && evt.nativeEvent.locationY >= 0 && evt.nativeEvent.locationY <= 188.929) {
            setTextSize((188.929 - evt.nativeEvent.locationY) / 2);
        }

        if (Platform.OS === 'android') {
            setTextSize((maxLocationY - evt.nativeEvent.pageY) / 2);
        }
    };

    const saveOneCoordinate = (gesture) => {
        const cor = {
            x: textCoordinate.x + gesture.dx,
            y: textCoordinate.y + gesture.dy
        };
        setTextCoordinate(cor);
    };

    const handleSave = () => {
        textImageRef.current.capture().then(uri => {
            saveImage(uri);
            changeAbility(null);
            setTextValue('')
        });
    };

    const saveInputText = () => {
        saveTextPosition();
        setInputtingStatus(false);
    };

    function convertPositionY(textSize) {
        const cY = 173.929 - (textSize * 2)
        if (cY < 14) {
            return 14
        } else if (cY > 174) {
            return 174
        } else {
            return cY
        }
    }

    return (
        <View style={ { width, height } }>
            {
                isInputting ? <View style={ {
                        flexDirection: 'row',
                        height: 40,
                        paddingHorizontal: 15,
                        justifyContent: 'space-between',
                        paddingTop: 10
                    } }>
                        <View/>
                        <TouchableOpacity style={ { padding: 8 } } onPress={ () => {
                            saveInputText()
                        } }>
                            <Text style={ { fontSize: 14, fontWeight: 'bold', color: 'white' } }>
                                確定
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : HeaderEditTool({
                        changeAbility,
                        saveImage: () => handleSave(),
                    })
            }
            <View style={ { ...styles.center, width, height: height - 40 } }>
                <ViewShot ref={ textImageRef } options={ { format: "jpg", quality: 0.9 } }
                          style={ { backgroundColor: 'white', width: imageSize.width, height: imageSize.height } }>
                    <View
                        style={ {
                            position: 'absolute',
                        left: 0,
                        top: 0,
                        width: imageSize.width,
                        height: imageSize.height,
                        zIndex: 3
                    } }>
                        <Draggable
                            x={textCoordinate.x}
                            y={textCoordinate.y}
                        >
                                <TextInput
                                    ref={inputRef}
                                    rejectResponderTermination={false}
                                    style={ {
                                        width: 1000,
                                        color: textColor,
                                        fontSize: textSize,
                                        textAlign: 'left',
                                        lineHeight: textSize,
                                        fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'notoserif'
                                    } }
                                    onChangeText={ text => setTextValue(text) }
                                    maxLength={ 20 }
                                    autoFocus={true}
                                    editable={ isInputting }
                                    onSubmitEditing={ () => {
                                        saveInputText()
                                    } }
                                    value={ textValue }
                                />
                        </Draggable>

                    </View>
                    { renderImage }
                </ViewShot>

            </View>
            {
                isInputting && <View
                    { ..._rulerResponder.panHandlers }
                    style={ {
                        ...styles.center,
                        position: 'absolute',
                        bottom: spaceBottom + 60,
                        zIndex: 8,
                        left: 10,
                        width: 30,
                        height: 188.929
                    } }>
                    <Svg height="188.929" width="30" viewBox="0 0 23 188.929">
                        <Path id="Polygon_1" d="M11.5,0,23,188.929H0Z" fill="#fff" opacity="0.6"
                              transform="translate(23 188.929) rotate(180)" data-name="Polygon 1"/>
                        <Circle cx={ 11.5 } cy={ convertPositionY(textSize) } r="15" fill="white"/>
                    </Svg>
                </View>
            }
            {
                isInputting ? <ScrollView
                        keyboardShouldPersistTaps={ 'always' }
                        horizontal={ true }
                        style={ {
                            paddingHorizontal: 5,
                            position: 'absolute',
                            zIndex: 8,
                            width,
                            bottom: spaceBottom
                        } } contentContainerStyle={ { paddingBottom: 10 } }>
                        {
                            !isSettingColor &&
                            <View style={ {
                                width: width - 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            } }>
                                <View style={ { flexDirection: 'row', marginLeft: 12 } }>
                                    <TouchableOpacity style={ { padding: 8, marginRight: 10 } }
                                                      onPress={ () => setInputtingStatus(true) }>
                                        <SvgImage source={ () => SvgViews.InsertText() }/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={ { padding: 6 } } onPress={ () => settingColor(true) }>
                                        <SvgImage source={ () => SvgViews.ColorList() }/>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={ () => setTextValue('') }>
                                    <SvgImage source={ () => SvgViews.ButtonTrash() }/>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            isSettingColor && <TouchableOpacity onPress={ () => settingColor(false) }
                                                                style={ { width: 40, justifyContent: 'center' } }>
                                <Icon style={ { marginLeft: 10, paddingVertical: 10 } } name="md-close" size={ 20 }
                                      color="#FFFFFF"/>
                            </TouchableOpacity>
                        }
                        {
                            isSettingColor && listColor.map((action, index) => {
                                if (action.color === textColor) {
                                    return (
                                        <View style={ {
                                            ...styles.center,
                                            width: 50,
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            display: 'flex'
                                        } } key={ index }>
                                            <View style={ {
                                                ...styles.center,
                                                width: 20,
                                                height: 20,
                                                backgroundColor: action.color,
                                                borderRadius: 10
                                            } }>
                                                <View style={ {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#666666'
                                                } }/>
                                            </View>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <TouchableOpacity
                                            style={ {
                                                ...styles.center,
                                                width: 50,
                                                flexGrow: 1,
                                                flexShrink: 1,
                                                display: 'flex'
                                            } }
                                            onPress={ () => {
                                                setTextColor(action.color);
                                                setTextSize(textSize + delta);
                                                toggleDelta();
                                            } } key={ index }>
                                            <View style={ {
                                                width: 20,
                                                height: 20,
                                                backgroundColor: action.color,
                                                borderRadius: 10
                                            } }/>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                    : <View style={ styles.bottomButtons }>
                        <TouchableOpacity style={ { width: 50, height: 50 } } onPress={ () => setInputtingStatus(true) }>
                            <SvgImage style={ { paddingTop: 15 } } source={ () => SvgViews.InsertText() }/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => setTextValue('') }>
                            <SvgImage source={ () => SvgViews.ButtonTrash() }/>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    bottomButtons: {
        paddingHorizontal: 5,
        position: 'absolute',
        bottom: 50,
        zIndex: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    center: { justifyContent: 'center', alignItems: 'center' }
});
