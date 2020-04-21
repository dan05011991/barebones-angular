import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.css';

class MySpinner extends Component {
  render() {
    return (
      <div>
        <Button variant="primary" enabled="true">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
        </Button>{' '}
        <Button variant="primary" enabled="true">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      </div>
    );
  }
}

export default MySpinner;