import React , {Component} from 'react';
import {View} from "react-native";
import StarRating from 'react-native-star-rating';
import {images} from "../../assets";


export default class StarRate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: this.props.starCount
        };
    }

    onStarRatingPress(rating) {
        this.props.onStarRatingPress(rating);
    }

    StarRatingView() {
        this.state = {
            starCount: this.props.starCount
        };
    }

    render(){

        let {starSize, onPress, starCount, starImages} = this.props;
        let initImage = {
            emptyStar: images.imageEmptyStar,
            fullStar: images.imageFullStar,
            halfStar: images.imageHalfStar
        };

        let initStarSize = 33;
        let initStarCount = 0;

        try {
            starCount = parseInt(starCount, 10);
        } catch (e) {
            starCount = 0;
        }

        return (
            <View>
                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={starCount ? starCount : initStarCount}
                    selectedStar={onPress ? (rating) => this.onStarRatingPress(rating) : this.StarRatingView()}
                    emptyStar={starImages ? starImages.emptyStar : initImage.emptyStar}
                    fullStar={starImages ? starImages.fullStar : initImage.fullStar}
                    halfStar={starImages ? starImages.halfStar : initImage.halfStar}
                    starSize={starSize ? starSize : initStarSize}
                />
            </View>

        )
    }
}