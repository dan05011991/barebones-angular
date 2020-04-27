import React from 'react';
import CarType from '../CarType';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'

test('renders without crashing', () => {
    // const div = document.createElement('div');
    // ReactDOM.render('<carType/>', div);
    render(<CarType/>)
    // ReactDOM.unmountComponentAtNode(div);
});

it('select R8 car', () => {
    // const div = document.createElement('div');
    // ReactDOM.render('<carType/>', div);
    render(<CarType />);
    fireEvent.click(screen.getByDisplayValue('A4'));
    // fireEvent.click(screen.getByDisplayValue('R8'));
});

