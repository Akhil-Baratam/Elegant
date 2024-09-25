const initialState = {
    items: [],
    currentProduct: null,
    error: null,
  };
  
  export default function productReducer(state = initialState, action) {
    switch (action.type) {
      case 'FETCH_PRODUCTS_SUCCESS':
      case 'SEARCH_PRODUCTS_SUCCESS':
        return { ...state, items: action.payload, error: null };
      case 'FETCH_PRODUCT_DETAILS_SUCCESS':
        return { ...state, currentProduct: action.payload, error: null };
      case 'ADD_PRODUCT_SUCCESS':
        return { ...state, items: [...state.items, action.payload], error: null };
      case 'UPDATE_PRODUCT_SUCCESS':
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id ? action.payload : item
          ),
          error: null,
        };
      case 'DELETE_PRODUCT_SUCCESS':
        return {
          ...state,
          items: state.items.filter((item) => item._id !== action.payload),
          error: null,
        };
      case 'FETCH_PRODUCTS_FAIL':
      case 'FETCH_PRODUCT_DETAILS_FAIL':
      case 'ADD_PRODUCT_FAIL':
      case 'UPDATE_PRODUCT_FAIL':
      case 'DELETE_PRODUCT_FAIL':
      case 'SEARCH_PRODUCTS_FAIL':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  }