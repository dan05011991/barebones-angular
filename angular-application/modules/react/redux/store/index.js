import { configureStore } from "@reduxjs/toolkit";

const middleware = [
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];


const carPurchaseState = {
  carModels: ["A4", "A6", "R8"],
  selected: 'A4'
};

function carPurchaseReducer(state = carPurchaseState, action) {
  // DO STUFF
  return state;
}

const store = configureStore({
  reducer: {
    carPurchase: carPurchaseReducer,
  },
  middleware,
});


export default store;
