import React from 'react';
import { shallow } from 'enzyme';
import CarPurchase from '../CarPurchase';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('Basic unit tests', () => {
  it('Should render without crashing', () => {
    const wrapper = shallow(<CarPurchase/>);
  });
});

