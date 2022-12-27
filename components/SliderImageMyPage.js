import React, {Component} from 'react';
import ImageSlider from "react-native-image-slider";
import {userProfileService} from "../carpon/services";
import {images} from '../assets'
import {TouchableOpacity, Image, Dimensions, View} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class SliderImageMyPage extends Component {
    state = {
        images: [
            images.defaultImage
        ],
        hasImage: false
    };

    componentDidMount() {
        userProfileService.getCarPhotos(this.props.profile_id).then(photos => {
            this.setState({
                images: photos.length > 0 ? photos.map(photo => photo.url) : [images.defaultImage],
                hasImage: photos.length > 0
            })
        })
    }

    render() {
        let images = this.state.images;
        return (
            <ImageSlider loopBothSides
                         autoPlayWithInterval={0}
                         style={{height: this.props.height || 140}}
                         images={this.state.images}
                         customSlide={({index, item}) => (
                             <TouchableOpacity  activeOpacity={1} style={{width}}  key={index} onPress={() => this.props.onPress()}>
                                 {
                                     <Image source={this.state.hasImage ? {uri : images[index+1]} : images[index+1]}
                                            style={{width, height: this.props.heightImage || 250, padding: 0, margin: 0}}/>
                                 }
                             </TouchableOpacity>
                         )}
            />
        )
    }
}
