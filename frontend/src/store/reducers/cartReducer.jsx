const initialState = {
    items: [],
  };
  
  export default function cartReducer(state = initialState, action) {
    switch (action.type) {
      case 'ADD_TO_CART':
        const existingItem = state.items.find((item) => item._id === action.payload._id);
        if (existingItem) {
          return {
            ...state,
            items: state.items.map((item) =>
              item._id === action.payload._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      case 'REMOVE_FROM_CART':
        return {
          ...state,
          items: state.items.filter((item) => item._id !== action.payload),
        };
      case 'CLEAR_CART':
        return {
          ...state,
          items: [],
        };
      default:
        return state;
    }
  }