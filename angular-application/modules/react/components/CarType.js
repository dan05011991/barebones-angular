import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


class CarType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            models: ['A4', 'A6', 'Q7', 'R8'],
            selected: 'A4'
        };
    }

    selectModel = event => {
        // this.setState({ selected: event.target.value, name: event.target.name});
        console.log('You chose ' + event.target.value);
    };

    render() {
        const modelItems = this.state.models.map((model, index) => 
            <MenuItem label="Model" value={model} key={index} name={model}>{model}</MenuItem>
        );

        return (
            <div>
                <Select value={this.state.selected} onChange={this.selectModel}>
                    {modelItems}
                </Select>
            </div>
        );
    }
}

export default CarType;