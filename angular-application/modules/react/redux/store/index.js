import { configureStore } from "@reduxjs/toolkit";

const middleware = [
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];

const A4_spec = ['A4_feature1', 'A4_feature2']
const A4_options = ['Sat Nav', 'Heated Seats', 'Auto Dim Mirrors']
const A6_spec = ['A6_feature1', 'A6_feature2', 'A6_feature3']
const A6_options = ['Sat Nav', 'Heated Seats', 'Auto Dim Mirrors', 'LED Headlights']
const R8_spec = ['R8_feature1', 'R8_feature2']
const R8_options = ['Sat Nav', 'Heated Seats', 'Auto Dim Mirrors', 'LED Headlights', 'Extra Bling']

const carPurchaseState = {
  carModels: ["A4", "A6", "R8"],
  specs: new Map([
    [
      'A4', 
      {
        spec: A4_spec,
        options: A4_options
      }
    ],
    [
      'A6',
      {
      spec: A6_spec,
      options: A6_options
      }
    ],
    [
      'R8',
      {
        model: 'R8',
        spec: R8_spec,
        options: R8_options
      }
    ]
  ]),
  
  selectedModel: 'A4',
  selectedSpec: A4_spec,
  selectedOptions: A4_options
};

function carPurchaseReducer(state = carPurchaseState, action) {
  switch (action.type) {
    case 'MODEL_CHANGED':
      const newSpecs = []
      return {
        ...state,
        selectedModel: action.selectedModel,
        selectedSpec: state.specs.get(action.selectedModel).spec,
        selectedOptions: state.specs.get(action.selectedModel).options
      }
    }
  return state;
}

const store = configureStore({
  reducer: {
    carPurchase: carPurchaseReducer,
  },
  middleware,
});


export default store;
