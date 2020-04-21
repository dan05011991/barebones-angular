import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

class CarType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            models: ['A4', 'A6', 'Q7', 'R8']
        };
    }

    selectModel = (e) => {
        console.log("model selected");
    }

    render() {

        const clickFunc = this.selectModel;
        const modelItems = this.state.models.map((model, index) =>
            <DropdownItem href='#' key={index} onClick={() => console.log('hello')}>
                {model}
            </DropdownItem>
        );

        return (
            <div>
                <Dropdown>
                    <DropdownToggle caret="true">
                        Model
                    </DropdownToggle>
                
                    <DropdownMenu>
                        {modelItems}
                    </DropdownMenu>
                    {/* <DropdownButton id='model-dropdown' title='Model'>
                        <Dropdown.Item tag="a" href='#' key='1' onClick={() => console.log('model selected')}>
                            <div>    
                                hello
                            </div>
                        </Dropdown.Item>
                    </DropdownButton> */}
                </Dropdown>
            </div>
        );
    }
}

export default CarType;