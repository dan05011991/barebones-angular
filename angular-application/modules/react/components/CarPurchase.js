import React, { Component } from 'react';
import CarType from './CarType';
import CarSpec from './CarSpec';
import CarOptions from './CarOptions';
import  { Provider } from "react-redux";
import store from "../redux/store/index";


class CarPurchase extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Provider store={store}>
                <CarType></CarType>
                <CarSpec></CarSpec>
                <CarOptions></CarOptions>
            </Provider>
        )
    }
}

export default CarPurchase
