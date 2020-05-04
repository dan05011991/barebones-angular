import React from 'react';
import CarPurchase from '../CarPurchase';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'

it('renders without crashing', () => {
    // const div = document.createElement('div');
    // ReactDOM.render('<carType/>', div);
    render(<CarPurchase/>)
    // ReactDOM.unmountComponentAtNode(div);
});

it('select R8 car', () => {
    // const div = document.createElement('div');
    // ReactDOM.render('<carType/>', div);
    render(<CarPurchase />);
    fireEvent.click(screen.getByDisplayValue('A4'));
    // fireEvent.click(screen.getByDisplayValue('R8'));
});

