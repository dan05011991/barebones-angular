import React from 'react';
import ReactDOM from 'react-dom';
import CarType from '../CarType';
import renderer from 'react-test-renderer';

test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render('<carType/>', div);
    ReactDOM.unmountComponentAtNode(div);
});

