import React, { Component } from 'react';
import CarType from './CarType';
import CarSpec from './CarSpec';
import CarOptions from './CarOptions';


class CarPurchase extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <CarType></CarType>
                <CarSpec></CarSpec>
                <CarOptions></CarOptions>
            </div>
        )
    }
}

export default CarPurchase
