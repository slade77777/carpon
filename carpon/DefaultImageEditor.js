import {screen} from "../navigation";
import React, {Component} from 'react';
import {Colorize, Cropping, Editor, Hovering, PenTool, Texting} from "./ImageEditor";
import {getBottomSpace, getStatusBarHeight, isIphoneX} from "react-native-iphone-x-helper";
import {Dimensions, StatusBar, SafeAreaView, Image} from "react-native";
import {SvgImage, SvgViews} from "../components/Common/SvgImage";

const {width, height} = Dimensions.get('window');

@screen('DefaultImageEditor', {header: null})
export default class DefaultImageEditor extends Component {

    constructor(props) {
        let carSource = props.navigation.getParam('carSource');
        super(props);
        this.state = {
            carEdit: Array.isArray(carSource) ? carSource.slice(0, 3) : [{uri: carSource}] ,
        };
    }

    render() {
        let updateCar = this.props.navigation.getParam('updateCar');
        return (
            <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                {
                    this.state.carEdit && <Editor
                        width={width}
                        height={height - getBottomSpace() - getStatusBarHeight()}
                        imageSources={this.state.carEdit}
                        updateCar={(url) => updateCar(url)}
                        goBack={() => this.props.navigation.goBack()}
                        abilities={[
                            {
                                component: Colorize,
                                name: 'colorize',
                                icon: () => (<SvgImage source={SvgViews.Colorize}/>)
                            },
                            {
                                component: Hovering,
                                name: 'hover',
                                icon: () => (<SvgImage source={() => SvgViews.HoverPlate('white')}/>)
                            },
                            {
                                component: PenTool,
                                name: 'penTool',
                                icon: () => (<SvgImage source={() => SvgViews.IconEdit({fill: 'white'})}/>)
                            },
                            {
                                component: Cropping,
                                name: 'cropping',
                                icon: () => (<SvgImage source={() => SvgViews.Crop('white')}/>)
                            },
                            {
                                component: Texting,
                                name: 'texting',
                                icon: () => (<SvgImage source={SvgViews.InsertText}/>)
                            },
                        ]}
                    />
                }
            </SafeAreaView>
        )

    }
}
