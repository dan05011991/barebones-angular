import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { connect } from 'react-redux';


class CarType extends Component {


    selectModel = event => {
        // this.setState({ selected: event.target.value, name: event.target.name});
        console.log('You chose ' + event.target.value);
        const name = event.target.name;
        this.setState({
            ...this.state,
            [name]: event.target.value,
        })
    };


    render() {
        const modelItems = this.props.carModels.map((model, index) => 
            <MenuItem label="Model" value={model} key={index} name={model}>{model}</MenuItem>
        );

        return (
            <div>
                <InputLabel htmlFor="model-select">Model</InputLabel>
                <Select value={this.props.selected} onChange={this.selectModel} 
                    inputProps = {{ name: 'selected', id: 'model-select'}}
                >
                    {modelItems}
                </Select>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return { 
        carModels: state.carPurchase.carModels, 
        selected: state.carPurchase.selected 
    };
};

export default connect(mapStateToProps)(CarType);
