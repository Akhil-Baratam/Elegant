import axios from 'axios';

export const placeOrder = (order) => async (dispatch) => {
  try {
    const res = await axios.post('/orders', order);
    dispatch({ type: 'PLACE_ORDER_SUCCESS', payload: res.data });
    dispatch({ type: 'CLEAR_CART' });
  } catch (error) {
    dispatch({ type: 'PLACE_ORDER_FAIL', payload: error.response.data });
  }
};

export const fetchOrders = () => async (dispatch) => {
  try {
    const res = await axios.get('/orders');
    dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_ORDERS_FAIL', payload: error.response.data });
  }
};