const initialState = {
    orders: [],
    error: null,
  };
  
  export default function orderReducer(state = initialState, action) {
    switch (action.type) {
      case 'PLACE_ORDER_SUCCESS':
        return {
          ...state,
          orders: [...state.orders, action.payload],
          error: null,
        };
      case 'FETCH_ORDERS_SUCCESS':
        return {
          ...state,
          orders: action.payload,
          error: null,
        };
      case 'PLACE_ORDER_FAIL':
      case 'FETCH_ORDERS_FAIL':
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  }