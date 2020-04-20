import React, { Component } from 'react';
 
class MyList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      products : [
        { name: "Apples", category: "Fruit", price: 1.20, expiry: 10 },
        { name: "Bananas", category: "Fruit", price: 2.42, expiry: 7 },
        { name: "Pears", category: "Fruit", price: 2.02, expiry: 6 }
      ]
    };
  }

  render() {

    const productRows = this.state.products.map((product, index) =>
      <li key={index}>{product.name}</li>
    );

    return (
      <div>
        <ul>
          {productRows}
        </ul>
      </div>
    );
  }
}

export default MyList;