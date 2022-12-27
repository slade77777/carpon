import React, {PureComponent} from 'react';
import {Text} from 'react-native';
import {SvgImage, SvgViews} from "./SvgImage";
import color from '../../carpon/color';
import ButtonCarpon from "./ButtonCarpon";
import LoadingComponent from "./LoadingComponent";

export default class ButtonLike extends PureComponent {

    render() {
        const {loading, liked, total_like, ...props} = this.props;
        const Color = liked ? color.active: '#CCCCCC';
        return (
            <ButtonCarpon {...props}
                    onPress={!loading ? this.props.handleLike.bind(this) : ()=>({})}
                    style={{
                        borderColor: '#E5E5E5',
                        borderWidth: 1,
                        borderRadius: 3,
                        width: 80,
                        height: 30,
                        padding: 0,
                        alignItems: 'center',
                        alignContent: 'center',
                        backgroundColor: '#FFFFFF',
                    }}>
                {
                    loading && <LoadingComponent size={{w: 80, h: 30}}/>
                }
                <SvgImage
                    source={() => SvgViews.IconLike({color: Color})}
                    style={{width: 12, height: 10.91, marginLeft: 10, flex: 0, bottom : 2}}
                />
                <Text
                    style={{
                        color: Color,
                        padding: 0,
                        margin: 0,
                        marginLeft: 5,
                        flex: 0,
                        fontSize: 10,
                        lineHeight: 13,
                        fontWeight: 'bold'
                    }}>いいね</Text>
                <Text
                    style={{
                        color: Color,
                        padding: 0,
                        margin: 0,
                        marginLeft: 3,
                        flex: 1,
                        fontSize: 10,
                        lineHeight: 13,
                        fontWeight: 'bold'
                    }}>{total_like}</Text>
            </ButtonCarpon>

        )
    }
}
