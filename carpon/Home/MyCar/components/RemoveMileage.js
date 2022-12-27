import React, {Component} from 'react';
import {SvgImage, SvgViews} from "../../../../components/Common/SvgImage";
import {TouchableOpacity} from "react-native";
import LoadingComponent from "../../../../components/Common/LoadingComponent";
import {connect} from 'react-redux';
import {removeMileage} from "../actions/myCarAction";
import _ from 'lodash';


@connect(state => ({
    loading: state.getCar.removeMileageReady
}),
    dispatch => ({
        remove: (mileage)=> dispatch(removeMileage(mileage))
    })
)
export default class RemoveMileage extends Component {

    constructor(props) {
        super(props);
        this.handleRemove = _.debounce(this.handleRemove, 300);

    }
    state = {
        loading: false
    };

    componentWillReceiveProps(props) {
        props.loading && this.setState({loading: !props.loading})
    }

    handleRemove(item) {
        this.setState({
            loading: true
        });
        this.props.remove(item)
    }

    render() {
        const {mileage} = this.props;
        return(
            <TouchableOpacity style={{padding: 10}}
                              onPress={()=> this.handleRemove(mileage)}>
                {
                    this.state.loading &&  <LoadingComponent size={{w: 35, h: 35}}/>
                }
                <SvgImage source={SvgViews.IconCancel}/>
            </TouchableOpacity>
        )
    }
}