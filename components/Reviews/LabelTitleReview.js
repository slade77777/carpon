import React, {Component} from 'react';
import {Text, View} from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import color from "../../carpon/color";
import {connect} from "react-redux";
import {resetRenderReview} from "../../carpon/Home/Review/action/ReviewAction";

@connect(state => ({
        reRender: state.review.reRenderReview
    }),
    dispatch => ({
        resetRenderReview: () => dispatch(resetRenderReview())
    }))
export default class LabelTitleReview extends Component {

    state = {
        show: true
    };

    componentWillReceiveProps(props) {
        props.reRender && this.setState({show: false});
        (!props.reRender && !this.state.show) && setTimeout(() => {
            this.setState({show: true});
        }, 200);
        props.reRender && this.props.resetRenderReview();
    }

    renderView(onPress) {
        return (
            <Text onPress={onPress} style={{color: color.active, fontSize: 13, marginVertical: 3}}>(続きを読む)</Text>
        )
    }

    render() {
        const title = this.props.title;
        return (
            <View>
                {
                    this.state.show ?
                        <ViewMoreText
                            numberOfLines={2}
                            renderViewMore={this.renderView}
                            renderViewLess={this.renderView}
                            textStyle={{textAlign: 'left'}}
                        >
                            <Text style={{fontSize: 12}}>
                                {title}
                            </Text>
                        </ViewMoreText> :
                        <View style={{height: 15}}/>
                }
            </View>
        )
    }
}
