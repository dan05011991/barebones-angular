import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { connect } from 'react-redux';


class CarType extends Component {

    render() {
        const modelItems = this.props.carModels.map((model, index) => 
            <MenuItem label="Model" value={model} key={index} name={model}>{model}</MenuItem>
        );

        return (
            <div>
                <InputLabel htmlFor="model-select">Model</InputLabel>
                <Select value={this.props.selected} onChange={this.props.onModelChanged} 
                    inputProps = {{ name: 'selected', id: 'model-select'}}
                >
                    {modelItems}
                </Select>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onModelChanged: (event) => dispatch({type: 'MODEL_CHANGED', selectedModel: event.target.value})
    }
}

const mapStateToProps = state => {
    return { 
        carModels: state.carPurchase.carModels, 
        selected: state.carPurchase.selectedModel
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CarType);
