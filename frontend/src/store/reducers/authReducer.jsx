const initialState = {
    user: null,
    error: null,
  };
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
      case 'REGISTER_SUCCESS':
        return { ...state, user: action.payload, error: null };
      case 'LOGIN_FAIL':
      case 'REGISTER_FAIL':
        return { ...state, user: null, error: action.payload };
      case 'LOGOUT':
        return { ...state, user: null, error: null };
      default:
        return state;
    }
  }